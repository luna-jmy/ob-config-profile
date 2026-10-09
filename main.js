/* Config Profile — bundled 2026-10-09T10:02:12.107Z */
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ConfigProfilePlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian5 = require("obsidian");

// src/i18n/en.ts
var EN = {
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
  "\u53D6\u6D88": "Cancel"
};

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
var currentSetting = "auto";
var localeProvider = () => void 0;
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

// src/services/config-adapter.ts
var import_obsidian = require("obsidian");
var DEVICE_ID_KEY = "cp-device-id";
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
  get adapter() {
    return this.app.vault.adapter;
  }
  n(path) {
    return (0, import_obsidian.normalizePath)(path);
  }
  /** lock 原文：文件不存在 → null；存在但读失败 → 抛出（调用方按 corrupt 处理） */
  async readLockRaw(paths) {
    const p = this.n(lockPath(paths));
    if (!await this.adapter.exists(p)) return null;
    return this.adapter.read(p);
  }
  /** 写入主配置 lock（夺取主配置 / 首次选择主配置时调用） */
  async writeLock(paths, lock) {
    await this.adapter.mkdir(this.n(paths.pcPool.base));
    await this.adapter.write(this.n(lockPath(paths)), JSON.stringify(lock, null, "	"));
  }
  /** 删除 lock（让出主配置） */
  async deleteLock(paths) {
    await this.adapter.rmdir(this.n(lockPath(paths)), true);
  }
  /** 组装一份 lock 内容（写盘前调用方只管名字，id / 时间戳 / schema 在这里保证） */
  buildLock(deviceName) {
    return {
      deviceId: this.deviceId(),
      deviceName,
      claimedAt: (/* @__PURE__ */ new Date()).toISOString(),
      schema: LOCK_SCHEMA
    };
  }
  /**
   * 两个池 + profiles 目录 + store 根级文件里是否有任何内容。
   * 用于「有池无 lock」的同步时差识别（SPEC §3.1 fail-safe）。
   */
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
};

