/**
 * 「应用 profile」编排（SPEC §3.3）：池 → 本机 `.obsidian` 整文件覆盖。
 * 调用前 main 已确保：密码可用（store 加密时）、profile 可解析。
 * 应用后必须重载——由调用方（main）弹确认框走 adapter.reloadApp()。
 */

import { decryptText, PasswordError, parseEnvelopeText } from "../crypto/envelope";
import type { StorePaths } from "../store/paths";
import type { ProfileDoc } from "../store/profile";
import type { ConfigAdapter } from "./config-adapter";

export interface ApplyReport {
	/** 已写入的条目（展示用相对路径） */
	applied: string[];
	/** 池里有、本机未安装的插件 id（提示自行安装） */
	missingPlugins: string[];
	/** mobile 端被剔除的桌面专属插件 id（防手工改 profile 塞进桌面插件） */
	desktopOnlySkipped: string[];
}

export class WrongStorePasswordError extends Error {
	constructor() {
		super("wrong store password");
		this.name = "WrongStorePasswordError";
	}
}

export class ApplyService {
	constructor(
		private readonly adapter: ConfigAdapter,
		private readonly paths: StorePaths,
	) {}

	/** profile.platform 决定用哪个池：mobile profile 只读移动投影 */
	private poolBase(profile: ProfileDoc): string {
		return profile.platform === "mobile" ? this.paths.mobilePool.base : this.paths.pcPool.base;
	}

	/** 读池条目：密文条目解密；密码错误统一抛 WrongStorePasswordError（中止，调用方重弹密码框） */
	private async readPoolEntry(path: string, password: string | null): Promise<string | null> {
		const raw = await this.adapter.readIfExists(path);
		if (raw === null) return null;
		const envelope = parseEnvelopeText(raw);
		if (envelope === null) return raw;
		if (password === null) throw new WrongStorePasswordError();
		try {
			return await decryptText(password, envelope);
		} catch (error) {
			if (error instanceof PasswordError) throw new WrongStorePasswordError();
			throw error;
		}
	}

	async run(profile: ProfileDoc, password: string | null): Promise<ApplyReport> {
		const report: ApplyReport = { applied: [], missingPlugins: [], desktopOnlySkipped: [] };
		const base = this.poolBase(profile);

		// mobile 端防御性再过滤 isDesktopOnly（防手工改 profile 塞进桌面插件，SPEC §3.3 第 2 步）
		const pluginIds = [...profile.plugins];
		if (this.adapter.isMobile) {
			for (const id of [...pluginIds]) {
				const manifestRaw = await this.adapter.obsidianRead(`plugins/${id}/manifest.json`);
				if (manifestRaw !== null) {
					try {
						const manifest = JSON.parse(manifestRaw) as { isDesktopOnly?: unknown };
						if (manifest.isDesktopOnly === true) {
							pluginIds.splice(pluginIds.indexOf(id), 1);
							report.desktopOnlySkipped.push(id);
						}
					} catch {
						// 本机 manifest 损坏：照常应用
					}
				}
			}
		}

		// ── app 级文件 ──
		for (const file of profile.app) {
			const content = await this.readPoolEntry(`${base}/app/${file}`, password);
			if (content === null) continue;
			await this.adapter.obsidianWrite(file, content);
			report.applied.push(file);
		}

		// ── 社区插件 ──
		for (const id of pluginIds) {
			if (!(await this.adapter.hasLocalPluginDir(id))) {
				report.missingPlugins.push(id);
				continue;
			}
			const copied = await this.adapter.copyTree(
				`${base}/plugins/${id}`,
				this.adapter.obsidianPath(`plugins/${id}`),
				{
					transform: (content) => this.readPoolEntryFromContent(content, password),
				},
			);
			if (copied.length > 0) report.applied.push(`plugins/${id}`);
		}

		// ── snippets / themes ──
		for (const name of profile.snippets) {
			const content = await this.readPoolEntry(`${base}/snippets/${name}`, password);
			if (content === null) continue;
			await this.adapter.mkdir(this.adapter.obsidianPath("snippets"));
			await this.adapter.obsidianWrite(`snippets/${name}`, content);
			report.applied.push(`snippets/${name}`);
		}
		for (const name of profile.themes) {
			const content = await this.readPoolEntry(`${base}/themes/${name}`, password);
			if (content === null) continue;
			await this.adapter.mkdir(this.adapter.obsidianPath("themes"));
			await this.adapter.obsidianWrite(`themes/${name}`, content);
			report.applied.push(`themes/${name}`);
		}

		return report;
	}

	/** copyTree 的变换：内容是信封则解密（树内文件已在池里，不再读盘） */
	private async readPoolEntryFromContent(content: string, password: string | null): Promise<string> {
		const envelope = parseEnvelopeText(content);
		if (envelope === null) return content;
		if (password === null) throw new WrongStorePasswordError();
		try {
			return await decryptText(password, envelope);
		} catch (error) {
			if (error instanceof PasswordError) throw new WrongStorePasswordError();
			throw error;
		}
	}
}
