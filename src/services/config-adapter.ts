/**
 * config-adapter：访问宿主内部面的**唯一**文件（AGENTS.md §4.6 内部 API 收口）。
 *
 * 收口内容（全部对过 obsidian.d.ts 1.8.7）：
 * - store 密码：App#loadLocalStorage / saveLocalStorage（:1398/1406，since 1.8.7，
 *   vault 作用域、设备本地——密码绝不进 vault / store / data.json，SPEC §2.5）；
 *   设备 id 0.1.0 起存 data.json，localStorage 只留作旧值迁移源；
 * - 平台探测：Platform.isMobile（:7041，公开导出）；
 * - `.obsidian` 与 store 读写：DataAdapter（app.vault.adapter，:3190 起；vault.configDir :10196）；
 *   走 Adapter 而非 Vault API 的理由：点目录 Vault API 访问不了，且需要逐文件复制 / 原子写；
 * - `app:reload`：宿主无公开命令执行 API（d.ts 0 命中，与 cw 核实一致）→ 运行时探测
 *   app.commands.executeCommandById，失败返回 false 由调用方降级为手动指引。
 *
 * 路径进入 adapter 前一律过 normalizePath。
 */

import { normalizePath, Platform } from "obsidian";
import type { App } from "obsidian";
import type { PoolPaths, StorePaths } from "../store/paths";
import { SELF_PLUGIN_ID } from "../store/items";

const LEGACY_DEVICE_ID_KEY = "cp-device-id";
const STORE_PASSWORD_KEY = "cp-store-password";

export interface PluginInfo {
	id: string;
	name: string;
	isDesktopOnly: boolean;
}

export class ConfigAdapter {
	constructor(private readonly app: App) {}

	/** 平台探测（SPEC §2.4：只读事实，不提供切换） */
	get isMobile(): boolean {
		return Platform.isMobile;
	}

	/**
	 * 旧版（≤0.0.3）存在 localStorage 的设备 id：只读迁移源，不写回。
	 * 0.1.0 起 deviceId 存 data.json（清缓存不丢）；无旧值 → null，调用方生成新 id。
	 */
	legacyDeviceId(): string | null {
		const value = this.app.loadLocalStorage(LEGACY_DEVICE_ID_KEY);
		return typeof value === "string" && value !== "" ? value : null;
	}

	// ── store 密码（SPEC §2.5：只存各设备本地） ──

	storePassword(): string | null {
		const value = this.app.loadLocalStorage(STORE_PASSWORD_KEY);
		return typeof value === "string" && value !== "" ? value : null;
	}

	setStorePassword(password: string | null): void {
		this.app.saveLocalStorage(STORE_PASSWORD_KEY, password);
	}

	// ── store 结构探测 ──

	/** store 根目录是否存在于本机（设置页三态提示用：区分「没同步到」与「未加密」） */
	async storeDirExists(paths: StorePaths): Promise<boolean> {
		return this.adapter.exists(this.n(paths.root));
	}

	async poolHasContent(paths: StorePaths): Promise<boolean> {
		if (!(await this.adapter.exists(this.n(paths.root)))) return false;
		const dirs = [paths.pcPool.base, paths.mobilePool.base, paths.profilesDir];
		for (const dir of dirs) {
			if (!(await this.adapter.exists(this.n(dir)))) continue;
			const listed = await this.adapter.list(this.n(dir));
			if (listed.files.length > 0 || listed.folders.length > 0) return true;
		}
		const rootListed = await this.adapter.list(this.n(paths.root));
		return rootListed.files.length > 0;
	}

	// ── `.obsidian` 读写（configDir 是公开属性） ──

	private get configDir(): string {
		return this.app.vault.configDir;
	}

	/** `.obsidian/<rel>` 的 vault 相对完整路径（服务层组树路径用，不硬编码点目录名） */
	obsidianPath(rel: string): string {
		return `${this.configDir}/${rel}`;
	}

