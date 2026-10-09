/**
 * 英文字典：键 = 中文原文。check-i18n.mjs 校验 t("…") 字面量与这里的一致性。
 */

export const EN: Record<string, string> = {
	// ── 角色名 ──
	"主配置": "Master",
	"应用配置": "Apply-only",
	"手机": "Mobile",
	"PC": "PC",
	"尚未设定": "Not set yet",
	// ── 首次运行弹窗 ──
	"选择本机角色": "Choose this device's role",
	"当前 vault 内没有发现配置库。本机是「主配置」（把本机 Obsidian 配置同步到 store），还是「应用配置」（只应用其他设备同步来的配置）？":
		"No config store found in this vault. Is this device the master (captures this machine's Obsidian settings into the store) or apply-only (only applies settings synced from other devices)?",
	"本机为主配置（同步本机配置到 store）": "This device is the master (sync local config into the store)",
	"本机为应用配置": "This device is apply-only",
	"不确定就选应用配置——应用配置不会写入 store，随时可以在设置里改。":
		"When in doubt choose apply-only — it never writes to the store, and you can change the role anytime in settings.",
	// ── 角色判定 Notice ──
	"本机已设为主配置。": "This device is now the master.",
	"本机已设为应用配置。": "This device is now apply-only.",
	"检测到主配置来自设备《{name}》，本机已设为应用配置。若主配置其实属于本机（重装或清除数据后身份丢失），请在设置中重新夺取。":
		"The master role belongs to \"{name}\"; this device is set to apply-only. If that is actually this machine (identity lost after reinstall or data wipe), re-claim the master role in settings.",
	"无法确认主配置归属（lock 文件损坏），本机暂按应用配置处理。":
		"Cannot confirm master ownership (lock file is corrupted); this device stays apply-only for now.",
	"store 由更新版本的 Config Profile 写入，本机暂按应用配置处理。请更新插件。":
		"The store was written by a newer version of Config Profile; this device stays apply-only for now. Please update the plugin.",
	"无法确认主配置归属（配置池存在但没有 lock，可能同步未完成），本机暂按应用配置处理。":
		"Cannot confirm master ownership (pool exists but no lock — sync may be incomplete); this device stays apply-only for now.",
	// ── 设置页 ──
	"Config Profile": "Config Profile",
	"通用": "General",
	"角色": "Role",
	"配置库路径": "Store path",
	"store 在 vault 内的路径（默认 SettingProfiles，vault 根）。修改后重载插件生效。":
		"Path of the store inside the vault (default: SettingProfiles at the vault root). Reload the plugin after changing.",
	"设备名": "Device name",
	"显示在主配置归属提示里，帮助识别哪台设备持有主配置。":
		"Shown in master-ownership notices so you can tell which device holds the role.",
	"语言": "Language",
	"跟随 Obsidian": "Follow Obsidian",
	"中文": "Chinese",
	"English": "English",
	"当前角色": "Current role",
	"主配置持有者：{name}": "Master held by: {name}",
	"夺取主配置": "Claim master role",
	"让出主配置": "Release master role",
	"将以本机身份接管 store 的主配置。原主配置设备会在下次操作前自动降级为应用配置。继续？":
		"This device will take over the master role of the store. The previous master automatically drops to apply-only before its next write. Continue?",
	"让出后 store 暂无主配置，所有设备都只能应用，直到有人重新夺取。继续？":
		"After releasing, the store has no master and every device can only apply, until someone claims it again. Continue?",
	"已接管主配置。": "Master role claimed.",
	"已让出主配置。": "Master role released.",
	"夺取或让出失败：{message}": "Claim or release failed: {message}",
	"取消": "Cancel",
};
