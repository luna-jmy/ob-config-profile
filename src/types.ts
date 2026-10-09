/**
 * 插件配置（`data.json`）。字段名避开宿主保留的 `settings`（AGENTS.md §4.8，
 * minAppVersion 1.8.7 < 1.13），设置对象叫 `config`。
 *
 * 注意：本文件在同步黑名单里——Config Profile 永不同步自己的 data.json
 * （SPEC §0.6：角色与路径在里面，同步过去就是鸡生蛋）。
 */

export type LanguageSetting = "auto" | "zh" | "en";

export interface CPConfig {
	/** store 的 vault 相对路径（SPEC §2.1，默认 vault 根 SettingProfiles） */
	storePath: string;
	/** 界面语言（auto = 跟随 Obsidian） */
	language: LanguageSetting;
	/** 设备显示名（空串 = 用运行时按平台生成的默认名） */
	deviceName: string;
	/**
	 * 全新 store 场景下用户选过「应用配置」后不再重复弹选择框；
	 * 出现 lock 后此偏好失效，判定以 lock 为准（SPEC §3.1）。
	 */
	preferredRole: "ask" | "apply";
	/** 上次启动时的角色判定摘要（用于只在变化时提示，避免每次启动刷 Notice） */
	lastRoleState: string;
}

export const DEFAULT_STORE_PATH = "SettingProfiles";

export const DEFAULT_CONFIG: CPConfig = {
	storePath: DEFAULT_STORE_PATH,
	language: "auto",
	deviceName: "",
	preferredRole: "ask",
	lastRoleState: "",
};

/** 合并持久化配置与默认值；只接受类型匹配的字段，损坏数据回落默认（可重复执行）。 */
export function mergeConfig(saved: unknown): CPConfig {
	const source = (saved ?? {}) as Partial<CPConfig>;
	return {
		storePath: typeof source.storePath === "string" && source.storePath.trim() !== "" ? source.storePath : DEFAULT_STORE_PATH,
		language: source.language === "zh" || source.language === "en" ? source.language : "auto",
		deviceName: typeof source.deviceName === "string" ? source.deviceName : "",
		preferredRole: source.preferredRole === "apply" ? "apply" : "ask",
		lastRoleState: typeof source.lastRoleState === "string" ? source.lastRoleState : "",
	};
}
