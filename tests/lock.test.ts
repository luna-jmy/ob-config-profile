import { describe, expect, it } from "vitest";
import { decideRole, parseLock, roleStateKey } from "../src/store/lock";
import type { RoleInput } from "../src/store/lock";

const VALID_LOCK = JSON.stringify({
	deviceId: "device-a",
	deviceName: "办公室台式机",
	claimedAt: "2026-10-09T00:00:00.000Z",
	schema: 1,
});

describe("parseLock", () => {
	it("null（文件不存在）→ missing", () => {
		expect(parseLock(null)).toEqual({ ok: false, error: "missing" });
	});

	it("非 JSON → corrupt", () => {
		expect(parseLock("not-json")).toEqual({ ok: false, error: "corrupt" });
	});

	it("空字符串（读失败兜底）→ corrupt", () => {
		expect(parseLock("")).toEqual({ ok: false, error: "corrupt" });
	});

	it("非对象 → corrupt", () => {
		expect(parseLock('"a string"')).toEqual({ ok: false, error: "corrupt" });
		expect(parseLock("42")).toEqual({ ok: false, error: "corrupt" });
	});

	it("缺 deviceId / deviceId 为空 → corrupt", () => {
		expect(parseLock('{"schema":1}')).toEqual({ ok: false, error: "corrupt" });
		expect(parseLock('{"deviceId":"  ","schema":1}')).toEqual({ ok: false, error: "corrupt" });
	});

	it("schema 非数字 → corrupt", () => {
		expect(parseLock('{"deviceId":"a","schema":"1"}')).toEqual({ ok: false, error: "corrupt" });
	});

	it("schema 高于当前版本 → future-schema（读得懂但不许按其判定）", () => {
		expect(parseLock('{"deviceId":"a","schema":2}')).toEqual({ ok: false, error: "future-schema" });
	});

	it("合法 lock → ok，可选字符串字段缺失时回落空串", () => {
		expect(parseLock('{"deviceId":"a","schema":1}')).toEqual({
			ok: true,
			lock: { deviceId: "a", deviceName: "", claimedAt: "", schema: 1 },
		});
		expect(parseLock(VALID_LOCK)).toEqual({
			ok: true,
			lock: {
				deviceId: "device-a",
				deviceName: "办公室台式机",
				claimedAt: "2026-10-09T00:00:00.000Z",
				schema: 1,
			},
		});
	});
});

function input(partial: Partial<RoleInput>): RoleInput {
	return {
		lock: parseLock(VALID_LOCK),
		poolHasContent: false,
		localDeviceId: "device-a",
		...partial,
	};
}

describe("decideRole（SPEC §3.1 判定矩阵）", () => {
	it("lock 合法且 deviceId = 本机 → master", () => {
		expect(decideRole(input({}))).toEqual({ kind: "master" });
	});

	it("lock 合法且 deviceId ≠ 本机 → apply(other-device)，带持有者名", () => {
		expect(decideRole(input({ localDeviceId: "device-b" }))).toEqual({
			kind: "apply",
			reason: "other-device",
			holderName: "办公室台式机",
		});
	});

	it("lock 缺失 + 池空 → fresh（唯一允许弹选择的场景）", () => {
		expect(decideRole(input({ lock: parseLock(null) }))).toEqual({ kind: "fresh" });
	});

	it("lock 缺失 + 池有内容 → apply(pool-without-lock)（同步时差 fail-safe）", () => {
		expect(
			decideRole(input({ lock: parseLock(null), poolHasContent: true })),
		).toEqual({ kind: "apply", reason: "pool-without-lock" });
	});

	it("lock 损坏 → 一律 apply(lock-corrupt)，不论池有没有内容", () => {
		const corrupt = parseLock("###syncthing-conflict###");
		expect(decideRole(input({ lock: corrupt }))).toEqual({
			kind: "apply",
			reason: "lock-corrupt",
		});
		expect(decideRole(input({ lock: corrupt, poolHasContent: true }))).toEqual({
			kind: "apply",
			reason: "lock-corrupt",
		});
	});

	it("未来 schema → apply(future-schema)", () => {
		expect(decideRole(input({ lock: parseLock('{"deviceId":"a","schema":9}') }))).toEqual({
			kind: "apply",
			reason: "future-schema",
		});
	});
});

describe("roleStateKey", () => {
	it("fresh / master 稳定，apply 按 reason 区分", () => {
		expect(roleStateKey({ kind: "fresh" })).toBe("fresh");
		expect(roleStateKey({ kind: "master" })).toBe("master");
		expect(roleStateKey({ kind: "apply", reason: "other-device" })).toBe("apply:other-device");
		expect(roleStateKey({ kind: "apply", reason: "pool-without-lock" })).toBe("apply:pool-without-lock");
	});
});
