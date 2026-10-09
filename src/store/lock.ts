/**
 * 主配置 lock 的解析与角色判定（纯函数，零 DOM、不 import obsidian）。
 *
 * 角色判定规则与 fail-safe 铁律见 SPEC §3.1：
 * 一切识别失败 / 不确定场景一律落到「应用配置」——宁可这台设备暂时不能同步，
 * 不可误判成主配置覆盖掉池。
 */

export const LOCK_SCHEMA = 1;

/** store 根 `pcconfig/_lock.json` 的形状（SPEC §2.2） */
export interface LockFile {
	deviceId: string;
	deviceName: string;
	claimedAt: string;
	schema: number;
}

export type LockParseResult =
	| { ok: true; lock: LockFile }
	| { ok: false; error: "missing" | "corrupt" | "future-schema" };

export type RoleDecision =
	/** 全新场景：无 lock 且池空——唯一允许弹「二选一」的情形（默认选中应用配置） */
	| { kind: "fresh" }
	| { kind: "master" }
	| {
			kind: "apply";
			reason: "other-device" | "lock-corrupt" | "future-schema" | "pool-without-lock";
			/** reason = other-device 时的持有者设备名（提示语用） */
			holderName?: string;
	  };

export interface RoleInput {
	lock: LockParseResult;
	/** 两个池 + profiles 目录里是否有任何内容（判断「有池无 lock」的同步时差场景） */
	poolHasContent: boolean;
	localDeviceId: string;
}

/** 解析 lock 文件原文；raw 为 null 表示文件不存在。字段校验失败按 corrupt 处理。 */
export function parseLock(raw: string | null): LockParseResult {
	if (raw === null) return { ok: false, error: "missing" };
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return { ok: false, error: "corrupt" };
	}
	if (typeof parsed !== "object" || parsed === null) {
		return { ok: false, error: "corrupt" };
	}
	const lock = parsed as Partial<LockFile>;
	if (typeof lock.deviceId !== "string" || lock.deviceId.trim() === "") {
		return { ok: false, error: "corrupt" };
	}
	if (typeof lock.schema !== "number" || !Number.isFinite(lock.schema)) {
		return { ok: false, error: "corrupt" };
	}
	// 新版本插件写入的 lock：读得懂 JSON 但 schema 更高——拒绝按其判定，也不许本机当主配置
	if (lock.schema > LOCK_SCHEMA) {
		return { ok: false, error: "future-schema" };
	}
	return {
		ok: true,
		lock: {
			deviceId: lock.deviceId,
			deviceName: typeof lock.deviceName === "string" ? lock.deviceName : "",
			claimedAt: typeof lock.claimedAt === "string" ? lock.claimedAt : "",
			schema: lock.schema,
		},
	};
}

/** 角色判定（按序）：
 *  1. lock 合法且 deviceId = 本机 → 主配置；
 *  2. lock 合法且 deviceId ≠ 本机 → 应用配置（other-device）；
 *  3. lock 缺失：有池 → 应用配置（pool-without-lock，同步时差 / lock 被删）；无池 → 全新；
 *  4. lock 损坏 / 未来 schema → 一律应用配置，不论池有没有内容。
 */
export function decideRole(input: RoleInput): RoleDecision {
	const { lock, poolHasContent, localDeviceId } = input;
	if (lock.ok) {
		return lock.lock.deviceId === localDeviceId
			? { kind: "master" }
			: { kind: "apply", reason: "other-device", holderName: lock.lock.deviceName };
	}
	if (lock.error === "missing") {
		return poolHasContent ? { kind: "apply", reason: "pool-without-lock" } : { kind: "fresh" };
	}
	return { kind: "apply", reason: lock.error === "corrupt" ? "lock-corrupt" : "future-schema" };
}

/** 角色判定的稳定摘要（存进 config.lastRoleState，只在变化时弹 Notice） */
export function roleStateKey(decision: RoleDecision): string {
	if (decision.kind === "fresh") return "fresh";
	if (decision.kind === "master") return "master";
	return `apply:${decision.reason}`;
}