	/** 读 `.obsidian/<rel>`；不存在 → null */
	async obsidianRead(rel: string): Promise<string | null> {
		const p = this.n(`${this.configDir}/${rel}`);
		if (!(await this.adapter.exists(p))) return null;
		return this.adapter.read(p);
	}

	async obsidianExists(rel: string): Promise<boolean> {
		return this.adapter.exists(this.n(`${this.configDir}/${rel}`));
	}

	/** 原子写 `.obsidian/<rel>`（先写 .cp-tmp 再 rename，失败不损坏原文件——SPEC §3.3） */
	async obsidianWrite(rel: string, content: string): Promise<void> {
		await this.writeAtomic(`${this.configDir}/${rel}`, content);
	}

	/** `.obsidian/plugins` 下已安装社区插件的清单（读各目录 manifest.json） */
	async listInstalledPlugins(): Promise<PluginInfo[]> {
		return this.listPluginManifests(`${this.configDir}/plugins`);
	}

	/** 插件目录内的相对文件路径（递归；目录不存在 → 空数组）。同步枚举插件文件用 */
	async listPluginFilesRel(id: string): Promise<string[]> {
		const root = this.n(`${this.configDir}/plugins/${id}`);
		if (!(await this.adapter.exists(root))) return [];
		const out: string[] = [];
		const walk = async (dir: string): Promise<void> => {
			const listed = await this.adapter.list(this.n(dir));
			out.push(...listed.files.map((file) => file.slice(root.length + 1)));
			for (const folder of listed.folders) await walk(folder);
		};
		await walk(root);
		return out;
	}

	/** 池内插件目录只有 id（manifest 是安装产物被排除，SPEC §9.3） */
	async listPoolPluginIds(pool: PoolPaths): Promise<string[]> {
		const root = this.n(pool.plugins);
		if (!(await this.adapter.exists(root))) return [];
		const listed = await this.adapter.list(root);
		return listed.folders.map((folder) => folder.split("/").pop() ?? folder);
	}

	private async listPluginManifests(pluginsRoot: string): Promise<PluginInfo[]> {
		const root = this.n(pluginsRoot);
		if (!(await this.adapter.exists(root))) return [];
		const out: PluginInfo[] = [];
		const { folders } = await this.adapter.list(root);
		for (const folder of folders) {
			const id = folder.split("/").pop() ?? folder;
			if (id === SELF_PLUGIN_ID) continue;
			const manifestRaw = await this.readIfExists(`${folder}/manifest.json`);
			let name = id;
			let isDesktopOnly = false;
			if (manifestRaw !== null) {
				try {
					const manifest = JSON.parse(manifestRaw) as { name?: unknown; isDesktopOnly?: unknown };
					if (typeof manifest.name === "string" && manifest.name !== "") name = manifest.name;
					isDesktopOnly = manifest.isDesktopOnly === true;
				} catch {
					// manifest 损坏按「只有 id」处理
				}
			}
			out.push({ id, name, isDesktopOnly });
		}
		return out;
	}

	/** 列目录下的文件名（不含子目录）；目录不存在 → 空数组 */
	async listFileNames(dir: string): Promise<string[]> {
		const p = this.n(dir);
		if (!(await this.adapter.exists(p))) return [];
		const listed = await this.adapter.list(p);
		return listed.files.map((file) => file.split("/").pop() ?? file);
	}

	/** 列目录直接子项名（文件与文件夹；目录不存在 → 空）——主题目录：松散 css 与文件夹主题并存 */
	async listChildNames(dir: string): Promise<{ files: string[]; folders: string[] }> {
		const p = this.n(dir);
		if (!(await this.adapter.exists(p))) return { files: [], folders: [] };
		const listed = await this.adapter.list(p);
		return {
			files: listed.files.map((file) => file.split("/").pop() ?? file),
			folders: listed.folders.map((folder) => folder.split("/").pop() ?? folder),
		};
	}

