/**
 * 「同步本地配置」编排（SPEC §3.2，仅 PC + 仅同步设备；前置校验在 main）。
 *
 * 0.1.0 起为**多主双向同步**：按 reconcile.ts 的三方合并分类逐条目执行——
 * 本机改了推池、池新了拉回、删除写墓碑传播、双方都变交给用户裁决；
 * 时间戳单调化 + 时钟护栏防快钟投毒。合并完成后重建移动投影。
 */

import { decryptText, encryptText, parseEnvelopeText } from "../crypto/envelope";
import { PasswordError } from "../crypto/envelope";
import { APP_FILES, INSTALL_ARTIFACTS, isCarryablePluginFile } from "../store/items";
import { fingerprint } from "../store/fingerprint";
import { metaPath } from "../store/paths";
import type { StorePaths } from "../store/paths";
import { parsePoolMeta, serializePoolMeta } from "../store/pool-meta";
import type { PoolMeta } from "../store/pool-meta";
import {
	classifyEntry,
	clockSkewDetected,
	monotonicTs,
	poolMaxTs,
	tombstoneCollectible,
} from "../store/reconcile";
import type { ConflictResolution, FirstSyncDirection } from "./sync-options";
import { buildMobileProfile, filterCommunityListForMobile, parseProfile, profileFromFileName, serializeProfile } from "../store/profile";
import type { ConfigAdapter } from "./config-adapter";

export interface SyncReport {
	/** 本机 → 池条目数 */
	pushed: number;
	/** 池 → 本机条目数 */
	pulled: number;
	/** 本机删除写墓碑数 */
	tombstoned: number;
	/** 按墓碑删除本机文件数 */
	deletedLocal: number;
	/** 墓碑 GC 数 */
	prunedMeta: number;
	/** 冲突解决方向（null = 没发生冲突） */
	conflictsResolved: ConflictResolution | null;
	mobileProjection: boolean;
}

/** 池 syncedAt 落在未来（时钟护栏）→ 拒绝同步 */
export class ClockSkewError extends Error {
	constructor() {
		super("clock skew detected");
		this.name = "ClockSkewError";
	}
}

/** 用户在弹窗里取消（首同步方向 / 冲突裁决） */
export class SyncAbortedError extends Error {
	constructor() {
		super("sync aborted by user");
		this.name = "SyncAbortedError";
	}
}

export interface SyncDeviceIdentity {
	id: string;
	name: string;
}

export interface SyncCallbacks {
	syncArtifacts: boolean;
	/** 首次同步（本机无 baseline 且池有内容）方向确认；取消 → 中止 */
	firstSyncDirection: () => Promise<FirstSyncDirection | null>;
	/** 冲突裁决（全局二选一）；取消 → 中止 */
	resolveConflicts: (files: string[]) => Promise<ConflictResolution | null>;
}

export class SyncService {
	constructor(
		private readonly adapter: ConfigAdapter,
		private readonly paths: StorePaths,
		private readonly device: SyncDeviceIdentity,
		private readonly callbacks: SyncCallbacks,
	) {}

