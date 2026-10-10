/**
 * 启动角色判定（纯函数，零 DOM、不 import obsidian）。
 *
 * 0.1.0 起没有 lock：角色只是各设备 data.json 里的本地偏好（SPEC §3.1），
 * 多台设备可同时为「同步设备」（多主时间戳同步），不需要也无法在启动时判定
 * 归属——唯一入口是 preferredRole，没选过就问一次。
 */

export type DeviceRole = "sync" | "apply";

export type StartupDecision = { kind: "ask" } | { kind: "role"; role: DeviceRole };

/** preferredRole = ask → 弹首次选择；否则按偏好静默进入角色 */
export function decideStartupRole(preferredRole: "ask" | DeviceRole): StartupDecision {
	if (preferredRole === "ask") return { kind: "ask" };
	return { kind: "role", role: preferredRole };
}
