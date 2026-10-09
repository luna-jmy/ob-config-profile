# Config Profile

跨设备、跨仓库同步 / 管理 Obsidian 配置：一台 PC 作为「主配置」把设置快照进 vault 内的
`SettingProfiles/` 文件夹，其他设备（PC / 手机）按 profile 选择性应用。数据搭乘你既有的
笔记同步（Obsidian Sync、remotely-save、iCloud、git 皆可），插件本身零网络。

- **主配置 / 应用配置**：同 store 只有一个主配置；其他设备装上插件后自动识别为应用配置。
- **手机端只应用**：只能应用「移动适配」的 profile（仅核心插件开关与插件配置，
  外观、主题、快捷键不落到手机）。
- **全库加密**：store 默认整库加密（AES-256-GCM），密文随笔记同步、推公开 git 仓也安全；
  也可以显式选择暂不加密。
- **全部手动**：不做任何自动同步——同步与应用都由你显式执行命令。
- **纯本地**：无网络请求、无遥测、不读 vault 之外的文件。

## 安装

见 Releases（`main.js` / `manifest.json` / `styles.css` 三件装进
`.obsidian/plugins/config-profile/`），或社区市场（上架后更新此处）。

## 依赖说明

- **必需依赖：无**。主体功能不依赖任何其他插件。
- 可选集成：无。缺失任何其他插件都不影响本插件功能。
- 需要一条你自己的 vault 同步通道（Obsidian Sync / remotely-save / iCloud / git 等）
  来把 `SettingProfiles/` 送到其他设备——这是你既有的笔记同步，本插件不做传输。

## 已知限制

- 应用配置后需重载 Obsidian 才生效（应用完成会弹一键重载）。
- 不会自动安装缺失插件：应用时目标设备缺的插件会列清单提示你自行安装。
- 忘记加密密码时 store 内密文作废，需主配置设备重设密码并重新同步。
- 同步粒度是整个文件：无法只同步某个插件的一部分设置。

## 隐私

插件配置可能含 token / 账号信息——因此 store 默认整库加密，密码只存各设备本地
（localStorage），不进 vault；请勿在「暂不加密」模式下把 store 推到公开仓库。

## 致谢

设计参考 [Config Sync](https://github.com/xooooooooox/obsidian-config-sync)（MIT）。

## License

MIT
