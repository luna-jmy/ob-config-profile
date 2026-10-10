/**
 * 「同步本地配置」编排（SPEC §3.2，仅 PC + 仅主配置；调用前 main 已做 lock 校验）：
 * 全量刷新 pcconfig（app / plugins / snippets / themes，排除安装产物与自身插件）→
 * 存在 mobile profile 时重建 mobileconfig 投影 + 刷新 mobile profile 文档。
 */

import { encryptText } from "../crypto/envelope";
import { fingerprint } from "../store/fingerprint";
import { APP_FILES, isCarryablePluginFile } from "../store/items";
import { buildMobileProfile, filterCommunityListForMobile, parseProfile, profileFromFileName, serializeProfile } from "../store/profile";
import type { ConfigAdapter } from "./config-adapter";
import type { StorePaths } from "../store/paths";

export interface SyncReport {
	updated: number;
	skipped: number;
	pruned: number;
	mobileProjection: boolean;
}

interface PoolMeta {
	schema: 1;
	syncedAt: string;
	deviceName: string;
	encrypted: boolean;
	entries: Record<string, string>;
}

export class SyncService {
	constructor(
		private readonly adapter: ConfigAdapter,
		private readonly paths: StorePaths,
		private readonly deviceName: string,
	) {}

	async run(password: string | null): Promise<SyncReport> {
		const meta = await this.readMeta();
		const entries: Record<string, string> = {};
		let updated = 0;
		let skipped = 0;
		let pruned = 0;

		const transform =
			password === null
				? undefined
				: async (content: string): Promise<string> => JSON.stringify(await encryptText(password, content), null, "\t");

		// 写一个池条目：指纹未变跳过；否则写盘并记新指纹
		const put = async (key: string, dstPath: string, content: string): Promise<void> => {
			const finalContent = transform ? await transform(content) : content;
			const fp = fingerprint(finalContent);
			entries[key] = fp;
			if (meta.entries[key] === fp) {
				skipped++;
				return;
			}
			await this.adapter.writeAtomic(dstPath, finalContent);
			updated++;
		};

		// ── app 级文件 ──
		for (const spec of APP_FILES) {
			const raw = await this.adapter.obsidianRead(spec.file);
			if (raw === null) {
				// 源头没有：全量刷新语义 → 池里的旧副本一并清掉
				if (meta.entries[`app/${spec.file}`] !== undefined) {
					await this.adapter.deletePath(`${this.paths.pcPool.app}/${spec.file}`);
					delete entries[`app/${spec.file}`];
					pruned++;
				}
				continue;
			}
			await this.adapter.mkdir(this.paths.pcPool.app);
			await put(`app/${spec.file}`, `${this.paths.pcPool.app}/${spec.file}`, raw);
		}

		// ── 社区插件（排除自身 + 安装产物三件） ──
		const localPlugins = await this.adapter.listInstalledPlugins();
		const poolPluginIds = await this.adapter.listPoolPluginIds(this.paths.pcPool);
		for (const id of poolPluginIds) {
			if (!localPlugins.some((plugin) => plugin.id === id)) {
				await this.adapter.deletePath(`${this.paths.pcPool.plugins}/${id}`);
				pruned++;
			}
		}
		if (localPlugins.length > 0) await this.adapter.mkdir(this.paths.pcPool.plugins);
		for (const plugin of localPlugins) {
			const copied = await this.adapter.copyTree(
				this.adapter.obsidianPath(`plugins/${plugin.id}`),
				`${this.paths.pcPool.plugins}/${plugin.id}`,
				{ excludeFileName: (fileName) => !isCarryablePluginFile(fileName), transform },
			);
			updated += copied.length;
		}

		// ── snippets / themes（文件级，同样走加密——全库语义） ──
		pruned += await this.syncFlatDir("snippets", this.paths.pcPool.snippets, "snippets", entries, meta, transform);
		pruned += await this.syncFlatDir("themes", this.paths.pcPool.themes, "themes", entries, meta, transform);

		// ── _meta.json ──
		const newMeta: PoolMeta = {
			schema: 1,
			syncedAt: new Date().toISOString(),
			deviceName: this.deviceName,
			encrypted: password !== null,
			entries,
		};
		await this.adapter.writeAtomic(`${this.paths.pcPool.base}/_meta.json`, JSON.stringify(newMeta, null, "\t"));

		// ── 移动投影（存在 mobile profile 时） ──
		const mobileProjection = await this.buildMobileProjection(password, localPlugins);

		return { updated, skipped, pruned, mobileProjection };
	}