// src/modals/first-run-modal.ts
var import_obsidian2 = require("obsidian");
var FirstRunModal = class extends import_obsidian2.Modal {
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
    const apply = new import_obsidian2.ButtonComponent(choices).setButtonText(t("\u672C\u673A\u4E3A\u5E94\u7528\u914D\u7F6E")).onClick(() => this.answer("apply"));
    apply.buttonEl.addClass("cp-first-run__option");
    apply.setCta();
    const master = new import_obsidian2.ButtonComponent(choices).setButtonText(t("\u672C\u673A\u4E3A\u4E3B\u914D\u7F6E\uFF08\u540C\u6B65\u672C\u673A\u914D\u7F6E\u5230 store\uFF09")).onClick(() => this.answer("master"));
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

// src/settings.ts
var import_obsidian4 = require("obsidian");

// src/modals/confirm.ts
var import_obsidian3 = require("obsidian");
var ConfirmModal = class extends import_obsidian3.Modal {
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
    new import_obsidian3.ButtonComponent(buttons).setButtonText(this.options.cancelLabel).onClick(() => this.close());
    const accept = new import_obsidian3.ButtonComponent(buttons).setButtonText(this.options.acceptLabel).onClick(() => {
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

// src/settings.ts
var CPSettingTab = class extends import_obsidian4.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    this.renderGeneral(containerEl);
    this.renderRole(containerEl);
  }
  renderGeneral(container) {
    new import_obsidian4.Setting(container).setName(t("\u901A\u7528")).setHeading();
    new import_obsidian4.Setting(container).setName(t("\u914D\u7F6E\u5E93\u8DEF\u5F84")).setDesc(t("store \u5728 vault \u5185\u7684\u8DEF\u5F84\uFF08\u9ED8\u8BA4 SettingProfiles\uFF0Cvault \u6839\uFF09\u3002\u4FEE\u6539\u540E\u91CD\u8F7D\u63D2\u4EF6\u751F\u6548\u3002")).addText(
      (text) => text.setPlaceholder("SettingProfiles").setValue(this.plugin.config.storePath).onChange(async (value) => {
        this.plugin.config.storePath = value;
        await this.plugin.saveConfig();
      })
    );
    new import_obsidian4.Setting(container).setName(t("\u8BBE\u5907\u540D")).setDesc(t("\u663E\u793A\u5728\u4E3B\u914D\u7F6E\u5F52\u5C5E\u63D0\u793A\u91CC\uFF0C\u5E2E\u52A9\u8BC6\u522B\u54EA\u53F0\u8BBE\u5907\u6301\u6709\u4E3B\u914D\u7F6E\u3002")).addText(
      (text) => text.setPlaceholder(this.plugin.effectiveDeviceName()).setValue(this.plugin.config.deviceName).onChange(async (value) => {
        this.plugin.config.deviceName = value;
        await this.plugin.saveConfig();
      })
    );
    new import_obsidian4.Setting(container).setName(t("\u8BED\u8A00")).addDropdown(
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
    new import_obsidian4.Setting(container).setName(t("\u89D2\u8272")).setHeading();
    const role = this.plugin.currentRole;
    const roleName = role.kind === "master" ? t("\u4E3B\u914D\u7F6E") : role.kind === "apply" ? t("\u5E94\u7528\u914D\u7F6E") : t("\u5C1A\u672A\u8BBE\u5B9A");
    const holderDesc = role.kind === "apply" && role.reason === "other-device" && role.holderName ? t("\u4E3B\u914D\u7F6E\u6301\u6709\u8005\uFF1A{name}", { name: role.holderName }) : "";
    new import_obsidian4.Setting(container).setName(t("\u5F53\u524D\u89D2\u8272")).setDesc(holderDesc).then((s) => {
      s.controlEl.createSpan({ text: roleName });
    });
    if (role.kind === "master") {
      new import_obsidian4.Setting(container).setName(t("\u8BA9\u51FA\u4E3B\u914D\u7F6E")).then((s) => s.addButton((btn) => btn.setButtonText(t("\u8BA9\u51FA\u4E3B\u914D\u7F6E")).onClick(() => void this.releaseMaster(s))));
    } else {
      new import_obsidian4.Setting(container).setName(t("\u593A\u53D6\u4E3B\u914D\u7F6E")).then((s) => s.addButton((btn) => btn.setButtonText(t("\u593A\u53D6\u4E3B\u914D\u7F6E")).onClick(() => void this.claimMaster(s))));
    }
  }
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
var ConfigProfilePlugin = class extends import_obsidian5.Plugin {
  constructor() {
    super(...arguments);
    this.config = DEFAULT_CONFIG;
    /** 本会话的角色判定结果（设置页展示用；每次启动与写池操作前重新计算） */
    this.currentRole = { kind: "fresh" };
  }
  /** obsidian.d.ts 1.8.7 未声明 App.locale（运行时存在），收口在这一个转换里（qj 同款） */
  localeOf(app) {
    return app == null ? void 0 : app.locale;
  }
  applyLanguage() {
    setLanguage(this.config.language, () => this.localeOf(this.app));
  }
  /** 设备显示名：未设置时按平台给默认值 */
  effectiveDeviceName() {
    return this.config.deviceName !== "" ? this.config.deviceName : this.store.isMobile ? t("\u624B\u673A") : t("PC");
  }
  async onload() {
    this.config = mergeConfig(await this.loadData());
    this.applyLanguage();
    this.store = new ConfigAdapter(this.app);
    this.addSettingTab(new CPSettingTab(this.app, this));
    this.app.workspace.onLayoutReady(() => {
      void this.initRole();
    });
  }
  async saveConfig() {
    await this.saveData(this.config);
  }
  /** 重算角色判定并给出提示；fresh 场景弹选择框（preferredRole=apply 时静默） */
  async initRole() {
    const decision = await this.computeRole();
    this.currentRole = decision;
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
    const paths = storePaths(this.config.storePath);
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
    return decideRole({
      lock: parseLock(raw),
      poolHasContent,
      localDeviceId: this.store.deviceId()
    });
  }
  async applyFirstRunChoice(choice) {
    if (choice === "master") {
      await this.claimMaster();
      return;
    }
    this.config.preferredRole = "apply";
    this.currentRole = { kind: "apply", reason: "pool-without-lock" };
    await this.saveConfig();
    new import_obsidian5.Notice(t("\u672C\u673A\u5DF2\u8BBE\u4E3A\u5E94\u7528\u914D\u7F6E\u3002"));
  }
  /** 夺取主配置（首次选择「主配置」与设置页按钮共用）：写 lock，更新角色 */
  async claimMaster() {
    const paths = storePaths(this.config.storePath);
    await this.store.writeLock(paths, this.store.buildLock(this.effectiveDeviceName()));
    this.currentRole = { kind: "master" };
    new import_obsidian5.Notice(t("\u672C\u673A\u5DF2\u8BBE\u4E3A\u4E3B\u914D\u7F6E\u3002"));
    await this.saveRoleState("master");
  }
  /** 让出主配置：删 lock；此后所有设备（含本机）按「有池无 lock」兜底为应用配置 */
  async releaseMaster() {
    const paths = storePaths(this.config.storePath);
    await this.store.deleteLock(paths);
    this.currentRole = { kind: "apply", reason: "pool-without-lock" };
    new import_obsidian5.Notice(t("\u5DF2\u8BA9\u51FA\u4E3B\u914D\u7F6E\u3002"));
    await this.saveRoleState(roleStateKey(this.currentRole));
  }
  async saveRoleState(stateKey) {
    this.config.lastRoleState = stateKey;
    await this.saveConfig();
  }
  noticeFor(decision) {
    var _a;
    if (decision.kind === "master") {
      new import_obsidian5.Notice(t("\u672C\u673A\u5DF2\u8BBE\u4E3A\u4E3B\u914D\u7F6E\u3002"));
      return;
    }
    if (decision.kind === "fresh") return;
    switch (decision.reason) {
      case "other-device":
        new import_obsidian5.Notice(
          t(
            "\u68C0\u6D4B\u5230\u4E3B\u914D\u7F6E\u6765\u81EA\u8BBE\u5907\u300A{name}\u300B\uFF0C\u672C\u673A\u5DF2\u8BBE\u4E3A\u5E94\u7528\u914D\u7F6E\u3002\u82E5\u4E3B\u914D\u7F6E\u5176\u5B9E\u5C5E\u4E8E\u672C\u673A\uFF08\u91CD\u88C5\u6216\u6E05\u9664\u6570\u636E\u540E\u8EAB\u4EFD\u4E22\u5931\uFF09\uFF0C\u8BF7\u5728\u8BBE\u7F6E\u4E2D\u91CD\u65B0\u593A\u53D6\u3002",
            { name: (_a = decision.holderName) != null ? _a : "" }
          )
        );
        break;
      case "lock-corrupt":
        new import_obsidian5.Notice(t("\u65E0\u6CD5\u786E\u8BA4\u4E3B\u914D\u7F6E\u5F52\u5C5E\uFF08lock \u6587\u4EF6\u635F\u574F\uFF09\uFF0C\u672C\u673A\u6682\u6309\u5E94\u7528\u914D\u7F6E\u5904\u7406\u3002"));
        break;
      case "future-schema":
        new import_obsidian5.Notice(t("store \u7531\u66F4\u65B0\u7248\u672C\u7684 Config Profile \u5199\u5165\uFF0C\u672C\u673A\u6682\u6309\u5E94\u7528\u914D\u7F6E\u5904\u7406\u3002\u8BF7\u66F4\u65B0\u63D2\u4EF6\u3002"));
        break;
      case "pool-without-lock":
        new import_obsidian5.Notice(t("\u65E0\u6CD5\u786E\u8BA4\u4E3B\u914D\u7F6E\u5F52\u5C5E\uFF08\u914D\u7F6E\u6C60\u5B58\u5728\u4F46\u6CA1\u6709 lock\uFF0C\u53EF\u80FD\u540C\u6B65\u672A\u5B8C\u6210\uFF09\uFF0C\u672C\u673A\u6682\u6309\u5E94\u7528\u914D\u7F6E\u5904\u7406\u3002"));
        break;
    }
  }
};