	async run(password: string | null): Promise<SyncReport> {
		const meta = parsePoolMeta(await this.adapter.readIfExists(metaPath(this.paths.pcPool)));
		const now = new Date();
		if (clockSkewDetected(meta.syncedAt, now)) throw new ClockSkewError();

		// 旧版（≤0.0.3）lock 文件：多主模型没有 lock，见到即清
		await this.adapter.deletePath(`${this.paths.pcPool.base}/_lock.json`);

		const report: SyncReport = {
			pushed: 0,
			pulled: 0,
			tombstoned: 0,
			deletedLocal: 0,
			prunedMeta: 0,
			conflictsResolved: null,
			mobileProjection: false,
		};

		// 写入时间戳：单调化（不早于池内已知最大 ts + 1s）
		const writeTs = monotonicTs(now, poolMaxTs(meta));
		const local = await this.collectLocal();
		const mine = meta.devices[this.device.id];
		const firstSync = mine === undefined;

		if (firstSync && Object.keys(meta.entries).length > 0) {
			// 首次同步护栏：本机无 baseline 且池有内容 → 用户定方向
			const direction = await this.callbacks.firstSyncDirection();
			if (direction === null) throw new SyncAbortedError();
			if (direction === "local-to-pool") {
				for (const [key, content] of local) {
					await this.pushPool(meta, key, content, password, writeTs);
					report.pushed++;
				}
				for (const key of Object.keys(meta.entries)) {
					if (!local.has(key)) {
						if (!this.callbacks.syncArtifacts && this.isPluginArtifactKey(key)) continue;
						this.writeTombstone(meta, key, writeTs);
						report.tombstoned++;
					}
				}
			} else {
				for (const [key, entry] of Object.entries(meta.entries)) {
					if (entry.deleted) continue;
					if (!this.callbacks.syncArtifacts && this.isPluginArtifactKey(key)) continue;
					await this.pullLocal(key, await this.readPool(key, password), report);
				}
			}
		} else {
			// 正常三方合并
			const keys = new Set<string>([...local.keys(), ...Object.keys(meta.entries)]);
			const conflicts: string[] = [];
			for (const key of keys) {
				// 关闭主体同步的设备不参与主体条目的合并（别设备上传的不拉、不删、不墓碑）
				if (!this.callbacks.syncArtifacts && this.isPluginArtifactKey(key)) continue;
				const action = classifyEntry({
					base: mine?.baseline[key],
					local: local.has(key) ? fingerprint(local.get(key) as string) : undefined,
					pool: meta.entries[key],
				});
				switch (action.kind) {
					case "noop":
						break;
					case "push":
						await this.pushPool(meta, key, local.get(key) as string, password, writeTs);
						report.pushed++;
						break;
					case "pull":
						await this.pullLocal(key, await this.readPool(key, password), report);
						break;
					case "tombstone":
						this.writeTombstone(meta, key, writeTs);
						report.tombstoned++;
						break;
					case "delete-local":
						await this.deleteLocalFile(key);
						report.deletedLocal++;
						break;
					case "conflict":
						conflicts.push(key);
						break;
				}
			}
			if (conflicts.length > 0) {
				const resolution = await this.callbacks.resolveConflicts(conflicts);
				if (resolution === null) throw new SyncAbortedError();
				report.conflictsResolved = resolution;
				for (const key of conflicts) {
					if (resolution === "local") {
						await this.pushPool(meta, key, local.get(key) as string, password, writeTs);
						report.pushed++;
					} else {
						await this.pullLocal(key, await this.readPool(key, password), report);
					}
				}
			}
		}

		// ── 收尾：baseline / 墓碑 GC / devices / meta.json ──
		const baseline: Record<string, string> = {};
		for (const [key, entry] of Object.entries(meta.entries)) {
			if (entry.deleted) continue;
			baseline[key] = entry.fp;
		}
		for (const key of Object.keys(meta.entries)) {
			const entry = meta.entries[key];
			if (entry?.deleted && tombstoneCollectible(entry, meta.devices, now)) {
				delete meta.entries[key];
				report.prunedMeta++;
			}
		}
		meta.syncedAt = monotonicTs(now, poolMaxTs(meta));
		meta.encrypted = password !== null;
		meta.devices[this.device.id] = {
			name: this.device.name,
			lastSyncedAt: meta.syncedAt,
			baseline,
		};
		await this.adapter.mkdir(this.paths.pcPool.base);
		await this.adapter.writeAtomic(metaPath(this.paths.pcPool), serializePoolMeta(meta));

		// ── 移动投影（存在 mobile profile 时，基于合并后的本机状态重建） ──
		report.mobileProjection = await this.buildMobileProjection(password);
		return report;
	}

	// ── 本机状态收集 ──

	/** key → 明文内容（key 空间：app/<file>、plugins/<id>/<rel>、snippets/<name>、themes/<name>） */
	private async collectLocal(): Promise<Map<string, string>> {
		const local = new Map<string, string>();
		for (const spec of APP_FILES) {
			const raw = await this.adapter.obsidianRead(spec.file);
			if (raw !== null) local.set(`app/${spec.file}`, raw);
		}
		const plugins = await this.adapter.listInstalledPlugins();
		for (const plugin of plugins) {
			const files = await this.adapter.listPluginFilesRel(plugin.id);
			for (const rel of files) {
				const fileName = rel.split("/").pop() ?? rel;
				if (!this.callbacks.syncArtifacts && !isCarryablePluginFile(fileName)) continue;
				const raw = await this.adapter.obsidianRead(`plugins/${plugin.id}/${rel}`);
				if (raw !== null) local.set(`plugins/${plugin.id}/${rel}`, raw);
			}
		}
		// snippets：只收松散 css；themes：松散 css + 文件夹主题（新版 Obsidian 主题是目录树）
		for (const name of await this.adapter.listFileNames(this.adapter.obsidianPath("snippets"))) {
			const raw = await this.adapter.readIfExists(this.adapter.obsidianPath(`snippets/${name}`));
			if (raw !== null) local.set(`snippets/${name}`, raw);
		}
		const themeDir = this.adapter.obsidianPath("themes");
		const themeChildren = await this.adapter.listChildNames(themeDir);
		for (const name of themeChildren.files) {
			const raw = await this.adapter.readIfExists(`${themeDir}/${name}`);
			if (raw !== null) local.set(`themes/${name}`, raw);
		}
		for (const folder of themeChildren.folders) {
			for (const file of await this.adapter.listFilesRecursive(`${themeDir}/${folder}`)) {
				const raw = await this.adapter.readIfExists(file);
				if (raw !== null) local.set(`themes/${file.slice(themeDir.length + 1)}`, raw);
			}
		}
		return local;
	}

