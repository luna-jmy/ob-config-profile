import { describe, expect, it } from "vitest";
import { EMPTY_POOL_META, parsePoolMeta, serializePoolMeta } from "../src/store/pool-meta";

describe("parsePoolMeta", () => {
	it("不存在 / 损坏 → 空 meta（fail-safe，走首同步护栏）", () => {
		expect(parsePoolMeta(null)).toEqual(EMPTY_POOL_META);
		expect(parsePoolMeta("not json")).toEqual(EMPTY_POOL_META);
		expect(parsePoolMeta("42")).toEqual(EMPTY_POOL_META);
	});

	it("schema 1（0.0.3）→ 读时升级：fp 平移、ts 取 syncedAt、无 devices", () => {
		const v1 = JSON.stringify({
			schema: 1,
			syncedAt: "2026-10-01T00:00:00.000Z",
			deviceName: "PC",
			encrypted: true,
			entries: { "app/app.json": "abc123", "snippets/x.css": "def456" },
		});
		const meta = parsePoolMeta(v1);
		expect(meta.schema).toBe(2);
		expect(meta.syncedAt).toBe("2026-10-01T00:00:00.000Z");
		expect(meta.encrypted).toBe(true);
		expect(meta.devices).toEqual({});
		expect(meta.entries["app/app.json"]).toEqual({
			fp: "abc123",
			ts: "2026-10-01T00:00:00.000Z",
			deviceId: "",
		});
	});

	it("schema 2 roundtrip（含墓碑与 devices）", () => {
		const meta = {
			schema: 2 as const,
			syncedAt: "2026-10-10T00:00:00.000Z",
			encrypted: true,
			entries: {
				"app/app.json": { fp: "a", ts: "2026-10-10T00:00:00.000Z", deviceId: "d1" },
				"plugins/x/data.json": { fp: "", ts: "2026-10-09T00:00:00.000Z", deviceId: "d2", deleted: true as const },
			},
			devices: {
				d1: { name: "PC1", lastSyncedAt: "2026-10-10T00:00:00.000Z", baseline: { "app/app.json": "a" } },
			},
		};
		expect(parsePoolMeta(serializePoolMeta(meta))).toEqual(meta);
	});

	it("字段类型不对回落默认（不整份拒绝）", () => {
		const raw = JSON.stringify({
			schema: 2,
			syncedAt: 123,
			encrypted: "yes",
			entries: { bad: "not-an-object", ok: { fp: 1, ts: "t", deviceId: "d" } },
			devices: { d: { name: 1, lastSyncedAt: [], baseline: { k: 2 } } },
		});
		const meta = parsePoolMeta(raw);
		expect(meta.syncedAt).toBe("");
		expect(meta.encrypted).toBe(false);
		expect(meta.entries).toEqual({ ok: { fp: "", ts: "t", deviceId: "d" } });
		expect(meta.devices).toEqual({ d: { name: "", lastSyncedAt: "", baseline: {} } });
	});
});
