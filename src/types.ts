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
	/** 设备显示名：仅来源标注（同步记录 / 冲突提示），不参与匹配；空串 = 平台默认名 */
	deviceName: string;
	/** 持久设备身份（data.json，不清缓存、不同步；空串 = 尚未生成，onload 补齐） */
	deviceId: string;
	/**
	 * 角色偏好（SPEC §3.1，0.1.0 起无 lock，角色只是本地偏好）：
	 * ask = 尚未选择（启动弹一次）；sync = 同步设备（多主，可写池）；apply = 仅应用。
	 */
	preferredRole: "ask" | "sync" | "apply";
	/** 同步插件主体（main.js/styles.css/manifest.json，明文不加密）；下次同步生效 */
	syncArtifacts: boolean;
	/** 应用侧同步插件主体（SPEC §3.3）：开 = 应用时连主体一起装齐；关 = 只应用配置 */
	applyArtifacts: boolean;
}

export const DEFAULT_STORE_PATH = "SettingProfiles";

export const DEFAULT_CONFIG: CPConfig = {
	storePath: DEFAULT_STORE_PATH,
	language: "auto",
	deviceName: "",
	deviceId: "",
	preferredRole: "ask",
	syncArtifacts: false,
	applyArtifacts: false,
};

/** 合并持久化配置与默认值；只接受类型匹配的字段，损坏数据回落默认（可重复执行）。 */
export function mergeConfig(saved: unknown): CPConfig {
	const source = (saved ?? {}) as Partial<CPConfig>;
	return {
		storePath: typeof source.storePath === "string" && source.storePath.trim() !== "" ? source.storePath : DEFAULT_STORE_PATH,
		language: source.language === "zh" || source.language === "en" ? source.language : "auto",
		deviceName: typeof source.deviceName === "string" ? source.deviceName : "",
		deviceId: typeof source.deviceId === "string" ? source.deviceId : "",
		preferredRole:
			source.preferredRole === "sync" || source.preferredRole === "apply" ? source.preferredRole : "ask",
		syncArtifacts: source.syncArtifacts === true,
		applyArtifacts: source.applyArtifacts === true,
	};
}
