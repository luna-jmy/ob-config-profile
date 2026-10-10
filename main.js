/* Config Profile — bundled 2026-10-10T01:05:53.295Z */
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/i18n/en.ts
var EN;
var init_en = __esm({
  "src/i18n/en.ts"() {
    "use strict";
    EN = {
      // ── 角色名 ──
      "\u4E3B\u914D\u7F6E": "Master",
      "\u5E94\u7528\u914D\u7F6E": "Apply-only",
      "\u624B\u673A": "Mobile",
      "PC": "PC",
      "\u5C1A\u672A\u8BBE\u5B9A": "Not set yet",
      // ── 首次运行弹窗 ──
      "\u9009\u62E9\u672C\u673A\u89D2\u8272": "Choose this device's role",
      "\u5F53\u524D vault \u5185\u6CA1\u6709\u53D1\u73B0\u914D\u7F6E\u5E93\u3002\u672C\u673A\u662F\u300C\u4E3B\u914D\u7F6E\u300D\uFF08\u628A\u672C\u673A Obsidian \u914D\u7F6E\u540C\u6B65\u5230 store\uFF09\uFF0C\u8FD8\u662F\u300C\u5E94\u7528\u914D\u7F6E\u300D\uFF08\u53EA\u5E94\u7528\u5176\u4ED6\u8BBE\u5907\u540C\u6B65\u6765\u7684\u914D\u7F6E\uFF09\uFF1F": "No config store found in this vault. Is this device the master (captures this machine's Obsidian settings into the store) or apply-only (only applies settings synced from other devices)?",
      "\u672C\u673A\u4E3A\u4E3B\u914D\u7F6E\uFF08\u540C\u6B65\u672C\u673A\u914D\u7F6E\u5230 store\uFF09": "This device is the master (sync local config into the store)",
      "\u672C\u673A\u4E3A\u5E94\u7528\u914D\u7F6E": "This device is apply-only",
      "\u4E0D\u786E\u5B9A\u5C31\u9009\u5E94\u7528\u914D\u7F6E\u2014\u2014\u5E94\u7528\u914D\u7F6E\u4E0D\u4F1A\u5199\u5165 store\uFF0C\u968F\u65F6\u53EF\u4EE5\u5728\u8BBE\u7F6E\u91CC\u6539\u3002": "When in doubt choose apply-only \u2014 it never writes to the store, and you can change the role anytime in settings.",
      // ── 角色判定 Notice ──
      "\u672C\u673A\u5DF2\u8BBE\u4E3A\u4E3B\u914D\u7F6E\u3002": "This device is now the master.",
      "\u672C\u673A\u5DF2\u8BBE\u4E3A\u5E94\u7528\u914D\u7F6E\u3002": "This device is now apply-only.",
      "\u68C0\u6D4B\u5230\u4E3B\u914D\u7F6E\u6765\u81EA\u8BBE\u5907\u300A{name}\u300B\uFF0C\u672C\u673A\u5DF2\u8BBE\u4E3A\u5E94\u7528\u914D\u7F6E\u3002\u82E5\u4E3B\u914D\u7F6E\u5176\u5B9E\u5C5E\u4E8E\u672C\u673A\uFF08\u91CD\u88C5\u6216\u6E05\u9664\u6570\u636E\u540E\u8EAB\u4EFD\u4E22\u5931\uFF09\uFF0C\u8BF7\u5728\u8BBE\u7F6E\u4E2D\u91CD\u65B0\u593A\u53D6\u3002": 'The master role belongs to "{name}"; this device is set to apply-only. If that is actually this machine (identity lost after reinstall or data wipe), re-claim the master role in settings.',
      "\u65E0\u6CD5\u786E\u8BA4\u4E3B\u914D\u7F6E\u5F52\u5C5E\uFF08lock \u6587\u4EF6\u635F\u574F\uFF09\uFF0C\u672C\u673A\u6682\u6309\u5E94\u7528\u914D\u7F6E\u5904\u7406\u3002": "Cannot confirm master ownership (lock file is corrupted); this device stays apply-only for now.",
      "store \u7531\u66F4\u65B0\u7248\u672C\u7684 Config Profile \u5199\u5165\uFF0C\u672C\u673A\u6682\u6309\u5E94\u7528\u914D\u7F6E\u5904\u7406\u3002\u8BF7\u66F4\u65B0\u63D2\u4EF6\u3002": "The store was written by a newer version of Config Profile; this device stays apply-only for now. Please update the plugin.",
      "\u65E0\u6CD5\u786E\u8BA4\u4E3B\u914D\u7F6E\u5F52\u5C5E\uFF08\u914D\u7F6E\u6C60\u5B58\u5728\u4F46\u6CA1\u6709 lock\uFF0C\u53EF\u80FD\u540C\u6B65\u672A\u5B8C\u6210\uFF09\uFF0C\u672C\u673A\u6682\u6309\u5E94\u7528\u914D\u7F6E\u5904\u7406\u3002": "Cannot confirm master ownership (pool exists but no lock \u2014 sync may be incomplete); this device stays apply-only for now.",
      // ── 设置页 ──
      "Config Profile": "Config Profile",
      "\u901A\u7528": "General",
      "\u89D2\u8272": "Role",
      "\u914D\u7F6E\u5E93\u8DEF\u5F84": "Store path",
      "store \u5728 vault \u5185\u7684\u8DEF\u5F84\uFF08\u9ED8\u8BA4 SettingProfiles\uFF0Cvault \u6839\uFF09\u3002\u4FEE\u6539\u540E\u91CD\u8F7D\u63D2\u4EF6\u751F\u6548\u3002": "Path of the store inside the vault (default: SettingProfiles at the vault root). Reload the plugin after changing.",
      "\u8BBE\u5907\u540D": "Device name",
      "\u663E\u793A\u5728\u4E3B\u914D\u7F6E\u5F52\u5C5E\u63D0\u793A\u91CC\uFF0C\u5E2E\u52A9\u8BC6\u522B\u54EA\u53F0\u8BBE\u5907\u6301\u6709\u4E3B\u914D\u7F6E\u3002": "Shown in master-ownership notices so you can tell which device holds the role.",
      "\u8BED\u8A00": "Language",
      "\u8DDF\u968F Obsidian": "Follow Obsidian",
      "\u4E2D\u6587": "Chinese",
      "English": "English",
      "\u5F53\u524D\u89D2\u8272": "Current role",
      "\u4E3B\u914D\u7F6E\u6301\u6709\u8005\uFF1A{name}": "Master held by: {name}",
      "\u593A\u53D6\u4E3B\u914D\u7F6E": "Claim master role",
      "\u8BA9\u51FA\u4E3B\u914D\u7F6E": "Release master role",
      "\u5C06\u4EE5\u672C\u673A\u8EAB\u4EFD\u63A5\u7BA1 store \u7684\u4E3B\u914D\u7F6E\u3002\u539F\u4E3B\u914D\u7F6E\u8BBE\u5907\u4F1A\u5728\u4E0B\u6B21\u64CD\u4F5C\u524D\u81EA\u52A8\u964D\u7EA7\u4E3A\u5E94\u7528\u914D\u7F6E\u3002\u7EE7\u7EED\uFF1F": "This device will take over the master role of the store. The previous master automatically drops to apply-only before its next write. Continue?",
      "\u8BA9\u51FA\u540E store \u6682\u65E0\u4E3B\u914D\u7F6E\uFF0C\u6240\u6709\u8BBE\u5907\u90FD\u53EA\u80FD\u5E94\u7528\uFF0C\u76F4\u5230\u6709\u4EBA\u91CD\u65B0\u593A\u53D6\u3002\u7EE7\u7EED\uFF1F": "After releasing, the store has no master and every device can only apply, until someone claims it again. Continue?",
      "\u5DF2\u63A5\u7BA1\u4E3B\u914D\u7F6E\u3002": "Master role claimed.",
      "\u5DF2\u8BA9\u51FA\u4E3B\u914D\u7F6E\u3002": "Master role released.",
      "\u593A\u53D6\u6216\u8BA9\u51FA\u5931\u8D25\uFF1A{message}": "Claim or release failed: {message}",
      "\u53D6\u6D88": "Cancel",
      // ── 命令 ──
      "\u540C\u6B65\u672C\u5730\u914D\u7F6E": "Sync local settings",
      "\u5E94\u7528\u914D\u7F6E\uFF1A{name}": "Apply profile: {name}",
      "\u67E5\u770B/\u7F16\u8F91\u914D\u7F6E\uFF1A{name}": "View/edit profile: {name}",
      "{name}\uFF08\u624B\u673A\uFF09": "{name} (mobile)",
      // ── 同步 / 应用 Notice ──
      "\u5BC6\u7801\u4E0D\u6B63\u786E\u3002": "Wrong password.",
      "\u624B\u673A\u7AEF\u53EA\u80FD\u5E94\u7528\u914D\u7F6E\uFF0C\u4E0D\u80FD\u540C\u6B65\u3002": "Mobile devices can only apply profiles, not sync.",
      "\u672C\u673A\u4E0D\u662F\u4E3B\u914D\u7F6E\u8BBE\u5907\uFF0C\u4E0D\u80FD\u540C\u6B65\u3002\u53EF\u5728\u8BBE\u7F6E\u4E2D\u593A\u53D6\u4E3B\u914D\u7F6E\u3002": "This device is not the master, so it cannot sync. Claim the master role in settings.",
      "\u540C\u6B65\u5B8C\u6210\uFF1A\u66F4\u65B0 {updated} \u9879\uFF0C\u8DF3\u8FC7 {skipped} \u9879\uFF0C\u6E05\u7406 {pruned} \u9879\u3002": "Sync finished: {updated} updated, {skipped} skipped, {pruned} pruned.",
      "\u5DF2\u66F4\u65B0\u79FB\u52A8\u6295\u5F71\u3002": " Mobile projection updated.",
      "\u540C\u6B65\u5931\u8D25\uFF1A{message}": "Sync failed: {message}",
      "\u627E\u4E0D\u5230 profile\uFF1A{name}": "Profile not found: {name}",
      "profile \u6587\u4EF6\u635F\u574F\uFF1A{name}": "Profile file is corrupted: {name}",
      "profile \u91CC\u6CA1\u6709\u52FE\u9009\u4EFB\u4F55\u5185\u5BB9\uFF1A{name}": "Nothing is checked in this profile: {name}",
      "\u5E94\u7528\u5931\u8D25\uFF1A{message}": "Apply failed: {message}",
      "\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A\uFF0C\u4E14\u4E0D\u80FD\u5305\u542B / \u6216 \\\u3002": "Name cannot be empty and must not contain / or \\.",
      "\u540C\u540D profile \u5DF2\u5B58\u5728\uFF1A{name}": "A profile with this name already exists: {name}",
      "\u5DF2\u521B\u5EFA profile\u3002\u91CD\u8F7D\u63D2\u4EF6\u540E\u65B0\u547D\u4EE4\u751F\u6548\u3002": "Profile created. Reload the plugin to register its commands.",
      // ── 应用结果弹窗 ──
      "\u5DF2\u5E94\u7528 profile\uFF1A{name}": "Applied profile: {name}",
      "\u5DF2\u5E94\u7528 {count} \u9879\u3002\u91CD\u8F7D Obsidian \u4F7F\u914D\u7F6E\u751F\u6548\uFF1F": "Applied {count} items. Reload Obsidian to take effect?",
      "\u6CA1\u6709\u53EF\u5E94\u7528\u7684\u6761\u76EE\u3002": "Nothing to apply.",
      "\u5FC5\u987B\u91CD\u8F7D\uFF1A\u8FD0\u884C\u4E2D\u7684\u63D2\u4EF6\u9000\u51FA\u65F6\u4F1A\u628A\u5185\u5B58\u91CC\u7684\u65E7\u914D\u7F6E\u5199\u56DE\uFF0C\u4E0D\u91CD\u8F7D\u4F1A\u8986\u76D6\u521A\u5E94\u7528\u7684\u6587\u4EF6\u3002": "Reload is required: running plugins write their in-memory settings back on exit, which would overwrite the files just applied.",
      "\u4EE5\u4E0B\u63D2\u4EF6\u672C\u673A\u672A\u5B89\u88C5\uFF0C\u5DF2\u8DF3\u8FC7\uFF08\u5B89\u88C5\u540E\u91CD\u65B0\u5E94\u7528\u5373\u53EF\uFF09\uFF1A": "These plugins are not installed here and were skipped (install them, then apply again):",
      "\u4EE5\u4E0B\u63D2\u4EF6\u4E3A\u684C\u9762\u4E13\u5C5E\uFF0C\u5DF2\u4ECE\u624B\u673A\u7AEF\u5254\u9664\uFF1A": "These desktop-only plugins were excluded on mobile:",
      "\u5173\u95ED": "Close",
      "\u7A0D\u540E\u624B\u52A8\u91CD\u8F7D": "Reload later manually",
      "\u7ACB\u5373\u91CD\u8F7D": "Reload now",
      "\u65E0\u6CD5\u81EA\u52A8\u91CD\u8F7D\uFF0C\u8BF7\u624B\u52A8\u91CD\u542F Obsidian\uFF08Ctrl/Cmd+R \u6216\u91CD\u542F\u5E94\u7528\uFF09\u3002": "Cannot reload automatically; please restart Obsidian manually (Ctrl/Cmd+R or restart the app).",
      // ── 密码弹窗 ──
      "\u4E3A\u914D\u7F6E\u5E93\u8BBE\u7F6E\u5BC6\u7801": "Set a store password",
      "store \u5C06\u968F\u4F60\u7684\u7B14\u8BB0\u540C\u6B65\uFF0C\u63D2\u4EF6\u914D\u7F6E\u91CC\u53EF\u80FD\u542B token \u7B49\u654F\u611F\u4FE1\u606F\u2014\u2014\u9ED8\u8BA4\u6574\u5E93\u52A0\u5BC6\uFF0C\u5BC6\u7801\u53EA\u5B58\u5404\u8BBE\u5907\u672C\u5730\uFF0C\u4E0D\u8FDB vault\u3002": "The store syncs with your notes and plugin settings may contain tokens and other secrets \u2014 it is encrypted as a whole by default. The password is stored per device, never in the vault.",
      "\u5BC6\u7801": "Password",
      "\u518D\u8F93\u4E00\u6B21": "Re-enter password",
      "\u6682\u4E0D\u52A0\u5BC6": "Skip encryption",
      "store \u4EE5\u660E\u6587\u968F\u7B14\u8BB0\u540C\u6B65\uFF1B\u540E\u7EED\u53EF\u5728\u8BBE\u7F6E\u91CC\u5F00\u542F\u52A0\u5BC6\uFF08\u89E6\u53D1\u4E00\u6B21\u91CD\u65B0\u540C\u6B65\uFF09": "The store will sync in plain text; you can enable encryption later in settings (triggers a re-sync)",
      "\u542F\u7528\u52A0\u5BC6": "Enable encryption",
      "\u4E24\u6B21\u8F93\u5165\u4E0D\u4E00\u81F4\u6216\u4E3A\u7A7A\u3002": "The two entries do not match or are empty.",
      "\u8F93\u5165\u914D\u7F6E\u5E93\u5BC6\u7801": "Enter the store password",
      "\u8FD9\u4E2A\u914D\u7F6E\u5E93\u5DF2\u52A0\u5BC6\u3002\u8F93\u5165\u4E3B\u914D\u7F6E\u8BBE\u5907\u8BBE\u7F6E\u7684\u5BC6\u7801\u4EE5\u7EE7\u7EED\uFF0C\u9A8C\u8BC1\u901A\u8FC7\u540E\u672C\u673A\u8BB0\u4F4F\u5BC6\u7801\u3002": "This store is encrypted. Enter the password set on the master device to continue; it will be remembered on this device after verification.",
      "\u786E\u8BA4": "OK",
      "\u4FEE\u6539\u914D\u7F6E\u5E93\u5BC6\u7801": "Change the store password",
      "\u6C60\u5185\u5168\u90E8\u5BC6\u6587\u4F1A\u4EE5\u65B0\u5BC6\u7801\u91CD\u65B0\u52A0\u5BC6\u5E76\u91CD\u5199\uFF0C\u5176\u4ED6\u8BBE\u5907\u4E0B\u6B21\u5E94\u7528\u65F6\u8F93\u5165\u65B0\u5BC6\u7801\u5373\u53EF\u3002": "Every encrypted entry will be re-encrypted with the new password; other devices just enter the new password on their next apply.",
      "\u5F53\u524D\u5BC6\u7801": "Current password",
      "\u65B0\u5BC6\u7801": "New password",
      "\u518D\u8F93\u4E00\u6B21\u65B0\u5BC6\u7801": "Re-enter new password",
      "\u786E\u8BA4\u4FEE\u6539": "Apply change",
      // ── profile 编辑 ──
      "\u7F16\u8F91 profile\uFF1A{name}": "Edit profile: {name}",
      "\u7F16\u8F91 profile\uFF1A{name}\uFF08\u624B\u673A\uFF09": "Edit profile: {name} (mobile)",
      "\u52FE\u9009\u6539\u52A8\u5373\u65F6\u4FDD\u5B58\uFF0C\u65E0\u9700\u624B\u52A8\u786E\u8BA4\u3002": "Toggles save immediately \u2014 no confirmation needed.",
      "App \u8BBE\u7F6E": "App settings",
      "\u793E\u533A\u63D2\u4EF6": "Community plugins",
      "CSS \u7247\u6BB5": "CSS snippets",
      "\u4E3B\u9898": "Themes",
      "\u684C\u9762\u4E13\u5C5E\uFF0C\u4E0D\u8FDB\u79FB\u52A8 profile": "Desktop-only; excluded from mobile profiles",
      "\u79FB\u52A8 profile \u4EC5\u5305\u542B\u6838\u5FC3\u63D2\u4EF6\u5F00\u5173\u4E0E\u63D2\u4EF6\u914D\u7F6E\uFF1B\u5916\u89C2\u3001\u4E3B\u9898\u3001\u5FEB\u6377\u952E\u7B49 app \u8BBE\u7F6E\u4E0D\u4F1A\u5E94\u7528\u5230\u624B\u673A\u3002": "Mobile profiles only contain core-plugin switches and plugin settings; appearance, themes, hotkeys and other app settings are not applied on mobile.",
      // ── app 文件显示名（items.ts） ──
      "\u7F16\u8F91\u5668\u4E0E\u6587\u4EF6\u8BBE\u7F6E": "Editor & files",
      "\u5916\u89C2": "Appearance",
      "\u5FEB\u6377\u952E": "Hotkeys",
      "\u6838\u5FC3\u63D2\u4EF6\u5F00\u5173": "Core plugin switches",
      "\u793E\u533A\u63D2\u4EF6\u542F\u7528\u5217\u8868": "Community plugin enable list",
      "\u5173\u7CFB\u56FE\u8BBE\u7F6E": "Graph settings",
      "\u4E66\u7B7E": "Bookmarks",
      // ── 设置页：加密区 ──
      "\u52A0\u5BC6": "Encryption",
      "\u914D\u7F6E\u5E93\u52A0\u5BC6": "Store encryption",
      "store \u6574\u5E93\u52A0\u5BC6\uFF1B\u5BC6\u7801\u53EA\u5B58\u5404\u8BBE\u5907\u672C\u5730\uFF0C\u4E0D\u8FDB vault\u3002": "The whole store is encrypted; the password stays on each device, never in the vault.",
      "\u4FEE\u6539\u5BC6\u7801": "Change password",
      "\u6C60\u5185\u5168\u90E8\u5BC6\u6587\u4F1A\u4EE5\u65B0\u5BC6\u7801\u91CD\u65B0\u52A0\u5BC6\u91CD\u5199\u3002": "Every encrypted entry will be re-encrypted and rewritten with the new password.",
      "\u5C1A\u672A\u52A0\u5BC6\u3002\u4E0B\u6B21\u540C\u6B65\u65F6\u53EF\u8BBE\u7F6E\u5BC6\u7801\uFF0Cstore \u5C06\u6574\u5E93\u52A0\u5BC6\u3002": "Not encrypted yet. Set a password on the next sync to encrypt the whole store.",
      "\u5C1A\u672A\u52A0\u5BC6\uFF08\u4E3B\u914D\u7F6E\u8BBE\u5907\u53EF\u5728\u5176\u8BBE\u7F6E\u4E2D\u5F00\u542F\uFF09\u3002": "Not encrypted yet (the master device can enable it in its settings).",
      "\u8BBE\u7F6E\u5BC6\u7801\u5E76\u7ACB\u5373\u91CD\u65B0\u540C\u6B65\uFF08\u6574\u5E93\u52A0\u5BC6\uFF09\u3002": "Set a password and re-sync immediately (whole-store encryption).",
      "\u5BC6\u7801\u5DF2\u4FEE\u6539\uFF0C\u6C60\u5185\u5BC6\u6587\u5DF2\u91CD\u5199\u3002": "Password changed; encrypted entries rewritten.",
      "\u4FEE\u6539\u5931\u8D25\uFF1A{message}": "Change failed: {message}",
      // ── 设置页：Profiles 区 ──
      "Profiles": "Profiles",
      "profile \u7BA1\u7406\u8BF7\u5230 PC \u7AEF\uFF08\u624B\u673A\u53EA\u5E94\u7528\u914D\u7F6E\uFF09\u3002": "Manage profiles on desktop (mobile only applies them).",
      "\u65B0\u5EFA profile": "New profile",
      "\u521B\u5EFA\u540E\u91CD\u8F7D\u63D2\u4EF6\uFF0C\u5E94\u7528\u547D\u4EE4\u5373\u53EF\u7528\u3002": "Reload the plugin after creating to register its apply command.",
      "\u65B0\u5EFA": "Create",
      "\u8FD8\u6CA1\u6709 profile\u3002\u65B0\u5EFA\u4E00\u4E2A\uFF0C\u6216\u5728\u4E3B\u914D\u7F6E\u7AEF\u6267\u884C\u540C\u6B65\u3002": "No profiles yet. Create one, or run a sync on the master device.",
      "\u7531\u540C\u540D\u684C\u9762 profile \u9002\u914D\u751F\u6210\uFF0C\u8DDF\u968F\u5176\u66F4\u65B0\u3002": "Generated from the desktop profile of the same name; follows its updates.",
      "\u5DF2\u5F00\u542F\u624B\u673A\u9002\u914D\u3002": "Mobile adaptation enabled.",
      "\u9002\u914D\u624B\u673A": "Adapt for mobile",
      "\u67E5\u770B/\u7F16\u8F91": "View/edit",
      "\u91CD\u547D\u540D": "Rename",
      "\u5220\u9664": "Delete",
      "\u540D\u79F0": "Name",
      "\u4E3A\u300A{name}\u300B\u540C\u65F6\u751F\u6210\u624B\u673A\u9002\u914D profile \u5417\uFF1F": 'Also generate a mobile-adapted profile for "{name}"?',
      "\u684C\u9762 + \u624B\u673A": "Desktop + mobile",
      "\u4EC5\u684C\u9762": "Desktop only",
      "\u91CD\u547D\u540D profile": "Rename profile",
      "\u5220\u9664 profile": "Delete profile",
      "\u786E\u5B9A\u5220\u9664\u300A{label}\u300B\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002": 'Delete "{label}"? This cannot be undone.',
      "\u64CD\u4F5C\u5931\u8D25\uFF1A{message}": "Operation failed: {message}"
    };
  }
});

