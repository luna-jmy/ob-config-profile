/**
 * config-adapter：访问宿主内部面的**唯一**文件（AGENTS.md §4.6 内部 API 收口）。
 *
 * 本文件负责：
 * - 设备 id：App#loadLocalStorage / saveLocalStorage（obsidian.d.ts:1398/1406，App 成员、
 *   since 1.8.7，vault 作用域；localStorage 是设备本地的，绝不进 vault / store——SPEC §2.4）；
 * - 平台探测：Platform.isMobile（obsidian.d.ts:7041，公开导出）；
 * - store 读写：DataAdapter（app.vault.adapter，obsidian.d.ts:3190 起，公开类型）。
 *
 * 走 Adapter 而非 Vault API 的理由（兼容性指南「必要的 Adapter 使用须说明原因」）：
 * store 需要直接创建文件夹 / 逐文件写文本，且后续里程碑要读写 `.obsidian/` 点目录
 * （Vault API 访问不了）；统一从这一处进出，别处不碰 adapter。
 * 路径进入 adapter 前一律过 normalizePath。
 */

import { normalizePath, Platform } from "obsidian";
import type { App } from "obsidian";
import { LOCK_SCHEMA } from "../store/lock";
import type { LockFile } from "../store/lock";
import { lockPath } from "../store/paths";
import type { StorePaths } from "../store/paths";

const DEVICE_ID_KEY = "cp-device-id";

function randomId(): string {
	const c = globalThis.crypto;
	if (c && typeof c.randomUUID === "function") {
		return c.randomUUID();
	}
	return `cp-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

export class ConfigAdapter {
	constructor(private readonly app: App) {}

	/** 平台探测（SPEC §2.4：只读事实，不提供切换） */
	get isMobile(): boolean {
		return Platform.isMobile;
	}

	/**
	 * 本机设备 id：首次访问时生成并落 localStorage；之后稳定不变。
	 * 注意绝不写入 vault / store（同步后双机同 id，识别就失效——SPEC §11.1）。
	 */
	deviceId(): string {
		const existing = this.app.loadLocalStorage(DEVICE_ID_KEY);
		if (typeof existing === "string" && existing !== "") return existing;
		const id = randomId();
		this.app.saveLocalStorage(DEVICE_ID_KEY, id);
		return id;
	}

	private get adapter() {
		return this.app.vault.adapter;
	}

	private n(path: string): string {
		return normalizePath(path);
	}

	/** lock 原文：文件不存在 → null；存在但读失败 → 抛出（调用方按 corrupt 处理） */
	async readLockRaw(paths: StorePaths): Promise<string | null> {
		const p = this.n(lockPath(paths));
		if (!(await this.adapter.exists(p))) return null;
		return this.adapter.read(p);
	}

	/** 写入主配置 lock（夺取主配置 / 首次选择主配置时调用） */
	async writeLock(paths: StorePaths, lock: LockFile): Promise<void> {
		await this.adapter.mkdir(this.n(paths.pcPool.base));
		await this.adapter.write(this.n(lockPath(paths)), JSON.stringify(lock, null, "\t"));
	}

	/** 删除 lock（让出主配置） */
	async deleteLock(paths: StorePaths): Promise<void> {
		await this.adapter.rmdir(this.n(lockPath(paths)), true);
	}

	/** 组装一份 lock 内容（写盘前调用方只管名字，id / 时间戳 / schema 在这里保证） */
	buildLock(deviceName: string): LockFile {
		return {
			deviceId: this.deviceId(),
			deviceName,
			claimedAt: new Date().toISOString(),
			schema: LOCK_SCHEMA,
		};
	}

	/**
	 * 两个池 + profiles 目录 + store 根级文件里是否有任何内容。
	 * 用于「有池无 lock」的同步时差识别（SPEC §3.1 fail-safe）。
	 */
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
}
