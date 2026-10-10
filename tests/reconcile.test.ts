import { describe, expect, it } from "vitest";
import {
	classifyEntry,
	clockSkewDetected,
	monotonicTs,
	poolMaxTs,
	tombstoneCollectible,
} from "../src/store/reconcile";
import type { PoolEntryMeta, PoolMeta } from "../src/store/pool-meta";

const entry = (over: Partial<PoolEntryMeta> = {}): PoolEntryMeta => ({
	fp: "poolfp",
	ts: "2026-10-10T00:00:00.000Z",
	deviceId: "other",
	...over,
});

describe("classifyEntry（三方合并矩阵）", () => {
	it("两边一致 / 都不存在 → noop", () => {
		expect(classifyEntry({ base: undefined, local: undefined, pool: undefined })).toEqual({ kind: "noop" });
		expect(classifyEntry({ base: "x", local: "x", pool: entry({ fp: "x" }) })).toEqual({ kind: "noop" });
	});

	it("池没有、本机有 → push（新建或恢复）", () => {
		expect(classifyEntry({ base: undefined, local: "a", pool: undefined })).toEqual({ kind: "push" });
		expect(classifyEntry({ base: "a", local: "a", pool: undefined })).toEqual({ kind: "push" });
	});

	it("本机没变、池新了 → pull", () => {
		expect(classifyEntry({ base: "old", local: "old", pool: entry({ fp: "new" }) })).toEqual({ kind: "pull" });
		// 从未见过（无 baseline）但本机也没有 → 池新文件 → pull
		expect(classifyEntry({ base: undefined, local: undefined, pool: entry() })).toEqual({ kind: "pull" });
	});

	it("池没变、本机改了 → push", () => {
		expect(classifyEntry({ base: "old", local: "new", pool: entry({ fp: "old" }) })).toEqual({ kind: "push" });
	});

	it("本机删了、池没变 → tombstone（删除传播）", () => {
		expect(classifyEntry({ base: "old", local: undefined, pool: entry({ fp: "old" }) })).toEqual({
			kind: "tombstone",
		});
	});

	it("本机删了、池也改了 → conflict（不确定绝不静默选边）", () => {
		expect(classifyEntry({ base: "old", local: undefined, pool: entry({ fp: "new" }) })).toEqual({
			kind: "conflict",
		});
	});

	it("双方都改（或无 baseline 且不一致）→ conflict", () => {
		expect(classifyEntry({ base: "old", local: "mine", pool: entry({ fp: "theirs" }) })).toEqual({
			kind: "conflict",
		});
		expect(classifyEntry({ base: undefined, local: "mine", pool: entry({ fp: "theirs" }) })).toEqual({
			kind: "conflict",
		});
	});

	it("墓碑：本机自 baseline 后没改 → delete-local；改过或新写入 → push（复活）", () => {
		expect(classifyEntry({ base: "old", local: "old", pool: entry({ fp: "", deleted: true }) })).toEqual({
			kind: "delete-local",
		});
		expect(classifyEntry({ base: "old", local: "new", pool: entry({ fp: "", deleted: true }) })).toEqual({
			kind: "push",
		});
		expect(classifyEntry({ base: undefined, local: "new", pool: entry({ fp: "", deleted: true }) })).toEqual({
			kind: "push",
		});
		expect(classifyEntry({ base: "x", local: undefined, pool: entry({ fp: "", deleted: true }) })).toEqual({
			kind: "noop",
		});
	});
});

describe("时钟护栏", () => {
	const now = new Date("2026-10-10T12:00:00.000Z");

	it("池 syncedAt 在未来超容差 → 拒绝", () => {
		expect(clockSkewDetected("2026-10-10T12:06:00.000Z", now)).toBe(true);
		expect(clockSkewDetected("2026-10-10T12:04:00.000Z", now)).toBe(false); // 容差内
		expect(clockSkewDetected("2026-10-10T11:00:00.000Z", now)).toBe(false); // 过去不算
		expect(clockSkewDetected("", now)).toBe(false);
	});

	it("monotonicTs：池最大 ts 在未来 → 抬到 max+1s，防止后续写入被压制", () => {
		expect(monotonicTs(now, "2026-10-10T12:30:00.000Z")).toBe("2026-10-10T12:30:01.000Z");
		expect(monotonicTs(now, "2026-10-10T11:00:00.000Z")).toBe(now.toISOString());
	});
});

describe("墓碑 GC", () => {
	const now = new Date("2026-10-10T12:00:00.000Z");
	const stone = entry({ fp: "", ts: "2026-10-09T00:00:00.000Z", deleted: true });

	it("所有设备都已同步过墓碑时刻 → 可清理", () => {
		const devices = {
			a: { name: "A", lastSyncedAt: "2026-10-10T00:00:00.000Z", baseline: {} },
			b: { name: "B", lastSyncedAt: "2026-10-09T12:00:00.000Z", baseline: {} },
		};
		expect(tombstoneCollectible(stone, devices, now)).toBe(true);
	});

	it("还有设备没见过 → 保留", () => {
		const devices = {
			a: { name: "A", lastSyncedAt: "2026-10-10T00:00:00.000Z", baseline: {} },
			b: { name: "B", lastSyncedAt: "2026-10-08T00:00:00.000Z", baseline: {} },
		};
		expect(tombstoneCollectible(stone, devices, now)).toBe(false);
	});

	it("超过 90 天兜底清理（即使有设备再也不上线）", () => {
		const old = entry({ fp: "", ts: "2026-06-01T00:00:00.000Z", deleted: true });
		expect(tombstoneCollectible(old, {}, now)).toBe(true);
	});
});

describe("poolMaxTs", () => {
	it("entries.ts 与 syncedAt 取最大（ISO 字典序）", () => {
		const meta: PoolMeta = {
			schema: 2,
			syncedAt: "2026-10-10T00:00:00.000Z",
			encrypted: false,
			entries: {
				a: entry({ ts: "2026-10-09T00:00:00.000Z" }),
				b: entry({ ts: "2026-10-11T00:00:00.000Z" }),
			},
			devices: {},
		};
		expect(poolMaxTs(meta)).toBe("2026-10-11T00:00:00.000Z");
	});
});
