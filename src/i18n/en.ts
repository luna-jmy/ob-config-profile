/**
 * 英文字典：键 = 中文原文。check-i18n.mjs 校验 t() 字面量与这里的一致性。
 */

export const EN: Record<string, string> = {
	// ── 角色名 ──
	"同步设备": "Sync device",
	"仅应用": "Apply-only",
	"手机": "Mobile",
	"PC": "PC",
	"尚未设定": "Not set yet",
	// ── 首次运行弹窗 ──
	"选择本机角色": "Choose this device's role",
	"本机是「同步设备」（把本机 Obsidian 配置与配置库双向同步，可多台同时开启），还是「仅应用」（只应用配置库同步来的配置）？":
		"Is this device a sync device (two-way sync between this machine's Obsidian settings and the store; multiple devices can sync at once) or apply-only (only applies settings synced from the store)?",
	"本机为同步设备（与配置库双向同步）": "This device is a sync device (two-way sync with the store)",
	"本机为仅应用": "This device is apply-only",
	"不确定就选仅应用——仅应用不会写入配置库，随时可以在设置里改。":
		"When in doubt choose apply-only — it never writes to the store, and you can change the role anytime in settings.",
	// ── 角色 Notice ──
	"本机已设为同步设备。": "This device is now a sync device.",
	"本机已设为仅应用。": "This device is now apply-only.",
	// ── 设置页 ──
	"Config Profile": "Config Profile",
	"通用": "General",
	"角色": "Role",
	"配置库路径": "Store path",
	"store 在 vault 内的路径（默认 SettingProfiles，vault 根）。修改后重载插件生效。":
		"Path of the store inside the vault (default: SettingProfiles at the vault root). Reload the plugin after changing.",
	"设备名": "Device name",
	"仅作来源标注：显示在同步记录与冲突提示里，说明配置来自哪台设备；不参与同步匹配。":
		"Provenance label only: shown in sync records and conflict prompts to tell which device a change came from; not used for matching.",
	"同步插件主体": "Sync plugin artifacts",
	"把插件的 main.js / styles.css / manifest.json 一并明文同步（不加密）。开启后应用端可直接装齐缺失插件；下次同步生效。":
		"Also sync plugins' main.js / styles.css / manifest.json in plain text (unencrypted). Apply-side devices can then install missing plugins directly; takes effect on the next sync.",
	"开启后应用时把池里的插件主体（main.js / styles.css / manifest.json）连同配置一起写入，未安装的插件直接装齐，重载后生效；关闭则只应用配置，未安装的插件跳过。":
		"When on, applying also writes plugin bodies (main.js / styles.css / manifest.json) from the store, installing missing plugins directly (effective after reload); when off, only settings are applied and uninstalled plugins are skipped.",
	"以下插件已从配置库装齐主体，重载后生效：": "These plugins were installed from the store; reload to take effect:",
	"语言": "Language",
	"跟随 Obsidian": "Follow Obsidian",
	"中文": "Chinese",
	"English": "English",
	"当前角色": "Current role",
	"同步设备可与配置库双向同步（多台可同时开启）；仅应用只覆盖本机，不写配置库。":
		"A sync device syncs both ways with the store (several can be enabled at once); apply-only only overwrites this machine and never writes to the store.",
	"切换角色": "Switch role",
	"切换后立即生效，无需重载。": "Takes effect immediately — no reload needed.",
	"开 = 同步设备，关 = 仅应用": "On = sync device, off = apply-only",
	"取消": "Cancel",
	// ── 设置页：加密区 ──
	"加密": "Encryption",
	"配置库加密": "Store encryption",
	"store 整库加密；密码只存各设备本地，不进 vault。": "The whole store is encrypted; the password stays on each device, never in the vault.",
	"修改密码": "Change password",
	"池内全部密文会以新密码重新加密重写。": "Every encrypted entry will be re-encrypted and rewritten with the new password.",
	"尚未加密。下次同步时可设置密码，store 将整库加密。": "Not encrypted yet. Set a password on the next sync to encrypt the whole store.",
	"设置密码并立即重新同步（整库加密）。": "Set a password and re-sync immediately (whole-store encryption).",
	"密码已修改，池内密文已重写。": "Password changed; encrypted entries rewritten.",
	"录入同步密码": "Enter sync password",
	"输入同步设备设置的密码以解密配置库；验证通过后本机记住（只存本机，不进 vault）。":
		"Enter the password set on a sync device to decrypt the store; once verified it is remembered on this device only (never in the vault).",
	"配置库未加密，无需密码。": "The store is not encrypted; no password is needed.",
	"未找到配置库（{path}）。请确认配置库已随笔记同步到本机，且路径与同步设备一致。":
		"Store not found ({path}). Make sure the store has reached this device with your notes and the path matches the sync device.",
	"密码已验证并记住（只存本机）。": "Password verified and saved (stored on this device only).",
	"修改失败：{message}": "Change failed: {message}",
	// ── 设置页：Profiles 区 ──
	"Profiles": "Profiles",
	"profile 管理请到 PC 端（手机只应用配置）。": "Manage profiles on desktop (mobile only applies them).",
	"新建 profile": "New profile",
	"创建后重载插件，应用命令即可用。": "Reload the plugin after creating to register its apply command.",
	"新建": "Create",
	"还没有 profile。新建一个，或在一台同步设备上执行同步。": "No profiles yet. Create one, or run a sync on a sync device.",
	"已开启手机适配：手机端应用《{name}（手机）》。": "Mobile adaptation on: phones apply \"{name} (mobile)\".",
	"未开启手机适配。": "Mobile adaptation off.",
	"桌面 profile 已不存在的派生残留，可删除。": "Leftover mobile twin whose desktop profile is gone; safe to delete.",
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
	"《{name}》有手机适配派生，一并删除？": "\"{name}\" has a mobile twin. Delete it as well?",
	"一并删除": "Delete both",
	"删除手机适配 profile": "Delete mobile twin",
	"仅删桌面版": "Desktop only",
	"打开编辑器失败：{message}": "Failed to open the editor: {message}",
	"操作失败：{message}": "Operation failed: {message}",
	// ── 命令 ──
	"同步本地配置": "Sync local settings",
	"应用配置：{name}": "Apply profile: {name}",
	"查看/编辑配置：{name}": "View/edit profile: {name}",
	"{name}（手机）": "{name} (mobile)",
	// ── 同步 Notice / 弹窗 ──
	"密码不正确。": "Wrong password.",
	"手机端只能应用配置，不能同步。": "Mobile devices can only apply profiles, not sync.",
	"本机是仅应用设备，不能同步。可在设置中切换为同步设备。":
		"This device is apply-only and cannot sync. Switch it to a sync device in settings.",
	"同步完成：推送 {pushed} 项，拉取 {pulled} 项，删除 {deleted} 项。":
		"Sync finished: {pushed} pushed, {pulled} pulled, {deleted} deleted.",
	"冲突已按本机解决。": " Conflicts resolved with local versions.",
	"冲突已按池解决。": " Conflicts resolved with store versions.",
	"已更新移动投影。": " Mobile projection updated.",
	"同步失败：{message}": "Sync failed: {message}",
	"配置库的时间戳来自未来，本机或对端时钟可能不准。请校准系统时间后重试。":
		"The store's timestamps are in the future; this device or a peer may have a wrong clock. Calibrate the system time and retry.",
	"首次在此设备同步": "First sync on this device",
	"配置库已有内容，但本机还没有同步记录。以哪边为准？本机多出的文件会保留，下次同步再上传。":
		"The store already has content, but this device has no sync record yet. Which side wins? Files that exist only locally are kept and uploaded on the next sync.",
	"直接关闭弹窗即取消本次同步。": "Closing this dialog cancels the sync.",
	"用本机覆盖池": "Overwrite store with local",
	"先把池应用回本机": "Apply the store to this device first",
	"同步冲突": "Sync conflicts",
	"以下文件在本机和配置库都改过，需要你决定保留哪边（对所有列出的文件生效）：":
		"These files changed both locally and in the store; choose which side to keep (applies to all listed files):",
	"直接关闭弹窗即取消本次同步，两边改动都保持原样。": "Closing this dialog cancels the sync; both sides stay as they are.",
	"保留本机版本": "Keep local versions",
	"保留配置库版本": "Keep store versions",
	// ── 应用 ──
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
		"This store is encrypted. Enter the password set on the sync device to continue; it will be remembered on this device after verification.",
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
	"已选 {selected}/{total}": "Selected {selected}/{total}",
	"全选": "Select all",
	"暂无条目": "Nothing here yet",
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
};