	/** 文件级目录（snippets/themes）：源文件全量入池（含加密）+ 池内多余清除 */
	private async syncFlatDir(
		srcRel: string,
		dstDir: string,
		keyPrefix: string,
		entries: Record<string, string>,
		meta: PoolMeta,
		transform: ((content: string) => Promise<string>) | undefined,
	): Promise<number> {
		const srcDir = this.adapter.obsidianPath(srcRel);
		const localNames = await this.adapter.listFileNames(srcDir);
		let pruned = 0;
		if (localNames.length > 0) await this.adapter.mkdir(dstDir);
		for (const name of localNames) {
			const raw = await this.adapter.readIfExists(`${srcDir}/${name}`);
			if (raw === null) continue;
			const finalContent = transform ? await transform(raw) : raw;
			const fp = fingerprint(finalContent);
			entries[`${keyPrefix}/${name}`] = fp;
			if (meta.entries[`${keyPrefix}/${name}`] === fp) continue;
			await this.adapter.writeAtomic(`${dstDir}/${name}`, finalContent);
		}
		for (const name of await this.adapter.listFileNames(dstDir)) {
			if (!localNames.includes(name)) {
				await this.adapter.deletePath(`${dstDir}/${name}`);
				delete entries[`${keyPrefix}/${name}`];
				pruned++;
			}
		}
		return pruned;
	}

	private async readMeta(): Promise<PoolMeta> {
		const raw = await this.adapter.readIfExists(`${this.paths.pcPool.base}/_meta.json`);
		if (raw === null) return { schema: 1, syncedAt: "", deviceName: "", encrypted: false, entries: {} };
		try {
			const parsed = JSON.parse(raw) as Partial<PoolMeta>;
			return {
				schema: 1,
				syncedAt: typeof parsed.syncedAt === "string" ? parsed.syncedAt : "",
				deviceName: typeof parsed.deviceName === "string" ? parsed.deviceName : "",
				encrypted: parsed.encrypted === true,
				entries:
					typeof parsed.entries === "object" && parsed.entries !== null
						? parsed.entries
						: {},
			};
		} catch {
			return { schema: 1, syncedAt: "", deviceName: "", encrypted: false, entries: {} };
		}
	}

	/**
	 * 移动投影（SPEC §3.2 第 3 步）：mobileconfig 只放 core/community 两个 app 文件
	 * （community 按本机 manifest 剔除 isDesktopOnly 插件）+ 非 desktopOnly 插件；
	 * 同时把 mobile profile 文档按当前桌面 profile 重新生成。
	 */
	private async buildMobileProjection(password: string | null, localPlugins: { id: string; isDesktopOnly: boolean }[]): Promise<boolean> {
		const profileFiles = await this.adapter.listFileNames(this.paths.profilesDir);
		const mobileProfiles = profileFiles
			.map((name) => profileFromFileName(name))
			.filter((entry): entry is { name: string; platform: "mobile" } => entry?.platform === "mobile");
		if (mobileProfiles.length === 0) return false;

		const transform =
			password === null
				? undefined
				: async (content: string): Promise<string> => JSON.stringify(await encryptText(password, content), null, "\t");
		const put = async (dstPath: string, content: string): Promise<void> => {
			await this.adapter.writeAtomic(dstPath, transform ? await transform(content) : content);
		};

		const desktopOnly = new Set(localPlugins.filter((p) => p.isDesktopOnly).map((p) => p.id));
		await this.adapter.mkdir(this.paths.mobilePool.app);

		const core = await this.adapter.obsidianRead("core-plugins.json");
		if (core !== null) await put(`${this.paths.mobilePool.app}/core-plugins.json`, core);
		const community = await this.adapter.obsidianRead("community-plugins.json");
		if (community !== null) {
			await put(
				`${this.paths.mobilePool.app}/community-plugins.json`,
				filterCommunityListForMobile(community, desktopOnly),
			);
		}

		// 非 desktopOnly 插件 → mobileconfig/plugins/<id>
		const allowed = localPlugins.filter((p) => !desktopOnly.has(p.id));
		const mobilePoolIds = await this.adapter.listPoolPluginIds(this.paths.mobilePool);
		for (const id of mobilePoolIds) {
			if (!allowed.some((p) => p.id === id)) {
				await this.adapter.deletePath(`${this.paths.mobilePool.plugins}/${id}`);
			}
		}
		if (allowed.length > 0) await this.adapter.mkdir(this.paths.mobilePool.plugins);
		for (const plugin of allowed) {
			await this.adapter.copyTree(
				this.adapter.obsidianPath(`plugins/${plugin.id}`),
				`${this.paths.mobilePool.plugins}/${plugin.id}`,
				{
					excludeFileName: (fileName) => !isCarryablePluginFile(fileName),
					transform,
				},
			);
		}

		// mobile profile 文档重新生成（跟随桌面 profile 与当前 isDesktopOnly 集合）
		for (const entry of mobileProfiles) {
			const desktopRaw = await this.adapter.readIfExists(`${this.paths.profilesDir}/${entry.name}.json`);
			if (desktopRaw === null) continue;
			const parsed = parseProfile(desktopRaw);
			if (!parsed.ok || parsed.profile.platform !== "desktop") continue;
			const twin = buildMobileProfile(parsed.profile, desktopOnly);
			await this.adapter.writeAtomic(
				`${this.paths.profilesDir}/${entry.name}.mobile.json`,
				serializeProfile(twin),
			);
		}
		return true;
	}
}
