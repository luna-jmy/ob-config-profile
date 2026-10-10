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
	// ── 命令 ──
	"同步本地配置": "Sync local settings",
	"应用配置：{name}": "Apply profile: {name}",
	"查看/编辑配置：{name}": "View/edit profile: {name}",
	"{name}（手机）": "{name} (mobile)",
	// ── 同步 / 应用 Notice ──
	"密码不正确。": "Wrong password.",
	"手机端只能应用配置，不能同步。": "Mobile devices can only apply profiles, not sync.",
	"本机不是主配置设备，不能同步。可在设置中夺取主配置。":
		"This device is not the master, so it cannot sync. Claim the master role in settings.",
	"同步完成：更新 {updated} 项，跳过 {skipped} 项，清理 {pruned} 项。":
		"Sync finished: {updated} updated, {skipped} skipped, {pruned} pruned.",
	"已更新移动投影。": " Mobile projection updated.",
	"同步失败：{message}": "Sync failed: {message}",
	"找不到 profile：{name}": "Profile not found: {name}",
	"profile 文件损坏：{name}": "Profile file is corrupted: {name}",
	"profile 里没有勾选任何内容：{name}": "Nothing is checked in this profile: {name}",
	"应用失败：{message}": "Apply failed: {message}",
	"名称不能为空，且不能包含 / 或 \\。": "Name cannot be empty and must not contain / or \\.",
	"同名 profile 已存在：{name}": "A profile with this name already exists: {name}",
	"已创建 profile。重载插件后新命令生效。": "Profile created. Reload the plugin to register its commands.",
	// ── 应用结果弹窗 ──
	"已应用 profile：{name}": "Applied profile: {name}",
	"已应用 {count} 项。重载 Obsidian 使配置生效？": "Applied {count} items. Reload Obsidian to take effect?",
	"没有可应用的条目。": "Nothing to apply.",
	"必须重载：运行中的插件退出时会把内存里的旧配置写回，不重载会覆盖刚应用的文件。":
		"Reload is required: running plugins write their in-memory settings back on exit, which would overwrite the files just applied.",
	"以下插件本机未安装，已跳过（安装后重新应用即可）：":
		"These plugins are not installed here and were skipped (install them, then apply again):",
	"以下插件为桌面专属，已从手机端剔除：": "These desktop-only plugins were excluded on mobile:",
	"关闭": "Close",
	"稍后手动重载": "Reload later manually",
	"立即重载": "Reload now",
	"无法自动重载，请手动重启 Obsidian（Ctrl/Cmd+R 或重启应用）。":
		"Cannot reload automatically; please restart Obsidian manually (Ctrl/Cmd+R or restart the app).",
	// ── 密码弹窗 ──
	"为配置库设置密码": "Set a store password",
	"store 将随你的笔记同步，插件配置里可能含 token 等敏感信息——默认整库加密，密码只存各设备本地，不进 vault。":
		"The store syncs with your notes and plugin settings may contain tokens and other secrets — it is encrypted as a whole by default. The password is stored per device, never in the vault.",
	"密码": "Password",
	"再输一次": "Re-enter password",
	"暂不加密": "Skip encryption",
	"store 以明文随笔记同步；后续可在设置里开启加密（触发一次重新同步）":
		"The store will sync in plain text; you can enable encryption later in settings (triggers a re-sync)",
	"启用加密": "Enable encryption",
	"两次输入不一致或为空。": "The two entries do not match or are empty.",
	"输入配置库密码": "Enter the store password",
	"这个配置库已加密。输入主配置设备设置的密码以继续，验证通过后本机记住密码。":
		"This store is encrypted. Enter the password set on the master device to continue; it will be remembered on this device after verification.",
	"确认": "OK",
	"修改配置库密码": "Change the store password",
	"池内全部密文会以新密码重新加密并重写，其他设备下次应用时输入新密码即可。":
		"Every encrypted entry will be re-encrypted with the new password; other devices just enter the new password on their next apply.",
	"当前密码": "Current password",
	"新密码": "New password",
	"再输一次新密码": "Re-enter new password",
	"确认修改": "Apply change",
	// ── profile 编辑 ──
	"编辑 profile：{name}": "Edit profile: {name}",
	"编辑 profile：{name}（手机）": "Edit profile: {name} (mobile)",
	"勾选改动即时保存，无需手动确认。": "Toggles save immediately — no confirmation needed.",
	"App 设置": "App settings",
	"社区插件": "Community plugins",
	"CSS 片段": "CSS snippets",
	"主题": "Themes",
	"桌面专属，不进移动 profile": "Desktop-only; excluded from mobile profiles",
	"移动 profile 仅包含核心插件开关与插件配置；外观、主题、快捷键等 app 设置不会应用到手机。":
		"Mobile profiles only contain core-plugin switches and plugin settings; appearance, themes, hotkeys and other app settings are not applied on mobile.",
	// ── app 文件显示名（items.ts） ──
	"编辑器与文件设置": "Editor & files",
	"外观": "Appearance",
	"快捷键": "Hotkeys",
	"核心插件开关": "Core plugin switches",
	"社区插件启用列表": "Community plugin enable list",
	"关系图设置": "Graph settings",
	"书签": "Bookmarks",
	// ── 设置页：加密区 ──
	"加密": "Encryption",
	"配置库加密": "Store encryption",
	"store 整库加密；密码只存各设备本地，不进 vault。": "The whole store is encrypted; the password stays on each device, never in the vault.",
	"修改密码": "Change password",
	"池内全部密文会以新密码重新加密重写。": "Every encrypted entry will be re-encrypted and rewritten with the new password.",
	"尚未加密。下次同步时可设置密码，store 将整库加密。": "Not encrypted yet. Set a password on the next sync to encrypt the whole store.",
	"尚未加密（主配置设备可在其设置中开启）。": "Not encrypted yet (the master device can enable it in its settings).",
	"设置密码并立即重新同步（整库加密）。": "Set a password and re-sync immediately (whole-store encryption).",
	"密码已修改，池内密文已重写。": "Password changed; encrypted entries rewritten.",
	"修改失败：{message}": "Change failed: {message}",
	// ── 设置页：Profiles 区 ──
	"Profiles": "Profiles",
	"profile 管理请到 PC 端（手机只应用配置）。": "Manage profiles on desktop (mobile only applies them).",
	"新建 profile": "New profile",
	"创建后重载插件，应用命令即可用。": "Reload the plugin after creating to register its apply command.",
	"新建": "Create",
	"还没有 profile。新建一个，或在主配置端执行同步。": "No profiles yet. Create one, or run a sync on the master device.",
	"由同名桌面 profile 适配生成，跟随其更新。": "Generated from the desktop profile of the same name; follows its updates.",
	"已开启手机适配。": "Mobile adaptation enabled.",
	"适配手机": "Adapt for mobile",
	"查看/编辑": "View/edit",
	"重命名": "Rename",
	"删除": "Delete",
	"名称": "Name",
	"为《{name}》同时生成手机适配 profile 吗？": "Also generate a mobile-adapted profile for \"{name}\"?",
	"桌面 + 手机": "Desktop + mobile",
	"仅桌面": "Desktop only",
	"重命名 profile": "Rename profile",
	"删除 profile": "Delete profile",
	"确定删除《{label}》？此操作不可撤销。": "Delete \"{label}\"? This cannot be undone.",
	"操作失败：{message}": "Operation failed: {message}",
};