	// ── 编解码（主体明文例外：syncArtifacts 开启时安装产物不加密） ──

	private async encode(key: string, plain: string, password: string | null): Promise<string> {
		if (password === null) return plain;
		const fileName = key.split("/").pop() ?? key;
		if (this.callbacks.syncArtifacts && key.startsWith("plugins/") && INSTALL_ARTIFACTS.has(fileName)) {
			return plain;
		}
		return JSON.stringify(await encryptText(password, plain), null, "\t");
	}

	private async readPool(key: string, password: string | null): Promise<string> {
		const raw = await this.adapter.readIfExists(this.poolPath(key));
		if (raw === null) throw new Error(`pool entry missing: ${key}`);
		const envelope = parseEnvelopeText(raw);
		if (envelope === null) return raw;
		if (password === null) throw new Error(`encrypted entry but no password: ${key}`);
		try {
			return await decryptText(password, envelope);
		} catch (error) {
			if (error instanceof PasswordError) throw new Error(`cannot decrypt pool entry: ${key}`);
			throw error;
		}
	}

	// ── 动作执行 ──

	private poolPath(key: string): string {
		return `${this.paths.pcPool.base}/${key}`;
	}

	/** key 是否为插件安装产物（main.js / styles.css / manifest.json） */
	private isPluginArtifactKey(key: string): boolean {
		return key.startsWith("plugins/") && INSTALL_ARTIFACTS.has(key.split("/").pop() ?? key);
	}

	private async pushPool(
		meta: PoolMeta,
		key: string,
		plain: string,
		password: string | null,
		ts: string,
	): Promise<void> {
		const fp = fingerprint(plain);
		await this.adapter.mkdir(this.dirname(this.poolPath(key)));
		await this.adapter.writeAtomic(this.poolPath(key), await this.encode(key, plain, password));
		meta.entries[key] = { fp, ts, deviceId: this.device.id };
	}

	private writeTombstone(meta: PoolMeta, key: string, ts: string): void {
		meta.entries[key] = { fp: "", ts, deviceId: this.device.id, deleted: true };
	}

	private async pullLocal(key: string, plain: string, report: SyncReport): Promise<void> {
		if (key.startsWith("app/")) {
			await this.adapter.obsidianWrite(key.slice("app/".length), plain);
		} else {
			await this.adapter.mkdir(this.dirname(this.adapter.obsidianPath(key)));
			await this.adapter.writeText(this.adapter.obsidianPath(key), plain);
		}
		report.pulled++;
	}

	private async deleteLocalFile(key: string): Promise<void> {
		await this.adapter.deletePath(this.adapter.obsidianPath(key));
	}

	private dirname(path: string): string {
		const idx = path.lastIndexOf("/");
		return idx === -1 ? "" : path.slice(0, idx);
	}

	// ── 移动投影（SPEC §3.2 末步；mobileconfig 由 PC 重建，手机永不写池） ──

	private async buildMobileProjection(password: string | null): Promise<boolean> {
		const profileFiles = await this.adapter.listFileNames(this.paths.profilesDir);
		const mobileProfiles = profileFiles
			.map((name) => profileFromFileName(name))
			.filter((entry): entry is { name: string; platform: "mobile" } => entry?.platform === "mobile");
		if (mobileProfiles.length === 0) return false;

		const transform =
			password === null
				? undefined
				: async (content: string, relPath: string): Promise<string> => {
						const fileName = relPath.split("/").pop() ?? relPath;
						if (this.callbacks.syncArtifacts && INSTALL_ARTIFACTS.has(fileName)) return content;
						return JSON.stringify(await encryptText(password, content), null, "\t");
					};
		const put = async (dstPath: string, content: string): Promise<void> => {
			await this.adapter.writeAtomic(dstPath, password === null ? content : await transform!(content, ""));
		};

		const localPlugins = await this.adapter.listInstalledPlugins();
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

		// 非 desktopOnly 插件 → mobileconfig/plugins/<id>（主体按同一开关带/不带）
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
					excludeFileName: (fileName) =>
						this.callbacks.syncArtifacts ? false : !isCarryablePluginFile(fileName),
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
