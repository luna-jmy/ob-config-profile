/**
 * 三方合并判定与时钟护栏（纯函数，零 DOM、不 import obsidian，SPEC §3.2）。
 *
 * 每个条目独立判定（文件粒度）：
 *   base  = 本设备 baseline 里的明文指纹（undefined = 上次同步没见过它）
 *   local = 本机当前明文指纹（undefined = 本机文件不存在）
 *   pool  = 池条目（undefined = 池里没有；deleted = 墓碑）
 *
 * 铁律：不确定（双方都变 / 无 baseline 却两边不一致）→ conflict，交给用户，
 * 绝不静默选边。
 */

import type { DeviceBaseline, PoolEntryMeta, PoolMeta } from "./pool-meta";

export type ReconcileAction =
	/** 两边一致或都不存在：无操作 */
	| { kind: "noop" }
	/** 本机有新内容（或池被外部清掉）：本机 → 池 */
	| { kind: "push" }
	/** 池有新内容：池 → 本机 */
	| { kind: "pull" }
	/** 池墓碑且本机自 baseline 后没改过：删除本机文件 */
	| { kind: "delete-local" }
	/** 本机删了且池没变：写墓碑（删除传播） */
	| { kind: "tombstone" }
	/** 双方都变（或无 baseline 且不一致）：用户裁决 */
	| { kind: "conflict" };

export interface EntrySides {
	base: string | undefined;
	local: string | undefined;
	pool: PoolEntryMeta | undefined;
}

export function classifyEntry(sides: EntrySides): ReconcileAction {
	const { base, local, pool } = sides;

	if (pool === undefined) {
		// 池里没有：本机有就推（新建，或池条目被外部清掉后恢复），没有就无事
		return local === undefined ? { kind: "noop" } : { kind: "push" };
	}

	if (pool.deleted) {
		if (local === undefined) return { kind: "noop" };
		// 本机自 baseline 后没改过 → 接受删除；改过 / 无 baseline（本机是新写入）→ 复活
		return base !== undefined && local === base ? { kind: "delete-local" } : { kind: "push" };
	}

	if (local === undefined) {
		// 池有、本机没有：本机删了，或从未见过
		if (base === undefined) return { kind: "pull" };
		return pool.fp === base ? { kind: "tombstone" } : { kind: "conflict" };
	}

	if (local === pool.fp) return { kind: "noop" };
	if (base === undefined) return { kind: "conflict" };
	if (pool.fp === base) return { kind: "push" };
	if (local === base) return { kind: "pull" };
	return { kind: "conflict" };
}

// ── 时钟护栏 ──

/** 容差：超过即认为有设备时钟异常（只防「池时间戳在未来」的投毒方向） */
export const CLOCK_TOLERANCE_MS = 5 * 60 * 1000;

/** 池 syncedAt 落在未来（超容差）→ 拒绝同步 */
export function clockSkewDetected(metaSyncedAt: string, now: Date): boolean {
	if (metaSyncedAt === "") return false;
	const ts = Date.parse(metaSyncedAt);
	return Number.isFinite(ts) && ts > now.getTime() + CLOCK_TOLERANCE_MS;
}

/**
 * 单调时间戳：写入时刻 = max(now, 池内已知最大 ts + 1s)。
 * 防快钟设备写入未来时间戳后压制其他设备的正常写入（HLC 的简化版）。
 */
export function monotonicTs(now: Date, poolMaxTs: string): string {
	const floor = Date.parse(poolMaxTs);
	if (Number.isFinite(floor) && floor + 1000 > now.getTime()) {
		return new Date(floor + 1000).toISOString();
	}
	return now.toISOString();
}

// ── 墓碑 GC ──

/** 墓碑过期兜底：即使有设备再也没同步过，90 天后也清理 */
export const TOMBSTONE_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

/**
 * 墓碑能否清理：所有已知设备的 lastSyncedAt 都已越过墓碑 ts
 * （都「看过」这个删除），或墓碑超过 90 天。
 */
export function tombstoneCollectible(
	entry: PoolEntryMeta,
	devices: Record<string, DeviceBaseline>,
	now: Date,
): boolean {
	const ts = Date.parse(entry.ts);
	if (Number.isFinite(ts) && now.getTime() - ts > TOMBSTONE_MAX_AGE_MS) return true;
	for (const device of Object.values(devices)) {
		const seen = Date.parse(device.lastSyncedAt);
		if (!Number.isFinite(seen) || seen < ts) return false;
	}
	return true;
}

/** 池内已知最大写入时间戳（entries.ts 的最大值与 syncedAt 取大） */
export function poolMaxTs(meta: PoolMeta): string {
	let max = meta.syncedAt;
	for (const entry of Object.values(meta.entries)) {
		if (entry.ts > max) max = entry.ts;
	}
	return max;
}