// src/i18n/translate.ts
function translate(table, key, params) {
  var _a;
  let text = (_a = table[key]) != null ? _a : key;
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}
function setLanguage(setting, provider) {
  currentSetting = setting;
  if (provider) localeProvider = provider;
}
function effectiveLanguage() {
  if (currentSetting === "zh" || currentSetting === "en") return currentSetting;
  const locale = localeProvider();
  if (locale && locale.toLowerCase().startsWith("zh")) return "zh";
  return locale ? "en" : "zh";
}
function t(key, params) {
  const table = effectiveLanguage() === "en" ? EN : {};
  return translate(table, key, params);
}
var currentSetting, localeProvider;
var init_translate = __esm({
  "src/i18n/translate.ts"() {
    "use strict";
    init_en();
    currentSetting = "auto";
    localeProvider = () => void 0;
  }
});

// src/i18n/index.ts
var init_i18n = __esm({
  "src/i18n/index.ts"() {
    "use strict";
    init_translate();
  }
});

// src/store/items.ts
function isMobileAllowedAppFile(file) {
  return MOBILE_ALLOWED_APP_FILES.includes(file);
}
function isCarryablePluginFile(fileName) {
  return !INSTALL_ARTIFACTS.has(fileName);
}
var SELF_PLUGIN_ID, INSTALL_ARTIFACTS, APP_FILES, MOBILE_ALLOWED_APP_FILES;
var init_items = __esm({
  "src/store/items.ts"() {
    "use strict";
    SELF_PLUGIN_ID = "config-profile";
    INSTALL_ARTIFACTS = /* @__PURE__ */ new Set(["main.js", "styles.css", "manifest.json"]);
    APP_FILES = [
      { file: "app.json", label: "\u7F16\u8F91\u5668\u4E0E\u6587\u4EF6\u8BBE\u7F6E" },
      { file: "appearance.json", label: "\u5916\u89C2" },
      { file: "hotkeys.json", label: "\u5FEB\u6377\u952E" },
      { file: "core-plugins.json", label: "\u6838\u5FC3\u63D2\u4EF6\u5F00\u5173" },
      { file: "community-plugins.json", label: "\u793E\u533A\u63D2\u4EF6\u542F\u7528\u5217\u8868" },
      { file: "graph.json", label: "\u5173\u7CFB\u56FE\u8BBE\u7F6E" },
      { file: "bookmarks.json", label: "\u4E66\u7B7E" }
    ];
    MOBILE_ALLOWED_APP_FILES = ["core-plugins.json", "community-plugins.json"];
  }
});

