/**
 * config-adapter / apply-service 回归：文件夹主题。
 * 0.1.6 前 readIfExists 只判 exists——池内 themes/<名> 是目录（同步侧按目录树存），
 * read 目录在桌端抛 EISDIR，应用必炸（issue：应用失败 EISDIR）。
 * 修法：stat 判型，非文件按 null 返回，apply 侧自然回退 copyTree 目录分支。
 */

import { describe, expect, it } from "vitest";
import type { App } from "obsidian";
import { ConfigAdapter } from "../src/services/config-adapter";
import { ApplyService } from "../src/services/apply-service";
import { storePaths } from "../src/store/paths";
import type { ProfileDoc } from "../src/store/profile";

interface Node {
	type: "file" | "folder";
	content?: string;
}

/** fixture 刻意不用默认目录名：顺带验证 ConfigAdapter 走 vault.configDir 间接层 */
const CFG_DIR = "cfg-dir";

/** 内存文件树 → ConfigAdapter 所需的最小 app.vault.adapter 形状 */
function fakeApp(fs: Record<string, Node>, configDir = CFG_DIR): App {
	const norm = (p: string) => p.replace(/\\/g, "/").replace(/\/+/g, "/").replace(/^\/+|\/+$/g, "");
	return {
		vault: {
			configDir,
			adapter: {
				async exists(p: string) {
					const q = norm(p);
					if (q in fs) return true;
					// 目录随子路径隐式存在（真实 FS 语义；copyTree 只存文件不建目录节点）
					return Object.keys(fs).some((k) => k.startsWith(q + "/"));
				},
				async stat(p: string) {
					const q = norm(p);
					const node = fs[q];
					if (node) return { type: node.type, ctime: 0, mtime: 0, size: 0 };
					if (Object.keys(fs).some((k) => k.startsWith(q + "/"))) {
						return { type: "folder", ctime: 0, mtime: 0, size: 0 };
					}
					return null;
				},
				async read(p: string) {
					const node = fs[norm(p)];
					if (node?.type === "folder") {
						throw new Error("EISDIR: illegal operation on a directory, read");
					}
					if (!node) throw new Error("not found: " + p);
					return node.content ?? "";
				},
				async list(p: string) {
					const prefix = norm(p) + "/";
					const files: string[] = [];
					const folders: string[] = [];
					for (const key of Object.keys(fs)) {
						if (!key.startsWith(prefix)) continue;
						const rest = key.slice(prefix.length);
						if (rest.includes("/")) {
							const child = norm(p) + "/" + rest.split("/")[0];
							if (!folders.includes(child)) folders.push(child);
						} else {
							files.push(key);
						}
					}
					return { files, folders };
				},
				async mkdir(p: string) {
					fs[norm(p)] = { type: "folder" };
				},
				async write(p: string, content: string) {
					fs[norm(p)] = { type: "file", content };
				},
				async rename(from: string, to: string) {
					const node = fs[norm(from)];
					if (!node) throw new Error("not found: " + from);
					delete fs[norm(from)];
					fs[norm(to)] = node;
				},
				async rmdir(p: string) {
					const prefix = norm(p) + "/";
					for (const key of Object.keys(fs)) {
						if (key === norm(p) || key.startsWith(prefix)) delete fs[key];
					}
				},
			},
		},
	} as unknown as App;
}

const POOL_THEME_DIR = "SettingProfiles/pcconfig/themes/gemini";

function profileDoc(themes: string[]): ProfileDoc {
	return {
		name: "daily",
		platform: "desktop",
		adaptedFrom: null,
		app: [],
		plugins: [],
		snippets: [],
		themes,
		createdAt: "2026-01-01T00:00:00.000Z",
		updatedAt: "2026-01-01T00:00:00.000Z",
	};
}

describe("readIfExists 对目录的口径", () => {
	it("目录存在时返回 null（不 read、不 EISDIR）", async () => {
		const adapter = new ConfigAdapter(fakeApp({ [POOL_THEME_DIR]: { type: "folder" } }));
		expect(await adapter.readIfExists(POOL_THEME_DIR)).toBeNull();
	});

	it("文件正常读出内容；不存在返回 null", async () => {
		const adapter = new ConfigAdapter(
			fakeApp({ "SettingProfiles/pcconfig/themes/old.css": { type: "file", content: "body{}" } }),
		);
		expect(await adapter.readIfExists("SettingProfiles/pcconfig/themes/old.css")).toBe("body{}");
		expect(await adapter.readIfExists("SettingProfiles/pcconfig/themes/absent.css")).toBeNull();
	});
});

describe("应用 profile 含文件夹主题（EISDIR 回归）", () => {
	it("目录主题走 copyTree 分支，树内文件落到配置目录的 themes 下", async () => {
		const fs: Record<string, Node> = {
			[`${POOL_THEME_DIR}/manifest.json`]: { type: "file", content: '{"name":"gemini"}' },
			[`${POOL_THEME_DIR}/theme.css`]: { type: "file", content: "body{color:red}" },
		};
		const adapter = new ConfigAdapter(fakeApp(fs));
		const report = await new ApplyService(adapter, storePaths("SettingProfiles")).run(
			profileDoc(["gemini"]),
			null,
		);
		expect(report.applied).toContain("themes/gemini");
		expect(fs[`${CFG_DIR}/themes/gemini/theme.css`]).toMatchObject({ type: "file", content: "body{color:red}" });
		expect(fs[`${CFG_DIR}/themes/gemini/manifest.json`]).toMatchObject({
			type: "file",
			content: '{"name":"gemini"}',
		});
	});

	it("松散 css 主题仍走单文件分支", async () => {
		const fs: Record<string, Node> = {
			"SettingProfiles/pcconfig/themes/old.css": { type: "file", content: "body{}" },
		};
		const adapter = new ConfigAdapter(fakeApp(fs));
		const report = await new ApplyService(adapter, storePaths("SettingProfiles")).run(
			profileDoc(["old.css"]),
			null,
		);
		expect(report.applied).toContain("themes/old.css");
		expect(fs[`${CFG_DIR}/themes/old.css`]).toMatchObject({ type: "file", content: "body{}" });
	});
});