	/** 递归列出一棵目录树下的全部文件（vault 相对路径） */
	async listFilesRecursive(root: string): Promise<string[]> {
		const p = this.n(root);
		if (!(await this.adapter.exists(p))) return [];
		const out: string[] = [];
		const walk = async (dir: string): Promise<void> => {
			const listed = await this.adapter.list(this.n(dir));
			out.push(...listed.files);
			for (const folder of listed.folders) await walk(folder);
		};
		await walk(p);
		return out;
	}

	async mkdir(path: string): Promise<void> {
		await this.adapter.mkdir(this.n(path));
	}

	async readIfExists(path: string): Promise<string | null> {
		const p = this.n(path);
		if (!(await this.adapter.exists(p))) return null;
		return this.adapter.read(p);
	}

	async writeText(path: string, content: string): Promise<void> {
		await this.adapter.write(this.n(path), content);
	}

	/** 原子写：tmp → rename；rename 不支持覆盖的平台退化为直接写（tmp 尽力清理） */
	async writeAtomic(path: string, content: string): Promise<void> {
		const p = this.n(path);
		const tmp = `${p}.cp-tmp`;
		await this.adapter.write(tmp, content);
		try {
			await this.adapter.rename(tmp, p);
		} catch {
			await this.adapter.write(p, content);
			await this.adapter.rmdir(tmp, true).catch(() => undefined);
		}
	}

	async deletePath(path: string): Promise<void> {
		const p = this.n(path);
		if (!(await this.adapter.exists(p))) return;
		const stat = await this.adapter.stat(p);
		// rmdir 只用于目录（官方 API 口径），删文件必须走 remove——否则平台行为不定
		if (stat?.type === "file") await this.adapter.remove(p);
		else await this.adapter.rmdir(p, true);
	}

	async renamePath(from: string, to: string): Promise<void> {
		await this.adapter.rename(this.n(from), this.n(to));
	}

	/**
	 * 复制源目录树 → 目标目录树（只复制文件，逐个可变换内容、可按文件名排除）。
	 * 返回复制的目标相对路径列表（目标根下的相对路径）。
	 */
	async copyTree(
		srcRoot: string,
		dstRoot: string,
		options: {
			excludeFileName?: (fileName: string, relPath: string) => boolean;
			transform?: (content: string, relPath: string) => Promise<string>;
		} = {},
	): Promise<string[]> {
		const files = await this.listFilesRecursive(srcRoot);
		const copied: string[] = [];
		for (const file of files) {
			const relPath = file.slice(this.n(srcRoot).length + 1);
			const fileName = relPath.split("/").pop() ?? relPath;
			if (options.excludeFileName?.(fileName, relPath)) continue;
			const content = await this.adapter.read(file);
			const transformed = options.transform ? await options.transform(content, relPath) : content;
			await this.mkdir(this.dirname(`${dstRoot}/${relPath}`));
			await this.writeText(`${dstRoot}/${relPath}`, transformed);
			copied.push(relPath);
		}
		return copied;
	}

	/** 同步池时判断 `.obsidian/plugins/<id>` 是否存在（应用端比对缺失插件用） */
	hasLocalPluginDir(id: string): Promise<boolean> {
		return this.obsidianExists(`plugins/${id}/manifest.json`);
	}

	/**
	 * 重载 Obsidian（SPEC §3.3：应用后必须重载，运行中插件退出回写会覆盖刚应用的文件）。
	 * 宿主无公开命令执行 API → 运行时探测内部 app.commands；失败返回 false。
	 */
	reloadApp(): boolean {
		const app = this.app as unknown as {
			commands?: { executeCommandById?: (id: string) => boolean };
		};
		if (typeof app.commands?.executeCommandById === "function") {
			return app.commands.executeCommandById("app:reload");
		}
		return false;
	}

	private dirname(path: string): string {
		const idx = path.lastIndexOf("/");
		return idx === -1 ? "" : path.slice(0, idx);
	}

	private get adapter() {
		return this.app.vault.adapter;
	}

	private n(path: string): string {
		return normalizePath(path);
	}
}