// src/ui/profile-editor.ts
function toggleRow(container, label, checked, onChange, extra) {
  const setting = new import_obsidian8.Setting(container).setName(label);
  if (extra) setting.setDesc(extra);
  setting.addToggle((toggle) => toggle.setValue(checked).onChange(onChange));
}
function groupHeading(container, name) {
  new import_obsidian8.Setting(container).setName(name).setHeading();
}
function renderProfileEditor(container, doc, data, host) {
  container.empty();
  const isMobileDoc = doc.platform === "mobile";
  if (isMobileDoc) {
    container.createEl("p", {
      cls: "cp-modal__hint",
      text: t("\u79FB\u52A8 profile \u4EC5\u5305\u542B\u6838\u5FC3\u63D2\u4EF6\u5F00\u5173\u4E0E\u63D2\u4EF6\u914D\u7F6E\uFF1B\u5916\u89C2\u3001\u4E3B\u9898\u3001\u5FEB\u6377\u952E\u7B49 app \u8BBE\u7F6E\u4E0D\u4F1A\u5E94\u7528\u5230\u624B\u673A\u3002")
    });
  }
  groupHeading(container, t("App \u8BBE\u7F6E"));
  for (const spec of APP_FILES) {
    if (isMobileDoc && !isMobileAllowedAppFile(spec.file)) continue;
    toggleRow(
      container,
      t(spec.label),
      doc.app.includes(spec.file),
      (value) => {
        doc.app = value ? [...doc.app, spec.file] : doc.app.filter((file) => file !== spec.file);
        void host.onChanged(globalThis.structuredClone(doc));
      }
    );
  }
  groupHeading(container, t("\u793E\u533A\u63D2\u4EF6"));
  for (const plugin of data.plugins) {
    const label = plugin.name === plugin.id ? plugin.id : `${plugin.name}\uFF08${plugin.id}\uFF09`;
    const extra = plugin.isDesktopOnly ? t("\u684C\u9762\u4E13\u5C5E\uFF0C\u4E0D\u8FDB\u79FB\u52A8 profile") : void 0;
    toggleRow(container, label, doc.plugins.includes(plugin.id), (value) => {
      doc.plugins = value ? [...doc.plugins, plugin.id] : doc.plugins.filter((id) => id !== plugin.id);
      void host.onChanged(globalThis.structuredClone(doc));
    }, extra);
  }
  if (!isMobileDoc) {
    groupHeading(container, t("CSS \u7247\u6BB5"));
    for (const name of data.snippets) {
      toggleRow(container, name, doc.snippets.includes(name), (value) => {
        doc.snippets = value ? [...doc.snippets, name] : doc.snippets.filter((item) => item !== name);
        void host.onChanged(globalThis.structuredClone(doc));
      });
    }
    groupHeading(container, t("\u4E3B\u9898"));
    for (const name of data.themes) {
      toggleRow(container, name, doc.themes.includes(name), (value) => {
        doc.themes = value ? [...doc.themes, name] : doc.themes.filter((item) => item !== name);
        void host.onChanged(globalThis.structuredClone(doc));
      });
    }
  }
}
var import_obsidian8;
var init_profile_editor = __esm({
  "src/ui/profile-editor.ts"() {
    "use strict";
    import_obsidian8 = require("obsidian");
    init_i18n();
    init_items();
  }
});

// src/modals/profile-edit.ts
var profile_edit_exports = {};
__export(profile_edit_exports, {
  ProfileEditModal: () => ProfileEditModal
});
var import_obsidian9, ProfileEditModal;
var init_profile_edit = __esm({
  "src/modals/profile-edit.ts"() {
    "use strict";
    import_obsidian9 = require("obsidian");
    init_i18n();
    init_profile_editor();
    ProfileEditModal = class extends import_obsidian9.Modal {
      constructor(plugin, doc, data) {
        super(plugin.app);
        this.plugin = plugin;
        this.doc = doc;
        this.data = data;
      }
      onOpen() {
        this.contentEl.addClass("cp-modal");
        const title = this.doc.platform === "mobile" ? t("\u7F16\u8F91 profile\uFF1A{name}\uFF08\u624B\u673A\uFF09", { name: this.doc.name }) : t("\u7F16\u8F91 profile\uFF1A{name}", { name: this.doc.name });
        this.titleEl.setText(title);
        this.contentEl.createEl("p", {
          cls: "cp-modal__hint",
          text: t("\u52FE\u9009\u6539\u52A8\u5373\u65F6\u4FDD\u5B58\uFF0C\u65E0\u9700\u624B\u52A8\u786E\u8BA4\u3002")
        });
        const body = this.contentEl.createDiv();
        renderProfileEditor(body, this.doc, this.data, {
          onChanged: async (changed) => {
            await this.plugin.onProfileEdited(changed);
          }
        });
      }
      onClose() {
        this.contentEl.empty();
      }
    };
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ConfigProfilePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian10 = require("obsidian");

// src/crypto/envelope.ts
var CRYPTO_SCHEMA = "aes-256-gcm";
var PBKDF2_ITERATIONS = 6e5;
var VERIFICATION_PLAINTEXT = "config-profile:verification:1";
var PasswordError = class extends Error {
  constructor(message = "wrong password or corrupted data") {
    super(message);
    this.name = "PasswordError";
  }
};
function subtle() {
  const c = globalThis.crypto;
  if (!(c == null ? void 0 : c.subtle)) {
    throw new Error("WebCrypto unavailable on this platform");
  }
  return c.subtle;
}
function toB64(bytes) {
  let binary = "";
  const chunk = 32768;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return globalThis.btoa(binary);
}
function fromB64(b64) {
  const binary = globalThis.atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
function randomBytes(length) {
  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);
  return bytes;
}
async function deriveKey(password, salt) {
  const material = await subtle().importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
    "deriveKey"
  ]);
  return subtle().deriveKey(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}
function isEnvelope(value) {
  if (typeof value !== "object" || value === null) return false;
  const env = value;
  return env.scheme === CRYPTO_SCHEMA && typeof env.salt === "string" && typeof env.iv === "string" && typeof env.data === "string";
}
function parseEnvelopeText(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    return null;
  }
  return isEnvelope(parsed) ? parsed : null;
}
async function encryptText(password, plaintext) {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = await deriveKey(password, salt);
  const cipher = await subtle().encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext)
  );
  return {
    scheme: CRYPTO_SCHEMA,
    salt: toB64(salt),
    iv: toB64(iv),
    data: toB64(new Uint8Array(cipher))
  };
}
async function decryptText(password, envelope) {
  if (envelope.scheme !== CRYPTO_SCHEMA) throw new PasswordError("unknown scheme");
  const key = await deriveKey(password, fromB64(envelope.salt));
  let plain;
  try {
    plain = await subtle().decrypt(
      { name: "AES-GCM", iv: fromB64(envelope.iv) },
      key,
      fromB64(envelope.data)
    );
  } catch (e) {
    throw new PasswordError();
  }
  return new TextDecoder().decode(plain);
}
async function createCryptoMeta(password) {
  return {
    schema: 1,
    kdf: "pbkdf2-sha256",
    iterations: PBKDF2_ITERATIONS,
    verification: await encryptText(password, VERIFICATION_PLAINTEXT),
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
async function verifyPassword(meta, password) {
  try {
    const plain = await decryptText(password, meta.verification);
    return plain === VERIFICATION_PLAINTEXT;
  } catch (e) {
    return false;
  }
}
function parseCryptoMeta(raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const meta = parsed;
  if (meta.schema !== 1 || meta.kdf !== "pbkdf2-sha256" || !isEnvelope(meta.verification)) {
    return null;
  }
  return {
    schema: 1,
    kdf: "pbkdf2-sha256",
    iterations: typeof meta.iterations === "number" ? meta.iterations : PBKDF2_ITERATIONS,
    verification: meta.verification,
    createdAt: typeof meta.createdAt === "string" ? meta.createdAt : ""
  };
}

// src/main.ts
init_i18n();

// src/store/paths.ts
function normalizeStorePath(input) {
  const trimmed = input.trim().replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  return trimmed === "" ? "SettingProfiles" : trimmed;
}
function poolPaths(root, name) {
  const base = `${root}/${name}`;
  return {
    base,
    app: `${base}/app`,
    plugins: `${base}/plugins`,
    snippets: `${base}/snippets`,
    themes: `${base}/themes`
  };
}
function storePaths(storePath) {
  const root = normalizeStorePath(storePath);
  return {
    root,
    crypto: `${root}/_crypto.json`,
    pcPool: poolPaths(root, "pcconfig"),
    mobilePool: poolPaths(root, "mobileconfig"),
    profilesDir: `${root}/profiles`
  };
}
function lockPath(paths) {
  return `${paths.pcPool.base}/_lock.json`;
}

// src/store/lock.ts
var LOCK_SCHEMA = 1;
function parseLock(raw) {
  if (raw === null) return { ok: false, error: "missing" };
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return { ok: false, error: "corrupt" };
  }
  if (typeof parsed !== "object" || parsed === null) {
    return { ok: false, error: "corrupt" };
  }
  const lock = parsed;
  if (typeof lock.deviceId !== "string" || lock.deviceId.trim() === "") {
    return { ok: false, error: "corrupt" };
  }
  if (typeof lock.schema !== "number" || !Number.isFinite(lock.schema)) {
    return { ok: false, error: "corrupt" };
  }
  if (lock.schema > LOCK_SCHEMA) {
    return { ok: false, error: "future-schema" };
  }
  return {
    ok: true,
    lock: {
      deviceId: lock.deviceId,
      deviceName: typeof lock.deviceName === "string" ? lock.deviceName : "",
      claimedAt: typeof lock.claimedAt === "string" ? lock.claimedAt : "",
      schema: lock.schema
    }
  };
}
function decideRole(input) {
  const { lock, poolHasContent, localDeviceId } = input;
  if (lock.ok) {
    return lock.lock.deviceId === localDeviceId ? { kind: "master" } : { kind: "apply", reason: "other-device", holderName: lock.lock.deviceName };
  }
  if (lock.error === "missing") {
    return poolHasContent ? { kind: "apply", reason: "pool-without-lock" } : { kind: "fresh" };
  }
  return { kind: "apply", reason: lock.error === "corrupt" ? "lock-corrupt" : "future-schema" };
}
function roleStateKey(decision) {
  if (decision.kind === "fresh") return "fresh";
  if (decision.kind === "master") return "master";
  return `apply:${decision.reason}`;
}

// src/store/profile.ts
function normalizeProfileName(input) {
  return input.trim().replace(/[/\\]/g, "");
}
function isValidProfileName(input) {
  return normalizeProfileName(input) !== "";
}
function profileFileName(name, platform) {
  return platform === "mobile" ? `${name}.mobile.json` : `${name}.json`;
}
function profileFromFileName(fileName) {
  if (fileName.endsWith(".mobile.json")) {
    const name = fileName.slice(0, -".mobile.json".length);
    return name === "" ? null : { name, platform: "mobile" };
  }
  if (fileName.endsWith(".json")) {
    const name = fileName.slice(0, -".json".length);
    return name === "" || name.endsWith(".mobile") ? null : { name, platform: "desktop" };
  }
  return null;
}
function stringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : [];
}
function parseProfile(raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return { ok: false };
  }
  if (typeof parsed !== "object" || parsed === null) return { ok: false };
  const doc = parsed;
  if (typeof doc.name !== "string" || doc.name.trim() === "") return { ok: false };
  if (doc.platform !== "desktop" && doc.platform !== "mobile") return { ok: false };
  return {
    ok: true,
    profile: {
      name: doc.name,
      platform: doc.platform,
      adaptedFrom: typeof doc.adaptedFrom === "string" ? doc.adaptedFrom : null,
      app: stringArray(doc.app),
      plugins: stringArray(doc.plugins),
      snippets: stringArray(doc.snippets),
      themes: stringArray(doc.themes),
      createdAt: typeof doc.createdAt === "string" ? doc.createdAt : "",
      updatedAt: typeof doc.updatedAt === "string" ? doc.updatedAt : ""
    }
  };
}
function serializeProfile(profile) {
  return JSON.stringify(profile, null, "	");
}
function emptyProfile(name, platform) {
  const now = (/* @__PURE__ */ new Date()).toISOString();
  return {
    name,
    platform,
    adaptedFrom: platform === "mobile" ? name : null,
    app: [],
    plugins: [],
    snippets: [],
    themes: [],
    createdAt: now,
    updatedAt: now
  };
}
function buildMobileProfile(source, desktopOnlyPluginIds) {
  return {
    name: source.name,
    platform: "mobile",
    adaptedFrom: source.name,
    app: source.app.filter((file) => MOBILE_ALLOWED.includes(file)),
    plugins: source.plugins.filter((id) => !desktopOnlyPluginIds.has(id)),
    snippets: [],
    themes: [],
    createdAt: source.createdAt,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
var MOBILE_ALLOWED = ["core-plugins.json", "community-plugins.json"];
function filterCommunityListForMobile(rawJson, desktopOnlyPluginIds) {
  let list;
  try {
    list = JSON.parse(rawJson);
  } catch (e) {
    return rawJson;
  }
  if (!Array.isArray(list) || !list.every((id) => typeof id === "string")) return rawJson;
  const filtered = list.filter((id) => !desktopOnlyPluginIds.has(id));
  return JSON.stringify(filtered, null, "	");
}

// src/services/apply-service.ts
var WrongStorePasswordError = class extends Error {
  constructor() {
    super("wrong store password");
    this.name = "WrongStorePasswordError";
  }
};
var ApplyService = class {
  constructor(adapter, paths) {
    this.adapter = adapter;
    this.paths = paths;
  }
  /** profile.platform 决定用哪个池：mobile profile 只读移动投影 */
  poolBase(profile) {
    return profile.platform === "mobile" ? this.paths.mobilePool.base : this.paths.pcPool.base;
  }
  /** 读池条目：密文条目解密；密码错误统一抛 WrongStorePasswordError（中止，调用方重弹密码框） */
  async readPoolEntry(path, password) {
    const raw = await this.adapter.readIfExists(path);
    if (raw === null) return null;
    const envelope = parseEnvelopeText(raw);
    if (envelope === null) return raw;
    if (password === null) throw new WrongStorePasswordError();
    try {
      return await decryptText(password, envelope);
    } catch (error) {
      if (error instanceof PasswordError) throw new WrongStorePasswordError();
      throw error;
    }
  }
  async run(profile, password) {
    const report = { applied: [], missingPlugins: [], desktopOnlySkipped: [] };
    const base = this.poolBase(profile);
    const pluginIds = [...profile.plugins];
    if (this.adapter.isMobile) {
      for (const id of [...pluginIds]) {
        const manifestRaw = await this.adapter.obsidianRead(`plugins/${id}/manifest.json`);
        if (manifestRaw !== null) {
          try {
            const manifest = JSON.parse(manifestRaw);
            if (manifest.isDesktopOnly === true) {
              pluginIds.splice(pluginIds.indexOf(id), 1);
              report.desktopOnlySkipped.push(id);
            }
          } catch (e) {
          }
        }
      }
    }
    for (const file of profile.app) {
      const content = await this.readPoolEntry(`${base}/app/${file}`, password);
      if (content === null) continue;
      await this.adapter.obsidianWrite(file, content);
      report.applied.push(file);
    }
    for (const id of pluginIds) {
      if (!await this.adapter.hasLocalPluginDir(id)) {
        report.missingPlugins.push(id);
        continue;
      }
      const copied = await this.adapter.copyTree(
        `${base}/plugins/${id}`,
        this.adapter.obsidianPath(`plugins/${id}`),
        {
          transform: (content) => this.readPoolEntryFromContent(content, password)
        }
      );
      if (copied.length > 0) report.applied.push(`plugins/${id}`);
    }
    for (const name of profile.snippets) {
      const content = await this.readPoolEntry(`${base}/snippets/${name}`, password);
      if (content === null) continue;
      await this.adapter.mkdir(this.adapter.obsidianPath("snippets"));
      await this.adapter.obsidianWrite(`snippets/${name}`, content);
      report.applied.push(`snippets/${name}`);
    }
    for (const name of profile.themes) {
      const content = await this.readPoolEntry(`${base}/themes/${name}`, password);
      if (content === null) continue;
      await this.adapter.mkdir(this.adapter.obsidianPath("themes"));
      await this.adapter.obsidianWrite(`themes/${name}`, content);
      report.applied.push(`themes/${name}`);
    }
    return report;
  }
  /** copyTree 的变换：内容是信封则解密（树内文件已在池里，不再读盘） */
  async readPoolEntryFromContent(content, password) {
    const envelope = parseEnvelopeText(content);
    if (envelope === null) return content;
    if (password === null) throw new WrongStorePasswordError();
    try {
      return await decryptText(password, envelope);
    } catch (error) {
      if (error instanceof PasswordError) throw new WrongStorePasswordError();
      throw error;
    }
  }
};

// src/services/config-adapter.ts
var import_obsidian = require("obsidian");
init_items();
var DEVICE_ID_KEY = "cp-device-id";
var STORE_PASSWORD_KEY = "cp-store-password";
function randomId() {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  return `cp-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}
var ConfigAdapter = class {
  constructor(app) {
    this.app = app;
  }
  /** 平台探测（SPEC §2.4：只读事实，不提供切换） */
  get isMobile() {
    return import_obsidian.Platform.isMobile;
  }
  /**
   * 本机设备 id：首次访问时生成并落 localStorage；之后稳定不变。
   * 注意绝不写入 vault / store（同步后双机同 id，识别就失效——SPEC §11.1）。
   */
  deviceId() {
    const existing = this.app.loadLocalStorage(DEVICE_ID_KEY);
    if (typeof existing === "string" && existing !== "") return existing;
    const id = randomId();
    this.app.saveLocalStorage(DEVICE_ID_KEY, id);
    return id;
  }
  // ── store 密码（SPEC §2.5：只存各设备本地） ──
  storePassword() {
    const value = this.app.loadLocalStorage(STORE_PASSWORD_KEY);
    return typeof value === "string" && value !== "" ? value : null;
  }
  setStorePassword(password) {
    this.app.saveLocalStorage(STORE_PASSWORD_KEY, password);
  }
  // ── lock（SPEC §2.2） ──
  /** lock 原文：文件不存在 → null；存在但读失败 → 抛出（调用方按 corrupt 处理） */
  async readLockRaw(paths) {
    const p = this.n(lockPath(paths));
    if (!await this.adapter.exists(p)) return null;
    return this.adapter.read(p);
  }
  async writeLock(paths, lock) {
    await this.mkdir(this.n(paths.pcPool.base));
    await this.adapter.write(this.n(lockPath(paths)), JSON.stringify(lock, null, "	"));
  }
  async deleteLock(paths) {
    await this.adapter.rmdir(this.n(lockPath(paths)), true);
  }
  buildLock(deviceName) {
    return {
      deviceId: this.deviceId(),
      deviceName,
      claimedAt: (/* @__PURE__ */ new Date()).toISOString(),
      schema: LOCK_SCHEMA
    };
  }
  async poolHasContent(paths) {
    if (!await this.adapter.exists(this.n(paths.root))) return false;
    const dirs = [paths.pcPool.base, paths.mobilePool.base, paths.profilesDir];
    for (const dir of dirs) {
      if (!await this.adapter.exists(this.n(dir))) continue;
      const listed = await this.adapter.list(this.n(dir));
      if (listed.files.length > 0 || listed.folders.length > 0) return true;
    }
    const rootListed = await this.adapter.list(this.n(paths.root));
    return rootListed.files.length > 0;
  }
  // ── `.obsidian` 读写（configDir 是公开属性） ──
  get configDir() {
    return this.app.vault.configDir;
  }
  /** `.obsidian/<rel>` 的 vault 相对完整路径（服务层组树路径用，不硬编码点目录名） */
  obsidianPath(rel) {
    return `${this.configDir}/${rel}`;
  }
  /** 读 `.obsidian/<rel>`；不存在 → null */
  async obsidianRead(rel) {
    const p = this.n(`${this.configDir}/${rel}`);
    if (!await this.adapter.exists(p)) return null;
    return this.adapter.read(p);
  }
  async obsidianExists(rel) {
    return this.adapter.exists(this.n(`${this.configDir}/${rel}`));
  }
  /** 原子写 `.obsidian/<rel>`（先写 .cp-tmp 再 rename，失败不损坏原文件——SPEC §3.3） */
  async obsidianWrite(rel, content) {
    await this.writeAtomic(`${this.configDir}/${rel}`, content);
  }
  /** `.obsidian/plugins` 下已安装社区插件的清单（读各目录 manifest.json） */
  async listInstalledPlugins() {
    return this.listPluginManifests(`${this.configDir}/plugins`);
  }
  /** 池内插件目录只有 id（manifest 是安装产物被排除，SPEC §9.3） */
  async listPoolPluginIds(pool) {
    const root = this.n(pool.plugins);
    if (!await this.adapter.exists(root)) return [];
    const listed = await this.adapter.list(root);
    return listed.folders.map((folder) => {
      var _a;
      return (_a = folder.split("/").pop()) != null ? _a : folder;
    });
  }
  async listPluginManifests(pluginsRoot) {
    var _a;
    const root = this.n(pluginsRoot);
    if (!await this.adapter.exists(root)) return [];
    const out = [];
    const { folders } = await this.adapter.list(root);
    for (const folder of folders) {
      const id = (_a = folder.split("/").pop()) != null ? _a : folder;
      if (id === SELF_PLUGIN_ID) continue;
      const manifestRaw = await this.readIfExists(`${folder}/manifest.json`);
      let name = id;
      let isDesktopOnly = false;
      if (manifestRaw !== null) {
        try {
          const manifest = JSON.parse(manifestRaw);
          if (typeof manifest.name === "string" && manifest.name !== "") name = manifest.name;
          isDesktopOnly = manifest.isDesktopOnly === true;
        } catch (e) {
        }
      }
      out.push({ id, name, isDesktopOnly });
    }
    return out;
  }
  /** 列目录下的文件名（不含子目录）；目录不存在 → 空数组 */
  async listFileNames(dir) {
    const p = this.n(dir);
    if (!await this.adapter.exists(p)) return [];
    const listed = await this.adapter.list(p);
    return listed.files.map((file) => {
      var _a;
      return (_a = file.split("/").pop()) != null ? _a : file;
    });
  }
  /** 递归列出一棵目录树下的全部文件（vault 相对路径） */
  async listFilesRecursive(root) {
    const p = this.n(root);
    if (!await this.adapter.exists(p)) return [];
    const out = [];
    const walk = async (dir) => {
      const listed = await this.adapter.list(this.n(dir));
      out.push(...listed.files);
      for (const folder of listed.folders) await walk(folder);
    };
    await walk(p);
    return out;
  }
  async mkdir(path) {
    await this.adapter.mkdir(this.n(path));
  }
  async readIfExists(path) {
    const p = this.n(path);
    if (!await this.adapter.exists(p)) return null;
    return this.adapter.read(p);
  }
  async writeText(path, content) {
    await this.adapter.write(this.n(path), content);
  }
  /** 原子写：tmp → rename；rename 不支持覆盖的平台退化为直接写（tmp 尽力清理） */
  async writeAtomic(path, content) {
    const p = this.n(path);
    const tmp = `${p}.cp-tmp`;
    await this.adapter.write(tmp, content);
    try {
      await this.adapter.rename(tmp, p);
    } catch (e) {
      await this.adapter.write(p, content);
      await this.adapter.rmdir(tmp, true).catch(() => void 0);
    }
  }
  async deletePath(path) {
    const p = this.n(path);
    if (await this.adapter.exists(p)) {
      await this.adapter.rmdir(p, true);
    }
  }
  async renamePath(from, to) {
    await this.adapter.rename(this.n(from), this.n(to));
  }
  /**
   * 复制源目录树 → 目标目录树（只复制文件，逐个可变换内容、可按文件名排除）。
   * 返回复制的目标相对路径列表（目标根下的相对路径）。
   */
  async copyTree(srcRoot, dstRoot, options = {}) {
    var _a, _b;
    const files = await this.listFilesRecursive(srcRoot);
    const copied = [];
    for (const file of files) {
      const relPath = file.slice(this.n(srcRoot).length + 1);
      const fileName = (_a = relPath.split("/").pop()) != null ? _a : relPath;
      if ((_b = options.excludeFileName) == null ? void 0 : _b.call(options, fileName, relPath)) continue;
      const content = await this.adapter.read(file);
      const transformed = options.transform ? await options.transform(content, relPath) : content;
      await this.mkdir(this.dirname(`${dstRoot}/${relPath}`));
      await this.writeText(`${dstRoot}/${relPath}`, transformed);
      copied.push(relPath);
    }
    return copied;
  }
  /** 同步池时判断 `.obsidian/plugins/<id>` 是否存在（应用端比对缺失插件用） */
  hasLocalPluginDir(id) {
    return this.obsidianExists(`plugins/${id}/manifest.json`);
  }
  /**
   * 重载 Obsidian（SPEC §3.3：应用后必须重载，运行中插件退出回写会覆盖刚应用的文件）。
   * 宿主无公开命令执行 API → 运行时探测内部 app.commands；失败返回 false。
   */
  reloadApp() {
    var _a;
    const app = this.app;
    if (typeof ((_a = app.commands) == null ? void 0 : _a.executeCommandById) === "function") {
      return app.commands.executeCommandById("app:reload");
    }
    return false;
  }
  dirname(path) {
    const idx = path.lastIndexOf("/");
    return idx === -1 ? "" : path.slice(0, idx);
  }
  get adapter() {
    return this.app.vault.adapter;
  }
  n(path) {
    return (0, import_obsidian.normalizePath)(path);
  }
};

// src/store/fingerprint.ts
function fingerprint(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

// src/services/sync-service.ts
init_items();
var SyncService = class {
  constructor(adapter, paths, deviceName) {
    this.adapter = adapter;
    this.paths = paths;
    this.deviceName = deviceName;
  }
  async run(password) {
    const meta = await this.readMeta();
    const entries = {};
    let updated = 0;
    let skipped = 0;
    let pruned = 0;
    const transform = password === null ? void 0 : async (content) => JSON.stringify(await encryptText(password, content), null, "	");
    const put = async (key, dstPath, content) => {
      const finalContent = transform ? await transform(content) : content;
      const fp = fingerprint(finalContent);
      entries[key] = fp;
      if (meta.entries[key] === fp) {
        skipped++;
        return;
      }
      await this.adapter.writeAtomic(dstPath, finalContent);
      updated++;
    };
    for (const spec of APP_FILES) {
      const raw = await this.adapter.obsidianRead(spec.file);
      if (raw === null) {
        if (meta.entries[`app/${spec.file}`] !== void 0) {
          await this.adapter.deletePath(`${this.paths.pcPool.app}/${spec.file}`);
          delete entries[`app/${spec.file}`];
          pruned++;
        }
        continue;
      }
      await this.adapter.mkdir(this.paths.pcPool.app);
      await put(`app/${spec.file}`, `${this.paths.pcPool.app}/${spec.file}`, raw);
    }
    const localPlugins = await this.adapter.listInstalledPlugins();
    const poolPluginIds = await this.adapter.listPoolPluginIds(this.paths.pcPool);
    for (const id of poolPluginIds) {
      if (!localPlugins.some((plugin) => plugin.id === id)) {
        await this.adapter.deletePath(`${this.paths.pcPool.plugins}/${id}`);
        pruned++;
      }
    }
    if (localPlugins.length > 0) await this.adapter.mkdir(this.paths.pcPool.plugins);
    for (const plugin of localPlugins) {
      const copied = await this.adapter.copyTree(
        this.adapter.obsidianPath(`plugins/${plugin.id}`),
        `${this.paths.pcPool.plugins}/${plugin.id}`,
        { excludeFileName: (fileName) => !isCarryablePluginFile(fileName), transform }
      );
      updated += copied.length;
    }
    pruned += await this.syncFlatDir("snippets", this.paths.pcPool.snippets, "snippets", entries, meta, transform);
    pruned += await this.syncFlatDir("themes", this.paths.pcPool.themes, "themes", entries, meta, transform);
    const newMeta = {
      schema: 1,
      syncedAt: (/* @__PURE__ */ new Date()).toISOString(),
      deviceName: this.deviceName,
      encrypted: password !== null,
      entries
    };
    await this.adapter.writeAtomic(`${this.paths.pcPool.base}/_meta.json`, JSON.stringify(newMeta, null, "	"));
    const mobileProjection = await this.buildMobileProjection(password, localPlugins);
    return { updated, skipped, pruned, mobileProjection };
  }
  /** 文件级目录（snippets/themes）：源文件全量入池（含加密）+ 池内多余清除 */
  async syncFlatDir(srcRel, dstDir, keyPrefix, entries, meta, transform) {
    const srcDir = this.adapter.obsidianPath(srcRel);
    const localNames = await this.adapter.listFileNames(srcDir);
    let pruned = 0;
    if (localNames.length > 0) await this.adapter.mkdir(dstDir);
    for (const name of localNames) {
      const raw = await this.adapter.readIfExists(`${srcDir}/${name}`);
      if (raw === null) continue;
      const finalContent = transform ? await transform(raw) : raw;
      const fp = fingerprint(finalContent);
      entries[`${keyPrefix}/${name}`] = fp;
      if (meta.entries[`${keyPrefix}/${name}`] === fp) continue;
      await this.adapter.writeAtomic(`${dstDir}/${name}`, finalContent);
    }
    for (const name of await this.adapter.listFileNames(dstDir)) {
      if (!localNames.includes(name)) {
        await this.adapter.deletePath(`${dstDir}/${name}`);
        delete entries[`${keyPrefix}/${name}`];
        pruned++;
      }
    }
    return pruned;
  }
  async readMeta() {
    const raw = await this.adapter.readIfExists(`${this.paths.pcPool.base}/_meta.json`);
    if (raw === null) return { schema: 1, syncedAt: "", deviceName: "", encrypted: false, entries: {} };
    try {
      const parsed = JSON.parse(raw);
      return {
        schema: 1,
        syncedAt: typeof parsed.syncedAt === "string" ? parsed.syncedAt : "",
        deviceName: typeof parsed.deviceName === "string" ? parsed.deviceName : "",
        encrypted: parsed.encrypted === true,
        entries: typeof parsed.entries === "object" && parsed.entries !== null ? parsed.entries : {}
      };
    } catch (e) {
      return { schema: 1, syncedAt: "", deviceName: "", encrypted: false, entries: {} };
    }
  }
  /**
   * 移动投影（SPEC §3.2 第 3 步）：mobileconfig 只放 core/community 两个 app 文件
   * （community 按本机 manifest 剔除 isDesktopOnly 插件）+ 非 desktopOnly 插件；
   * 同时把 mobile profile 文档按当前桌面 profile 重新生成。
   */
  async buildMobileProjection(password, localPlugins) {
    const profileFiles = await this.adapter.listFileNames(this.paths.profilesDir);
    const mobileProfiles = profileFiles.map((name) => profileFromFileName(name)).filter((entry) => (entry == null ? void 0 : entry.platform) === "mobile");
    if (mobileProfiles.length === 0) return false;
    const transform = password === null ? void 0 : async (content) => JSON.stringify(await encryptText(password, content), null, "	");
    const put = async (dstPath, content) => {
      await this.adapter.writeAtomic(dstPath, transform ? await transform(content) : content);
    };
    const desktopOnly = new Set(localPlugins.filter((p) => p.isDesktopOnly).map((p) => p.id));
    await this.adapter.mkdir(this.paths.mobilePool.app);
    const core = await this.adapter.obsidianRead("core-plugins.json");
    if (core !== null) await put(`${this.paths.mobilePool.app}/core-plugins.json`, core);
    const community = await this.adapter.obsidianRead("community-plugins.json");
    if (community !== null) {
      await put(
        `${this.paths.mobilePool.app}/community-plugins.json`,
        filterCommunityListForMobile(community, desktopOnly)
      );
    }
    const allowed = localPlugins.filter((p) => !desktopOnly.has(p.id));
    const mobilePoolIds = await this.adapter.listPoolPluginIds(this.paths.mobilePool);
    for (const id of mobilePoolIds) {
      if (!allowed.some((p) => p.id === id)) {
        await this.adapter.deletePath(`${this.paths.mobilePool.plugins}/${id}`);
      }
    }
    if (allowed.length > 0) await this.adapter.mkdir(this.paths.mobilePool.plugins);
    for (const plugin of allowed) {
      await this.adapter.copyTree(
        this.adapter.obsidianPath(`plugins/${plugin.id}`),
        `${this.paths.mobilePool.plugins}/${plugin.id}`,
        {
          excludeFileName: (fileName) => !isCarryablePluginFile(fileName),
          transform
        }
      );
    }
    for (const entry of mobileProfiles) {
      const desktopRaw = await this.adapter.readIfExists(`${this.paths.profilesDir}/${entry.name}.json`);
      if (desktopRaw === null) continue;
      const parsed = parseProfile(desktopRaw);
      if (!parsed.ok || parsed.profile.platform !== "desktop") continue;
      const twin = buildMobileProfile(parsed.profile, desktopOnly);
      await this.adapter.writeAtomic(
        `${this.paths.profilesDir}/${entry.name}.mobile.json`,
        serializeProfile(twin)
      );
    }
    return true;
  }
};

// src/modals/apply-result.ts
var import_obsidian2 = require("obsidian");
init_i18n();
var ApplyResultModal = class extends import_obsidian2.Modal {
  constructor(app, profileName, report, reload) {
    super(app);
    this.profileName = profileName;
    this.report = report;
    this.reload = reload;
  }
  onOpen() {
    this.contentEl.addClass("cp-modal");
    this.titleEl.setText(t("\u5DF2\u5E94\u7528 profile\uFF1A{name}", { name: this.profileName }));
    const message = this.report.applied.length > 0 ? t("\u5DF2\u5E94\u7528 {count} \u9879\u3002\u91CD\u8F7D Obsidian \u4F7F\u914D\u7F6E\u751F\u6548\uFF1F", { count: this.report.applied.length }) : t("\u6CA1\u6709\u53EF\u5E94\u7528\u7684\u6761\u76EE\u3002");
    this.contentEl.createEl("p", { cls: "cp-modal__message", text: message });
    this.contentEl.createEl("p", {
      cls: "cp-modal__hint",
      text: t("\u5FC5\u987B\u91CD\u8F7D\uFF1A\u8FD0\u884C\u4E2D\u7684\u63D2\u4EF6\u9000\u51FA\u65F6\u4F1A\u628A\u5185\u5B58\u91CC\u7684\u65E7\u914D\u7F6E\u5199\u56DE\uFF0C\u4E0D\u91CD\u8F7D\u4F1A\u8986\u76D6\u521A\u5E94\u7528\u7684\u6587\u4EF6\u3002")
    });
    if (this.report.missingPlugins.length > 0) {
      const box = this.contentEl.createDiv();
      box.createEl("p", {
        cls: "cp-modal__hint",
        text: t("\u4EE5\u4E0B\u63D2\u4EF6\u672C\u673A\u672A\u5B89\u88C5\uFF0C\u5DF2\u8DF3\u8FC7\uFF08\u5B89\u88C5\u540E\u91CD\u65B0\u5E94\u7528\u5373\u53EF\uFF09\uFF1A")
      });
      const ul = box.createEl("ul");
      for (const id of this.report.missingPlugins) ul.createEl("li", { text: id });
    }
    if (this.report.desktopOnlySkipped.length > 0) {
      const box = this.contentEl.createDiv();
      box.createEl("p", { cls: "cp-modal__hint", text: t("\u4EE5\u4E0B\u63D2\u4EF6\u4E3A\u684C\u9762\u4E13\u5C5E\uFF0C\u5DF2\u4ECE\u624B\u673A\u7AEF\u5254\u9664\uFF1A") });
      const ul = box.createEl("ul");
      for (const id of this.report.desktopOnlySkipped) ul.createEl("li", { text: id });
    }
    if (this.report.applied.length === 0) {
      const buttons2 = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
      new import_obsidian2.ButtonComponent(buttons2).setButtonText(t("\u5173\u95ED")).setCta().onClick(() => this.close());
      return;
    }
    const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
    new import_obsidian2.ButtonComponent(buttons).setButtonText(t("\u7A0D\u540E\u624B\u52A8\u91CD\u8F7D")).onClick(() => this.close());
    new import_obsidian2.ButtonComponent(buttons).setButtonText(t("\u7ACB\u5373\u91CD\u8F7D")).setCta().onClick(() => {
      this.close();
      if (!this.reload()) {
        new import_obsidian2.Notice(t("\u65E0\u6CD5\u81EA\u52A8\u91CD\u8F7D\uFF0C\u8BF7\u624B\u52A8\u91CD\u542F Obsidian\uFF08Ctrl/Cmd+R \u6216\u91CD\u542F\u5E94\u7528\uFF09\u3002"));
      }
    });
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/modals/first-run-modal.ts
var import_obsidian3 = require("obsidian");
init_i18n();
var FirstRunModal = class extends import_obsidian3.Modal {
  constructor(app, onChoose) {
    super(app);
    this.onChoose = onChoose;
    this.answered = false;
  }
  onOpen() {
    this.contentEl.addClass("cp-modal", "cp-first-run");
    this.titleEl.setText(t("\u9009\u62E9\u672C\u673A\u89D2\u8272"));
    this.contentEl.createEl("p", {
      cls: "cp-modal__message",
      text: t(
        "\u5F53\u524D vault \u5185\u6CA1\u6709\u53D1\u73B0\u914D\u7F6E\u5E93\u3002\u672C\u673A\u662F\u300C\u4E3B\u914D\u7F6E\u300D\uFF08\u628A\u672C\u673A Obsidian \u914D\u7F6E\u540C\u6B65\u5230 store\uFF09\uFF0C\u8FD8\u662F\u300C\u5E94\u7528\u914D\u7F6E\u300D\uFF08\u53EA\u5E94\u7528\u5176\u4ED6\u8BBE\u5907\u540C\u6B65\u6765\u7684\u914D\u7F6E\uFF09\uFF1F"
      )
    });
    this.contentEl.createEl("p", {
      cls: "cp-modal__hint",
      text: t("\u4E0D\u786E\u5B9A\u5C31\u9009\u5E94\u7528\u914D\u7F6E\u2014\u2014\u5E94\u7528\u914D\u7F6E\u4E0D\u4F1A\u5199\u5165 store\uFF0C\u968F\u65F6\u53EF\u4EE5\u5728\u8BBE\u7F6E\u91CC\u6539\u3002")
    });
    const choices = this.contentEl.createDiv({ cls: "cp-first-run__choice" });
    const apply = new import_obsidian3.ButtonComponent(choices).setButtonText(t("\u672C\u673A\u4E3A\u5E94\u7528\u914D\u7F6E")).onClick(() => this.answer("apply"));
    apply.buttonEl.addClass("cp-first-run__option");
    apply.setCta();
    const master = new import_obsidian3.ButtonComponent(choices).setButtonText(t("\u672C\u673A\u4E3A\u4E3B\u914D\u7F6E\uFF08\u540C\u6B65\u672C\u673A\u914D\u7F6E\u5230 store\uFF09")).onClick(() => this.answer("master"));
    master.buttonEl.addClass("cp-first-run__option");
  }
  onClose() {
    this.contentEl.empty();
    if (!this.answered) this.onChoose("apply");
  }
  answer(choice) {
    this.answered = true;
    this.close();
    this.onChoose(choice);
  }
};

// src/modals/password.ts
var import_obsidian4 = require("obsidian");
init_i18n();
function readInputValue(input) {
  var _a;
  return (_a = input == null ? void 0 : input.value) != null ? _a : "";
}
function promptNewStorePassword(app) {
  return new Promise((resolve) => {
    new NewPasswordModal(app, resolve).open();
  });
}
function promptStorePassword(app) {
  return new Promise((resolve) => {
    new PasswordInputModal(app, resolve).open();
  });
}
function promptChangeStorePassword(app) {
  return new Promise((resolve) => {
    new ChangePasswordModal(app, resolve).open();
  });
}
var NewPasswordModal = class extends import_obsidian4.Modal {
  constructor(app, settle) {
    super(app);
    this.settle = settle;
    this.answered = false;
  }
  onOpen() {
    this.contentEl.addClass("cp-modal");
    this.titleEl.setText(t("\u4E3A\u914D\u7F6E\u5E93\u8BBE\u7F6E\u5BC6\u7801"));
    this.contentEl.createEl("p", {
      cls: "cp-modal__message",
      text: t("store \u5C06\u968F\u4F60\u7684\u7B14\u8BB0\u540C\u6B65\uFF0C\u63D2\u4EF6\u914D\u7F6E\u91CC\u53EF\u80FD\u542B token \u7B49\u654F\u611F\u4FE1\u606F\u2014\u2014\u9ED8\u8BA4\u6574\u5E93\u52A0\u5BC6\uFF0C\u5BC6\u7801\u53EA\u5B58\u5404\u8BBE\u5907\u672C\u5730\uFF0C\u4E0D\u8FDB vault\u3002")
    });
    let pwInput = null;
    let pw2Input = null;
    new import_obsidian4.Setting(this.contentEl).setName(t("\u5BC6\u7801")).addText((text) => {
      text.inputEl.type = "password";
      pwInput = text.inputEl;
    });
    new import_obsidian4.Setting(this.contentEl).setName(t("\u518D\u8F93\u4E00\u6B21")).addText((text) => {
      text.inputEl.type = "password";
      pw2Input = text.inputEl;
    });
    const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
    new import_obsidian4.ButtonComponent(buttons).setButtonText(t("\u6682\u4E0D\u52A0\u5BC6")).setTooltip(t("store \u4EE5\u660E\u6587\u968F\u7B14\u8BB0\u540C\u6B65\uFF1B\u540E\u7EED\u53EF\u5728\u8BBE\u7F6E\u91CC\u5F00\u542F\u52A0\u5BC6\uFF08\u89E6\u53D1\u4E00\u6B21\u91CD\u65B0\u540C\u6B65\uFF09")).onClick(() => {
      this.answered = true;
      this.settle(null);
      this.close();
    });
    new import_obsidian4.ButtonComponent(buttons).setButtonText(t("\u542F\u7528\u52A0\u5BC6")).setCta().onClick(() => {
      const pw = readInputValue(pwInput);
      if (pw === "" || pw !== readInputValue(pw2Input)) {
        new import_obsidian4.Notice(t("\u4E24\u6B21\u8F93\u5165\u4E0D\u4E00\u81F4\u6216\u4E3A\u7A7A\u3002"));
        return;
      }
      this.answered = true;
      this.settle(pw);
      this.close();
    });
  }
  onClose() {
    this.contentEl.empty();
    if (!this.answered) this.settle(null);
  }
};
var PasswordInputModal = class extends import_obsidian4.Modal {
  constructor(app, settle) {
    super(app);
    this.settle = settle;
    this.answered = false;
  }
  onOpen() {
    this.contentEl.addClass("cp-modal");
    this.titleEl.setText(t("\u8F93\u5165\u914D\u7F6E\u5E93\u5BC6\u7801"));
    this.contentEl.createEl("p", {
      cls: "cp-modal__message",
      text: t("\u8FD9\u4E2A\u914D\u7F6E\u5E93\u5DF2\u52A0\u5BC6\u3002\u8F93\u5165\u4E3B\u914D\u7F6E\u8BBE\u5907\u8BBE\u7F6E\u7684\u5BC6\u7801\u4EE5\u7EE7\u7EED\uFF0C\u9A8C\u8BC1\u901A\u8FC7\u540E\u672C\u673A\u8BB0\u4F4F\u5BC6\u7801\u3002")
    });
    let pwInput = null;
    new import_obsidian4.Setting(this.contentEl).setName(t("\u5BC6\u7801")).addText((text) => {
      text.inputEl.type = "password";
      pwInput = text.inputEl;
    });
    const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
    new import_obsidian4.ButtonComponent(buttons).setButtonText(t("\u53D6\u6D88")).onClick(() => {
      this.answered = true;
      this.settle(null);
      this.close();
    });
    new import_obsidian4.ButtonComponent(buttons).setButtonText(t("\u786E\u8BA4")).setCta().onClick(() => {
      this.answered = true;
      this.settle(readInputValue(pwInput));
      this.close();
    });
  }
  onClose() {
    this.contentEl.empty();
    if (!this.answered) this.settle(null);
  }
};
var ChangePasswordModal = class extends import_obsidian4.Modal {
  constructor(app, settle) {
    super(app);
    this.settle = settle;
    this.answered = false;
  }
  onOpen() {
    this.contentEl.addClass("cp-modal");
    this.titleEl.setText(t("\u4FEE\u6539\u914D\u7F6E\u5E93\u5BC6\u7801"));
    this.contentEl.createEl("p", {
      cls: "cp-modal__message",
      text: t("\u6C60\u5185\u5168\u90E8\u5BC6\u6587\u4F1A\u4EE5\u65B0\u5BC6\u7801\u91CD\u65B0\u52A0\u5BC6\u5E76\u91CD\u5199\uFF0C\u5176\u4ED6\u8BBE\u5907\u4E0B\u6B21\u5E94\u7528\u65F6\u8F93\u5165\u65B0\u5BC6\u7801\u5373\u53EF\u3002")
    });
    let oldInput = null;
    let newInput = null;
    let new2Input = null;
    new import_obsidian4.Setting(this.contentEl).setName(t("\u5F53\u524D\u5BC6\u7801")).addText((text) => {
      text.inputEl.type = "password";
      oldInput = text.inputEl;
    });
    new import_obsidian4.Setting(this.contentEl).setName(t("\u65B0\u5BC6\u7801")).addText((text) => {
      text.inputEl.type = "password";
      newInput = text.inputEl;
    });
    new import_obsidian4.Setting(this.contentEl).setName(t("\u518D\u8F93\u4E00\u6B21\u65B0\u5BC6\u7801")).addText((text) => {
      text.inputEl.type = "password";
      new2Input = text.inputEl;
    });
    const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
    new import_obsidian4.ButtonComponent(buttons).setButtonText(t("\u53D6\u6D88")).onClick(() => {
      this.answered = true;
      this.settle(null);
      this.close();
    });
    new import_obsidian4.ButtonComponent(buttons).setButtonText(t("\u786E\u8BA4\u4FEE\u6539")).setCta().onClick(() => {
      const newPassword = readInputValue(newInput);
      if (newPassword === "" || newPassword !== readInputValue(new2Input)) {
        new import_obsidian4.Notice(t("\u4E24\u6B21\u8F93\u5165\u4E0D\u4E00\u81F4\u6216\u4E3A\u7A7A\u3002"));
        return;
      }
      this.answered = true;
      this.settle({ oldPassword: readInputValue(oldInput), newPassword });
      this.close();
    });
  }
  onClose() {
    this.contentEl.empty();
    if (!this.answered) this.settle(null);
  }
};

// src/settings.ts
var import_obsidian7 = require("obsidian");
init_i18n();

// src/modals/confirm.ts
var import_obsidian5 = require("obsidian");
var ConfirmModal = class extends import_obsidian5.Modal {
  constructor(app, options, settle) {
    super(app);
    this.options = options;
    this.settle = settle;
    this.answered = false;
  }
  onOpen() {
    this.contentEl.addClass("cp-modal");
    this.titleEl.setText(this.options.title);
    this.contentEl.createEl("p", {
      cls: "cp-modal__message",
      text: this.options.message
    });
    const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
    new import_obsidian5.ButtonComponent(buttons).setButtonText(this.options.cancelLabel).onClick(() => this.close());
    const accept = new import_obsidian5.ButtonComponent(buttons).setButtonText(this.options.acceptLabel).onClick(() => {
      this.answered = true;
      this.settle(true);
      this.close();
    });
    if (this.options.acceptStyle === "warning") accept.setDestructive();
    else accept.setCta();
  }
  onClose() {
    this.contentEl.empty();
    if (!this.answered) this.settle(false);
  }
};
function askConfirm(app, options) {
  return new Promise((resolve) => {
    new ConfirmModal(app, options, resolve).open();
  });
}

// src/modals/text-input.ts
var import_obsidian6 = require("obsidian");
init_i18n();
function promptText(app, options) {
  return new Promise((resolve) => {
    new TextInputModal(app, options, resolve).open();
  });
}
var TextInputModal = class extends import_obsidian6.Modal {
  constructor(app, options, settle) {
    super(app);
    this.options = options;
    this.settle = settle;
    this.answered = false;
  }
  onOpen() {
    var _a;
    this.contentEl.addClass("cp-modal");
    this.titleEl.setText(this.options.title);
    let input = null;
    new import_obsidian6.Setting(this.contentEl).setName(this.options.title).addText((text) => {
      if (this.options.placeholder) text.setPlaceholder(this.options.placeholder);
      if (this.options.value !== void 0) text.setValue(this.options.value);
      input = text.inputEl;
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") this.accept(input);
      });
    });
    const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
    new import_obsidian6.ButtonComponent(buttons).setButtonText(t("\u53D6\u6D88")).onClick(() => {
      this.answered = true;
      this.settle(null);
      this.close();
    });
    new import_obsidian6.ButtonComponent(buttons).setButtonText((_a = this.options.acceptLabel) != null ? _a : t("\u786E\u8BA4")).setCta().onClick(() => this.accept(input));
  }
  accept(input) {
    var _a;
    const value = ((_a = input == null ? void 0 : input.value) != null ? _a : "").trim();
    if (value === "") return;
    this.answered = true;
    this.settle(value);
    this.close();
  }
  onClose() {
    this.contentEl.empty();
    if (!this.answered) this.settle(null);
  }
};

// src/settings.ts
var CPSettingTab = class extends import_obsidian7.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    this.renderGeneral(containerEl);
    this.renderRole(containerEl);
    void this.renderCrypto(containerEl);
    void this.renderProfiles(containerEl);
  }
  renderGeneral(container) {
    new import_obsidian7.Setting(container).setName(t("\u901A\u7528")).setHeading();
    new import_obsidian7.Setting(container).setName(t("\u914D\u7F6E\u5E93\u8DEF\u5F84")).setDesc(t("store \u5728 vault \u5185\u7684\u8DEF\u5F84\uFF08\u9ED8\u8BA4 SettingProfiles\uFF0Cvault \u6839\uFF09\u3002\u4FEE\u6539\u540E\u91CD\u8F7D\u63D2\u4EF6\u751F\u6548\u3002")).addText(
      (text) => text.setPlaceholder("SettingProfiles").setValue(this.plugin.config.storePath).onChange(async (value) => {
        this.plugin.config.storePath = value;
        await this.plugin.saveConfig();
      })
    );
    new import_obsidian7.Setting(container).setName(t("\u8BBE\u5907\u540D")).setDesc(t("\u663E\u793A\u5728\u4E3B\u914D\u7F6E\u5F52\u5C5E\u63D0\u793A\u91CC\uFF0C\u5E2E\u52A9\u8BC6\u522B\u54EA\u53F0\u8BBE\u5907\u6301\u6709\u4E3B\u914D\u7F6E\u3002")).addText(
      (text) => text.setPlaceholder(this.plugin.effectiveDeviceName()).setValue(this.plugin.config.deviceName).onChange(async (value) => {
        this.plugin.config.deviceName = value;
        await this.plugin.saveConfig();
      })
    );
    new import_obsidian7.Setting(container).setName(t("\u8BED\u8A00")).addDropdown(
      (drop) => drop.addOptions({
        auto: t("\u8DDF\u968F Obsidian"),
        zh: t("\u4E2D\u6587"),
        en: t("English")
      }).setValue(this.plugin.config.language).onChange(async (value) => {
        this.plugin.config.language = value;
        await this.plugin.saveConfig();
        this.plugin.applyLanguage();
        this.display();
      })
    );
  }
  renderRole(container) {
    new import_obsidian7.Setting(container).setName(t("\u89D2\u8272")).setHeading();
    const role = this.plugin.currentRole;
    const roleName = role.kind === "master" ? t("\u4E3B\u914D\u7F6E") : role.kind === "apply" ? t("\u5E94\u7528\u914D\u7F6E") : t("\u5C1A\u672A\u8BBE\u5B9A");
    const holderDesc = role.holderName ? t("\u4E3B\u914D\u7F6E\u6301\u6709\u8005\uFF1A{name}", { name: role.holderName }) : "";
    new import_obsidian7.Setting(container).setName(t("\u5F53\u524D\u89D2\u8272")).setDesc(holderDesc).then((s) => {
      s.controlEl.createSpan({ text: roleName });
    });
    if (role.kind === "master") {
      new import_obsidian7.Setting(container).setName(t("\u8BA9\u51FA\u4E3B\u914D\u7F6E")).then((s) => s.addButton((btn) => btn.setButtonText(t("\u8BA9\u51FA\u4E3B\u914D\u7F6E")).onClick(() => void this.releaseMaster(s))));
    } else {
      new import_obsidian7.Setting(container).setName(t("\u593A\u53D6\u4E3B\u914D\u7F6E")).then((s) => s.addButton((btn) => btn.setButtonText(t("\u593A\u53D6\u4E3B\u914D\u7F6E")).onClick(() => void this.claimMaster(s))));
    }
  }
  // ── 加密（SPEC §2.5：改密 / 启用仅主配置 PC 端） ──
  async renderCrypto(container) {
    new import_obsidian7.Setting(container).setName(t("\u52A0\u5BC6")).setHeading();
    let encrypted = false;
    try {
      encrypted = await this.plugin.storeEncrypted();
    } catch (e) {
      encrypted = false;
    }
    const canManage = !this.plugin.store.isMobile && this.plugin.currentRole.kind === "master";
    if (encrypted) {
      new import_obsidian7.Setting(container).setName(t("\u914D\u7F6E\u5E93\u52A0\u5BC6")).setDesc(t("store \u6574\u5E93\u52A0\u5BC6\uFF1B\u5BC6\u7801\u53EA\u5B58\u5404\u8BBE\u5907\u672C\u5730\uFF0C\u4E0D\u8FDB vault\u3002"));
      if (canManage) {
        new import_obsidian7.Setting(container).setName(t("\u4FEE\u6539\u5BC6\u7801")).setDesc(t("\u6C60\u5185\u5168\u90E8\u5BC6\u6587\u4F1A\u4EE5\u65B0\u5BC6\u7801\u91CD\u65B0\u52A0\u5BC6\u91CD\u5199\u3002")).addButton((btn) => btn.setButtonText(t("\u4FEE\u6539\u5BC6\u7801")).onClick(() => void this.changePassword()));
      }
    } else {
      new import_obsidian7.Setting(container).setName(t("\u914D\u7F6E\u5E93\u52A0\u5BC6")).setDesc(
        canManage ? t("\u5C1A\u672A\u52A0\u5BC6\u3002\u4E0B\u6B21\u540C\u6B65\u65F6\u53EF\u8BBE\u7F6E\u5BC6\u7801\uFF0Cstore \u5C06\u6574\u5E93\u52A0\u5BC6\u3002") : t("\u5C1A\u672A\u52A0\u5BC6\uFF08\u4E3B\u914D\u7F6E\u8BBE\u5907\u53EF\u5728\u5176\u8BBE\u7F6E\u4E2D\u5F00\u542F\uFF09\u3002")
      );
      if (canManage) {
        new import_obsidian7.Setting(container).setName(t("\u542F\u7528\u52A0\u5BC6")).setDesc(t("\u8BBE\u7F6E\u5BC6\u7801\u5E76\u7ACB\u5373\u91CD\u65B0\u540C\u6B65\uFF08\u6574\u5E93\u52A0\u5BC6\uFF09\u3002")).addButton((btn) => btn.setButtonText(t("\u542F\u7528\u52A0\u5BC6")).onClick(() => void this.plugin.runSync()));
      }
    }
  }
  async changePassword() {
    const input = await promptChangeStorePassword(this.app);
    if (input === null) return;
    try {
      await this.plugin.changeStorePassword(input.oldPassword, input.newPassword);
      new import_obsidian7.Notice(t("\u5BC6\u7801\u5DF2\u4FEE\u6539\uFF0C\u6C60\u5185\u5BC6\u6587\u5DF2\u91CD\u5199\u3002"));
    } catch (error) {
      if (error instanceof WrongStorePasswordError) {
        new import_obsidian7.Notice(t("\u5BC6\u7801\u4E0D\u6B63\u786E\u3002"));
        return;
      }
      new import_obsidian7.Notice(t("\u4FEE\u6539\u5931\u8D25\uFF1A{message}", { message: error instanceof Error ? error.message : String(error) }));
    }
  }
  // ── Profiles（PC 端管理；与编辑 Modal 共用渲染） ──
  async renderProfiles(container) {
    new import_obsidian7.Setting(container).setName(t("Profiles")).setHeading();
    if (this.plugin.store.isMobile) {
      new import_obsidian7.Setting(container).setDesc(t("profile \u7BA1\u7406\u8BF7\u5230 PC \u7AEF\uFF08\u624B\u673A\u53EA\u5E94\u7528\u914D\u7F6E\uFF09\u3002"));
      return;
    }
    const profiles = await this.plugin.listProfiles();
    const names = [...new Set(profiles.map((entry) => entry.name))];
    new import_obsidian7.Setting(container).setName(t("\u65B0\u5EFA profile")).setDesc(t("\u521B\u5EFA\u540E\u91CD\u8F7D\u63D2\u4EF6\uFF0C\u5E94\u7528\u547D\u4EE4\u5373\u53EF\u7528\u3002")).addButton((btn) => btn.setButtonText(t("\u65B0\u5EFA")).setCta().onClick(() => void this.createProfile()));
    if (profiles.length === 0) {
      new import_obsidian7.Setting(container).setDesc(t("\u8FD8\u6CA1\u6709 profile\u3002\u65B0\u5EFA\u4E00\u4E2A\uFF0C\u6216\u5728\u4E3B\u914D\u7F6E\u7AEF\u6267\u884C\u540C\u6B65\u3002"));
      return;
    }
    for (const name of names) {
      const desktop = profiles.find((entry) => entry.name === name && entry.platform === "desktop");
      const mobile = profiles.find((entry) => entry.name === name && entry.platform === "mobile");
      if (desktop) {
        this.renderProfileRow(container, name, "desktop", mobile !== null);
      }
      if (mobile) {
        this.renderProfileRow(container, name, "mobile", false);
      }
    }
  }
  renderProfileRow(container, name, platform, hasMobileTwin) {
    const label = platform === "mobile" ? t("{name}\uFF08\u624B\u673A\uFF09", { name }) : name;
    const desc = platform === "mobile" ? t("\u7531\u540C\u540D\u684C\u9762 profile \u9002\u914D\u751F\u6210\uFF0C\u8DDF\u968F\u5176\u66F4\u65B0\u3002") : hasMobileTwin ? t("\u5DF2\u5F00\u542F\u624B\u673A\u9002\u914D\u3002") : "";
    const setting = new import_obsidian7.Setting(container).setName(label).setDesc(desc);
    if (platform === "desktop") {
      setting.addToggle(
        (toggle) => toggle.setValue(hasMobileTwin).setTooltip(t("\u9002\u914D\u624B\u673A")).onChange((value) => void this.setMobileAdaptation(name, value))
      );
    }
    setting.addButton((btn) => btn.setButtonText(t("\u67E5\u770B/\u7F16\u8F91")).onClick(() => void this.plugin.openProfileEditor(name, platform))).addButton((btn) => btn.setButtonText(t("\u91CD\u547D\u540D")).onClick(() => void this.renameProfile(name))).addButton(
      (btn) => btn.setButtonText(t("\u5220\u9664")).setDestructive().onClick(() => void this.deleteProfile(name, platform))
    );
  }
  async createProfile() {
    const name = await promptText(this.app, {
      title: t("\u65B0\u5EFA profile"),
      placeholder: t("\u540D\u79F0")
    });
    if (name === null) return;
    const adaptMobile = await askConfirm(this.app, {
      title: t("\u65B0\u5EFA profile"),
      message: t("\u4E3A\u300A{name}\u300B\u540C\u65F6\u751F\u6210\u624B\u673A\u9002\u914D profile \u5417\uFF1F", { name }),
      acceptLabel: t("\u684C\u9762 + \u624B\u673A"),
      cancelLabel: t("\u4EC5\u684C\u9762")
    });
    const ok = await this.plugin.createProfile(name, adaptMobile);
    if (ok) this.display();
  }
  async renameProfile(from) {
    const to = await promptText(this.app, {
      title: t("\u91CD\u547D\u540D profile"),
      value: from
    });
    if (to === null) return;
    const ok = await this.plugin.renameProfile(from, to);
    if (ok) this.display();
  }
  async deleteProfile(name, platform) {
    const label = platform === "mobile" ? t("{name}\uFF08\u624B\u673A\uFF09", { name }) : name;
    const confirmed = await askConfirm(this.app, {
      title: t("\u5220\u9664 profile"),
      message: t("\u786E\u5B9A\u5220\u9664\u300A{label}\u300B\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002", { label }),
      acceptLabel: t("\u5220\u9664"),
      cancelLabel: t("\u53D6\u6D88"),
      acceptStyle: "warning"
    });
    if (!confirmed) return;
    await this.plugin.deleteProfile(name, platform);
    this.display();
  }
  async setMobileAdaptation(name, enabled) {
    try {
      await this.plugin.setMobileAdaptation(name, enabled);
    } catch (error) {
      new import_obsidian7.Notice(t("\u64CD\u4F5C\u5931\u8D25\uFF1A{message}", { message: error instanceof Error ? error.message : String(error) }));
    }
    this.display();
  }
  // ── 角色切换 ──
  async claimMaster(setting) {
    const confirmed = await askConfirm(this.app, {
      title: t("\u593A\u53D6\u4E3B\u914D\u7F6E"),
      message: t("\u5C06\u4EE5\u672C\u673A\u8EAB\u4EFD\u63A5\u7BA1 store \u7684\u4E3B\u914D\u7F6E\u3002\u539F\u4E3B\u914D\u7F6E\u8BBE\u5907\u4F1A\u5728\u4E0B\u6B21\u64CD\u4F5C\u524D\u81EA\u52A8\u964D\u7EA7\u4E3A\u5E94\u7528\u914D\u7F6E\u3002\u7EE7\u7EED\uFF1F"),
      acceptLabel: t("\u593A\u53D6\u4E3B\u914D\u7F6E"),
      cancelLabel: t("\u53D6\u6D88")
    });
    if (!confirmed) return;
    try {
      await this.plugin.claimMaster();
      this.display();
    } catch (error) {
      setting.setName(`${t("\u593A\u53D6\u6216\u8BA9\u51FA\u5931\u8D25\uFF1A{message}", { message: String(error) })}`);
    }
  }
  async releaseMaster(setting) {
    const confirmed = await askConfirm(this.app, {
      title: t("\u8BA9\u51FA\u4E3B\u914D\u7F6E"),
      message: t("\u8BA9\u51FA\u540E store \u6682\u65E0\u4E3B\u914D\u7F6E\uFF0C\u6240\u6709\u8BBE\u5907\u90FD\u53EA\u80FD\u5E94\u7528\uFF0C\u76F4\u5230\u6709\u4EBA\u91CD\u65B0\u593A\u53D6\u3002\u7EE7\u7EED\uFF1F"),
      acceptLabel: t("\u8BA9\u51FA\u4E3B\u914D\u7F6E"),
      cancelLabel: t("\u53D6\u6D88")
    });
    if (!confirmed) return;
    try {
      await this.plugin.releaseMaster();
      this.display();
    } catch (error) {
      setting.setName(`${t("\u593A\u53D6\u6216\u8BA9\u51FA\u5931\u8D25\uFF1A{message}", { message: String(error) })}`);
    }
  }
};

// src/types.ts
var DEFAULT_STORE_PATH = "SettingProfiles";
var DEFAULT_CONFIG = {
  storePath: DEFAULT_STORE_PATH,
  language: "auto",
  deviceName: "",
  preferredRole: "ask",
  lastRoleState: ""
};
function mergeConfig(saved) {
  const source = saved != null ? saved : {};
  return {
    storePath: typeof source.storePath === "string" && source.storePath.trim() !== "" ? source.storePath : DEFAULT_STORE_PATH,
    language: source.language === "zh" || source.language === "en" ? source.language : "auto",
    deviceName: typeof source.deviceName === "string" ? source.deviceName : "",
    preferredRole: source.preferredRole === "apply" ? "apply" : "ask",
    lastRoleState: typeof source.lastRoleState === "string" ? source.lastRoleState : ""
  };
}

// src/main.ts
var ConfigProfilePlugin = class extends import_obsidian10.Plugin {
  constructor() {
    super(...arguments);
    this.config = DEFAULT_CONFIG;
    /** 本会话的角色判定结果（每次启动与写池操作前重新计算） */
    this.currentRole = { kind: "fresh" };
  }
  /** obsidian.d.ts 1.8.7 未声明 App.locale（运行时存在），收口在这一个转换里（qj 同款） */
  localeOf(app) {
    return app == null ? void 0 : app.locale;
  }
  applyLanguage() {
    setLanguage(this.config.language, () => this.localeOf(this.app));
  }
  effectiveDeviceName() {
    return this.config.deviceName !== "" ? this.config.deviceName : this.store.isMobile ? t("\u624B\u673A") : t("PC");
  }
  paths() {
    return storePaths(this.config.storePath);
  }
  async onload() {
    this.config = mergeConfig(await this.loadData());
    this.applyLanguage();
    this.store = new ConfigAdapter(this.app);
    this.addSettingTab(new CPSettingTab(this.app, this));
    this.app.workspace.onLayoutReady(() => {
      void this.initRole().then(() => this.registerCommands());
    });
  }
  async saveConfig() {
    await this.saveData(this.config);
  }
  // ── 角色判定（SPEC §3.1） ──
  async initRole() {
    const decision = await this.computeRole();
    this.currentRole = {
      kind: decision.kind,
      holderName: decision.kind === "apply" ? decision.holderName : void 0
    };
    if (decision.kind === "fresh") {
      if (this.config.preferredRole === "apply") {
        await this.saveRoleState("apply:preferred");
        return;
      }
      new FirstRunModal(this.app, (choice) => void this.applyFirstRunChoice(choice)).open();
      return;
    }
    if (this.config.lastRoleState !== roleStateKey(decision)) {
      this.noticeFor(decision);
      await this.saveRoleState(roleStateKey(decision));
    }
  }
  /** 全量重算：lock 原文（读失败按损坏）+ 池内容 → decideRole（纯函数） */
  async computeRole() {
    const paths = this.paths();
    let raw = null;
    try {
      raw = await this.store.readLockRaw(paths);
    } catch (e) {
      raw = "";
    }
    let poolHasContent = false;
    try {
      poolHasContent = await this.store.poolHasContent(paths);
    } catch (e) {
      poolHasContent = false;
    }
    return decideRole({ lock: parseLock(raw), poolHasContent, localDeviceId: this.store.deviceId() });
  }
  async applyFirstRunChoice(choice) {
    if (choice === "master") {
      await this.claimMaster();
      return;
    }
    this.config.preferredRole = "apply";
    this.currentRole = { kind: "apply" };
    await this.saveConfig();
    new import_obsidian10.Notice(t("\u672C\u673A\u5DF2\u8BBE\u4E3A\u5E94\u7528\u914D\u7F6E\u3002"));
  }
  /** 夺取主配置（首次选择与设置页按钮共用） */
  async claimMaster() {
    const paths = this.paths();
    await this.store.writeLock(paths, this.store.buildLock(this.effectiveDeviceName()));
    this.currentRole = { kind: "master" };
    new import_obsidian10.Notice(t("\u672C\u673A\u5DF2\u8BBE\u4E3A\u4E3B\u914D\u7F6E\u3002"));
    await this.saveRoleState("master");
  }
  /** 让出主配置 */
  async releaseMaster() {
    const paths = this.paths();
    await this.store.deleteLock(paths);
    this.currentRole = { kind: "apply" };
    new import_obsidian10.Notice(t("\u5DF2\u8BA9\u51FA\u4E3B\u914D\u7F6E\u3002"));
    await this.saveRoleState("apply:pool-without-lock");
  }
  async saveRoleState(stateKey) {
    this.config.lastRoleState = stateKey;
    await this.saveConfig();
  }
  noticeFor(decision) {
    var _a;
    if (decision.kind === "master") {
      new import_obsidian10.Notice(t("\u672C\u673A\u5DF2\u8BBE\u4E3A\u4E3B\u914D\u7F6E\u3002"));
      return;
    }
    if (decision.kind === "fresh") return;
    switch (decision.reason) {
      case "other-device":
        new import_obsidian10.Notice(
          t(
            "\u68C0\u6D4B\u5230\u4E3B\u914D\u7F6E\u6765\u81EA\u8BBE\u5907\u300A{name}\u300B\uFF0C\u672C\u673A\u5DF2\u8BBE\u4E3A\u5E94\u7528\u914D\u7F6E\u3002\u82E5\u4E3B\u914D\u7F6E\u5176\u5B9E\u5C5E\u4E8E\u672C\u673A\uFF08\u91CD\u88C5\u6216\u6E05\u9664\u6570\u636E\u540E\u8EAB\u4EFD\u4E22\u5931\uFF09\uFF0C\u8BF7\u5728\u8BBE\u7F6E\u4E2D\u91CD\u65B0\u593A\u53D6\u3002",
            { name: (_a = decision.holderName) != null ? _a : "" }
          )
        );
        break;
      case "lock-corrupt":
        new import_obsidian10.Notice(t("\u65E0\u6CD5\u786E\u8BA4\u4E3B\u914D\u7F6E\u5F52\u5C5E\uFF08lock \u6587\u4EF6\u635F\u574F\uFF09\uFF0C\u672C\u673A\u6682\u6309\u5E94\u7528\u914D\u7F6E\u5904\u7406\u3002"));
        break;
      case "future-schema":
        new import_obsidian10.Notice(t("store \u7531\u66F4\u65B0\u7248\u672C\u7684 Config Profile \u5199\u5165\uFF0C\u672C\u673A\u6682\u6309\u5E94\u7528\u914D\u7F6E\u5904\u7406\u3002\u8BF7\u66F4\u65B0\u63D2\u4EF6\u3002"));
        break;
      case "pool-without-lock":
        new import_obsidian10.Notice(t("\u65E0\u6CD5\u786E\u8BA4\u4E3B\u914D\u7F6E\u5F52\u5C5E\uFF08\u914D\u7F6E\u6C60\u5B58\u5728\u4F46\u6CA1\u6709 lock\uFF0C\u53EF\u80FD\u540C\u6B65\u672A\u5B8C\u6210\uFF09\uFF0C\u672C\u673A\u6682\u6309\u5E94\u7528\u914D\u7F6E\u5904\u7406\u3002"));
        break;
    }
  }
  // ── 加密（SPEC §2.5） ──
  async readCryptoMeta() {
    const raw = await this.store.readIfExists(`${this.paths().root}/_crypto.json`);
    return raw === null ? null : parseCryptoMeta(raw);
  }
  /** store 是否已加密（有合法 _crypto.json） */
  async storeEncrypted() {
    return await this.readCryptoMeta() !== null;
  }
  /** 确保密码可用：未存则弹输入框并验证；验证失败返回 null（调用方中止） */
  async ensurePassword(meta) {
    let password = this.store.storePassword();
    if (password !== null && await verifyPassword(meta, password)) return password;
    password = await promptStorePassword(this.app);
    if (password === null || password === "") return null;
    if (!await verifyPassword(meta, password)) {
      new import_obsidian10.Notice(t("\u5BC6\u7801\u4E0D\u6B63\u786E\u3002"));
      this.store.setStorePassword(null);
      return null;
    }
    this.store.setStorePassword(password);
    return password;
  }
  /** 修改密码（仅主配置；设置页调用）：解密池内全部密文 → 新密码重加密重写 */
  async changeStorePassword(oldPassword, newPassword) {
    const meta = await this.readCryptoMeta();
    if (meta === null) throw new Error("store not encrypted");
    if (!await verifyPassword(meta, oldPassword)) throw new WrongStorePasswordError();
    const paths = this.paths();
    await this.store.writeAtomic(`${paths.root}/_crypto.json`, JSON.stringify(await createCryptoMeta(newPassword), null, "	"));
    await this.runSync(newPassword);
  }
  // ── 同步（SPEC §3.2，仅 PC + 仅主配置） ──
  async runSync(passwordOverride) {
    if (this.store.isMobile) {
      new import_obsidian10.Notice(t("\u624B\u673A\u7AEF\u53EA\u80FD\u5E94\u7528\u914D\u7F6E\uFF0C\u4E0D\u80FD\u540C\u6B65\u3002"));
      return;
    }
    const decision = await this.computeRole();
    if (decision.kind !== "master") {
      new import_obsidian10.Notice(t("\u672C\u673A\u4E0D\u662F\u4E3B\u914D\u7F6E\u8BBE\u5907\uFF0C\u4E0D\u80FD\u540C\u6B65\u3002\u53EF\u5728\u8BBE\u7F6E\u4E2D\u593A\u53D6\u4E3B\u914D\u7F6E\u3002"));
      return;
    }
    let password = passwordOverride != null ? passwordOverride : null;
    const meta = await this.readCryptoMeta();
    if (meta === null) {
      password = await promptNewStorePassword(this.app);
      if (password !== null) {
        await this.store.writeAtomic(
          `${this.paths().root}/_crypto.json`,
          JSON.stringify(await createCryptoMeta(password), null, "	")
        );
        this.store.setStorePassword(password);
      }
    } else if (passwordOverride === void 0) {
      password = await this.ensurePassword(meta);
      if (password === null) return;
    }
    const service = new SyncService(this.store, this.paths(), this.effectiveDeviceName());
    try {
      const report = await service.run(password);
      new import_obsidian10.Notice(
        t("\u540C\u6B65\u5B8C\u6210\uFF1A\u66F4\u65B0 {updated} \u9879\uFF0C\u8DF3\u8FC7 {skipped} \u9879\uFF0C\u6E05\u7406 {pruned} \u9879\u3002", {
          updated: report.updated,
          skipped: report.skipped,
          pruned: report.pruned
        }) + (report.mobileProjection ? t("\u5DF2\u66F4\u65B0\u79FB\u52A8\u6295\u5F71\u3002") : "")
      );
    } catch (error) {
      new import_obsidian10.Notice(t("\u540C\u6B65\u5931\u8D25\uFF1A{message}", { message: error instanceof Error ? error.message : String(error) }));
    }
  }
  // ── 应用（SPEC §3.3） ──
  async runApply(name, platform) {
    const paths = this.paths();
    const raw = await this.store.readIfExists(`${paths.profilesDir}/${profileFileName(name, platform)}`);
    if (raw === null) {
      new import_obsidian10.Notice(t("\u627E\u4E0D\u5230 profile\uFF1A{name}", { name }));
      return;
    }
    const parsed = parseProfile(raw);
    if (!parsed.ok) {
      new import_obsidian10.Notice(t("profile \u6587\u4EF6\u635F\u574F\uFF1A{name}", { name }));
      return;
    }
    let password = null;
    const meta = await this.readCryptoMeta();
    if (meta !== null) {
      password = await this.ensurePassword(meta);
      if (password === null) return;
    }
    const service = new ApplyService(this.store, paths);
    try {
      const report = await service.run(parsed.profile, password);
      if (report.applied.length === 0 && report.missingPlugins.length === 0 && report.desktopOnlySkipped.length === 0) {
        new import_obsidian10.Notice(t("profile \u91CC\u6CA1\u6709\u52FE\u9009\u4EFB\u4F55\u5185\u5BB9\uFF1A{name}", { name }));
        return;
      }
      new ApplyResultModal(this.app, name, report, () => this.store.reloadApp()).open();
    } catch (error) {
      if (error instanceof WrongStorePasswordError) {
        this.store.setStorePassword(null);
        new import_obsidian10.Notice(t("\u5BC6\u7801\u4E0D\u6B63\u786E\u3002"));
        return;
      }
      new import_obsidian10.Notice(t("\u5E94\u7528\u5931\u8D25\uFF1A{message}", { message: error instanceof Error ? error.message : String(error) }));
    }
  }
  // ── profile CRUD（设置页与编辑弹窗共用） ──
  async listProfiles() {
    const files = await this.store.listFileNames(`${this.paths().profilesDir}`);
    const out = [];
    for (const file of files) {
      const entry = profileFromFileName(file);
      if (entry) out.push(entry);
    }
    return out;
  }
  async readProfile(name, platform) {
    const raw = await this.store.readIfExists(`${this.paths().profilesDir}/${profileFileName(name, platform)}`);
    if (raw === null) return null;
    const parsed = parseProfile(raw);
    return parsed.ok ? parsed.profile : null;
  }
  async writeProfile(doc) {
    doc.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    await this.store.mkdir(`${this.paths().profilesDir}`);
    await this.store.writeAtomic(
      `${this.paths().profilesDir}/${profileFileName(doc.name, doc.platform)}`,
      serializeProfile(doc)
    );
  }
  async createProfile(name, adaptMobile) {
    const normalized = normalizeProfileName(name);
    if (!isValidProfileName(name)) {
      new import_obsidian10.Notice(t("\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A\uFF0C\u4E14\u4E0D\u80FD\u5305\u542B / \u6216 \\\u3002"));
      return false;
    }
    const existing = await this.listProfiles();
    if (existing.some((entry) => entry.name === normalized)) {
      new import_obsidian10.Notice(t("\u540C\u540D profile \u5DF2\u5B58\u5728\uFF1A{name}", { name: normalized }));
      return false;
    }
    await this.writeProfile(emptyProfile(normalized, "desktop"));
    if (adaptMobile) {
      await this.writeProfile(emptyProfile(normalized, "mobile"));
    }
    new import_obsidian10.Notice(t("\u5DF2\u521B\u5EFA profile\u3002\u91CD\u8F7D\u63D2\u4EF6\u540E\u65B0\u547D\u4EE4\u751F\u6548\u3002"));
    return true;
  }
  async deleteProfile(name, platform) {
    await this.store.deletePath(`${this.paths().profilesDir}/${profileFileName(name, platform)}`);
  }
  async renameProfile(from, to) {
    const normalized = normalizeProfileName(to);
    if (!isValidProfileName(to)) {
      new import_obsidian10.Notice(t("\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A\uFF0C\u4E14\u4E0D\u80FD\u5305\u542B / \u6216 \\\u3002"));
      return false;
    }
    if (normalized === from) return true;
    const existing = await this.listProfiles();
    if (existing.some((entry) => entry.name === normalized)) {
      new import_obsidian10.Notice(t("\u540C\u540D profile \u5DF2\u5B58\u5728\uFF1A{name}", { name: normalized }));
      return false;
    }
    const paths = this.paths();
    await this.store.renamePath(
      `${paths.profilesDir}/${profileFileName(from, "desktop")}`,
      `${paths.profilesDir}/${profileFileName(normalized, "desktop")}`
    );
    const mobile = await this.readProfile(from, "mobile");
    if (mobile !== null) {
      await this.store.renamePath(
        `${paths.profilesDir}/${profileFileName(from, "mobile")}`,
        `${paths.profilesDir}/${profileFileName(normalized, "mobile")}`
      );
      mobile.name = normalized;
      mobile.adaptedFrom = normalized;
      await this.writeProfile(mobile);
    }
    const desktop = await this.readProfile(normalized, "desktop");
    if (desktop !== null) {
      desktop.name = normalized;
      await this.writeProfile(desktop);
    }
    return true;
  }
  /** 桌面 profile 的「适配手机」开关（SPEC §3.4）：开 = 生成/更新同名 mobile 派生 */
  async setMobileAdaptation(name, enabled) {
    if (!enabled) {
      await this.store.deletePath(`${this.paths().profilesDir}/${profileFileName(name, "mobile")}`);
      return;
    }
    const desktop = await this.readProfile(name, "desktop");
    if (desktop === null) return;
    const installed = await this.store.listInstalledPlugins();
    const desktopOnly = new Set(installed.filter((p) => p.isDesktopOnly).map((p) => p.id));
    await this.writeProfile(buildMobileProfile(desktop, desktopOnly));
  }
  /** profile 编辑器数据（本机 + 池内并集） */
  async profileEditorData(platform) {
    const installed = await this.store.listInstalledPlugins();
    const pool = this.paths();
    const poolIds = await this.store.listPoolPluginIds(
      platform === "mobile" ? pool.mobilePool : pool.pcPool
    );
    const merged = /* @__PURE__ */ new Map();
    for (const plugin of installed) merged.set(plugin.id, plugin);
    for (const id of poolIds) {
      if (!merged.has(id)) merged.set(id, { id, name: id, isDesktopOnly: false });
    }
    const snippets = /* @__PURE__ */ new Set([
      ...await this.store.listFileNames(this.store.obsidianPath("snippets")),
      ...await this.store.listFileNames(
        `${(platform === "mobile" ? pool.mobilePool : pool.pcPool).snippets}`
      )
    ]);
    const themes = /* @__PURE__ */ new Set([
      ...await this.store.listFileNames(this.store.obsidianPath("themes")),
      ...await this.store.listFileNames(
        `${(platform === "mobile" ? pool.mobilePool : pool.pcPool).themes}`
      )
    ]);
    return {
      plugins: [...merged.values()],
      snippets: [...snippets],
      themes: [...themes]
    };
  }
  // ── 命令注册（SPEC §5） ──
  registerCommands() {
    if (!this.store.isMobile) {
      this.addCommand({
        id: "sync-local-config",
        name: t("\u540C\u6B65\u672C\u5730\u914D\u7F6E"),
        callback: () => void this.runSync()
      });
    }
    void this.listProfiles().then((profiles) => {
      for (const entry of profiles) {
        if (entry.platform === "mobile" || !this.store.isMobile) {
          this.addCommand({
            id: `apply-${entry.platform}-${entry.name}`,
            name: t("\u5E94\u7528\u914D\u7F6E\uFF1A{name}", { name: displayName(entry.name, entry.platform) }),
            callback: () => void this.runApply(entry.name, entry.platform)
          });
        }
        if (!this.store.isMobile) {
          this.addCommand({
            id: `edit-${entry.platform}-${entry.name}`,
            name: t("\u67E5\u770B/\u7F16\u8F91\u914D\u7F6E\uFF1A{name}", { name: displayName(entry.name, entry.platform) }),
            callback: () => void this.openProfileEditor(entry.name, entry.platform)
          });
        }
      }
    });
  }
  async openProfileEditor(name, platform) {
    const doc = await this.readProfile(name, platform);
    if (doc === null) {
      new import_obsidian10.Notice(t("\u627E\u4E0D\u5230 profile\uFF1A{name}", { name }));
      return;
    }
    const data = await this.profileEditorData(platform);
    const { ProfileEditModal: ProfileEditModal2 } = await Promise.resolve().then(() => (init_profile_edit(), profile_edit_exports));
    new ProfileEditModal2(this, globalThis.structuredClone(doc), data).open();
  }
  /** 编辑器落盘回调（设置页小节与 Modal 共用） */
  async onProfileEdited(doc) {
    await this.writeProfile(doc);
    if (doc.platform === "desktop") {
      const twin = await this.readProfile(doc.name, "mobile");
      if (twin !== null) await this.setMobileAdaptation(doc.name, true);
    }
  }
};
function displayName(name, platform) {
  return platform === "mobile" ? t("{name}\uFF08\u624B\u673A\uFF09", { name }) : name;
}
