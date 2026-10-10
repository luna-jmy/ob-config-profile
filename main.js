/* Config Profile — bundled 2026-10-10T08:46:13.739Z */
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
var import_obsidian11 = require("obsidian");

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

// src/i18n/en.ts
var EN = {
  // ── 角色名 ──
  "\u540C\u6B65\u8BBE\u5907": "Sync device",
  "\u4EC5\u5E94\u7528": "Apply-only",
  "\u624B\u673A": "Mobile",
  "PC": "PC",
  "\u5C1A\u672A\u8BBE\u5B9A": "Not set yet",
  // ── 首次运行弹窗 ──
  "\u9009\u62E9\u672C\u673A\u89D2\u8272": "Choose this device's role",
  "\u672C\u673A\u662F\u300C\u540C\u6B65\u8BBE\u5907\u300D\uFF08\u628A\u672C\u673A Obsidian \u914D\u7F6E\u4E0E\u914D\u7F6E\u5E93\u53CC\u5411\u540C\u6B65\uFF0C\u53EF\u591A\u53F0\u540C\u65F6\u5F00\u542F\uFF09\uFF0C\u8FD8\u662F\u300C\u4EC5\u5E94\u7528\u300D\uFF08\u53EA\u5E94\u7528\u914D\u7F6E\u5E93\u540C\u6B65\u6765\u7684\u914D\u7F6E\uFF09\uFF1F": "Is this device a sync device (two-way sync between this machine's Obsidian settings and the store; multiple devices can sync at once) or apply-only (only applies settings synced from the store)?",
  "\u672C\u673A\u4E3A\u540C\u6B65\u8BBE\u5907\uFF08\u4E0E\u914D\u7F6E\u5E93\u53CC\u5411\u540C\u6B65\uFF09": "This device is a sync device (two-way sync with the store)",
  "\u672C\u673A\u4E3A\u4EC5\u5E94\u7528": "This device is apply-only",
  "\u4E0D\u786E\u5B9A\u5C31\u9009\u4EC5\u5E94\u7528\u2014\u2014\u4EC5\u5E94\u7528\u4E0D\u4F1A\u5199\u5165\u914D\u7F6E\u5E93\uFF0C\u968F\u65F6\u53EF\u4EE5\u5728\u8BBE\u7F6E\u91CC\u6539\u3002": "When in doubt choose apply-only \u2014 it never writes to the store, and you can change the role anytime in settings.",
  // ── 角色 Notice ──
  "\u672C\u673A\u5DF2\u8BBE\u4E3A\u540C\u6B65\u8BBE\u5907\u3002": "This device is now a sync device.",
  "\u672C\u673A\u5DF2\u8BBE\u4E3A\u4EC5\u5E94\u7528\u3002": "This device is now apply-only.",
  // ── 设置页 ──
  "Config Profile": "Config Profile",
  "\u901A\u7528": "General",
  "\u89D2\u8272": "Role",
  "\u914D\u7F6E\u5E93\u8DEF\u5F84": "Store path",
  "store \u5728 vault \u5185\u7684\u8DEF\u5F84\uFF08\u9ED8\u8BA4 SettingProfiles\uFF0Cvault \u6839\uFF09\u3002\u4FEE\u6539\u540E\u91CD\u8F7D\u63D2\u4EF6\u751F\u6548\u3002": "Path of the store inside the vault (default: SettingProfiles at the vault root). Reload the plugin after changing.",
  "\u8BBE\u5907\u540D": "Device name",
  "\u4EC5\u4F5C\u6765\u6E90\u6807\u6CE8\uFF1A\u663E\u793A\u5728\u540C\u6B65\u8BB0\u5F55\u4E0E\u51B2\u7A81\u63D0\u793A\u91CC\uFF0C\u8BF4\u660E\u914D\u7F6E\u6765\u81EA\u54EA\u53F0\u8BBE\u5907\uFF1B\u4E0D\u53C2\u4E0E\u540C\u6B65\u5339\u914D\u3002": "Provenance label only: shown in sync records and conflict prompts to tell which device a change came from; not used for matching.",
  "\u540C\u6B65\u63D2\u4EF6\u4E3B\u4F53": "Sync plugin artifacts",
  "\u628A\u63D2\u4EF6\u7684 main.js / styles.css / manifest.json \u4E00\u5E76\u660E\u6587\u540C\u6B65\uFF08\u4E0D\u52A0\u5BC6\uFF09\u3002\u5F00\u542F\u540E\u5E94\u7528\u7AEF\u53EF\u76F4\u63A5\u88C5\u9F50\u7F3A\u5931\u63D2\u4EF6\uFF1B\u4E0B\u6B21\u540C\u6B65\u751F\u6548\u3002": "Also sync plugins' main.js / styles.css / manifest.json in plain text (unencrypted). Apply-side devices can then install missing plugins directly; takes effect on the next sync.",
  "\u5F00\u542F\u540E\u5E94\u7528\u65F6\u628A\u6C60\u91CC\u7684\u63D2\u4EF6\u4E3B\u4F53\uFF08main.js / styles.css / manifest.json\uFF09\u8FDE\u540C\u914D\u7F6E\u4E00\u8D77\u5199\u5165\uFF0C\u672A\u5B89\u88C5\u7684\u63D2\u4EF6\u76F4\u63A5\u88C5\u9F50\uFF0C\u91CD\u8F7D\u540E\u751F\u6548\uFF1B\u5173\u95ED\u5219\u53EA\u5E94\u7528\u914D\u7F6E\uFF0C\u672A\u5B89\u88C5\u7684\u63D2\u4EF6\u8DF3\u8FC7\u3002": "When on, applying also writes plugin bodies (main.js / styles.css / manifest.json) from the store, installing missing plugins directly (effective after reload); when off, only settings are applied and uninstalled plugins are skipped.",
  "\u4EE5\u4E0B\u63D2\u4EF6\u5DF2\u4ECE\u914D\u7F6E\u5E93\u88C5\u9F50\u4E3B\u4F53\uFF0C\u91CD\u8F7D\u540E\u751F\u6548\uFF1A": "These plugins were installed from the store; reload to take effect:",
  "\u8BED\u8A00": "Language",
  "\u8DDF\u968F Obsidian": "Follow Obsidian",
  "\u4E2D\u6587": "Chinese",
  "English": "English",
  "\u5F53\u524D\u89D2\u8272": "Current role",
  "\u540C\u6B65\u8BBE\u5907\u53EF\u4E0E\u914D\u7F6E\u5E93\u53CC\u5411\u540C\u6B65\uFF08\u591A\u53F0\u53EF\u540C\u65F6\u5F00\u542F\uFF09\uFF1B\u4EC5\u5E94\u7528\u53EA\u8986\u76D6\u672C\u673A\uFF0C\u4E0D\u5199\u914D\u7F6E\u5E93\u3002": "A sync device syncs both ways with the store (several can be enabled at once); apply-only only overwrites this machine and never writes to the store.",
  "\u5207\u6362\u89D2\u8272": "Switch role",
  "\u5207\u6362\u540E\u7ACB\u5373\u751F\u6548\uFF0C\u65E0\u9700\u91CD\u8F7D\u3002": "Takes effect immediately \u2014 no reload needed.",
  "\u5F00 = \u540C\u6B65\u8BBE\u5907\uFF0C\u5173 = \u4EC5\u5E94\u7528": "On = sync device, off = apply-only",
  "\u53D6\u6D88": "Cancel",
  // ── 设置页：加密区 ──
  "\u52A0\u5BC6": "Encryption",
  "\u914D\u7F6E\u5E93\u52A0\u5BC6": "Store encryption",
  "store \u6574\u5E93\u52A0\u5BC6\uFF1B\u5BC6\u7801\u53EA\u5B58\u5404\u8BBE\u5907\u672C\u5730\uFF0C\u4E0D\u8FDB vault\u3002": "The whole store is encrypted; the password stays on each device, never in the vault.",
  "\u4FEE\u6539\u5BC6\u7801": "Change password",
  "\u6C60\u5185\u5168\u90E8\u5BC6\u6587\u4F1A\u4EE5\u65B0\u5BC6\u7801\u91CD\u65B0\u52A0\u5BC6\u91CD\u5199\u3002": "Every encrypted entry will be re-encrypted and rewritten with the new password.",
  "\u5C1A\u672A\u52A0\u5BC6\u3002\u4E0B\u6B21\u540C\u6B65\u65F6\u53EF\u8BBE\u7F6E\u5BC6\u7801\uFF0Cstore \u5C06\u6574\u5E93\u52A0\u5BC6\u3002": "Not encrypted yet. Set a password on the next sync to encrypt the whole store.",
  "\u8BBE\u7F6E\u5BC6\u7801\u5E76\u7ACB\u5373\u91CD\u65B0\u540C\u6B65\uFF08\u6574\u5E93\u52A0\u5BC6\uFF09\u3002": "Set a password and re-sync immediately (whole-store encryption).",
  "\u5BC6\u7801\u5DF2\u4FEE\u6539\uFF0C\u6C60\u5185\u5BC6\u6587\u5DF2\u91CD\u5199\u3002": "Password changed; encrypted entries rewritten.",
  "\u5F55\u5165\u540C\u6B65\u5BC6\u7801": "Enter sync password",
  "\u8F93\u5165\u540C\u6B65\u8BBE\u5907\u8BBE\u7F6E\u7684\u5BC6\u7801\u4EE5\u89E3\u5BC6\u914D\u7F6E\u5E93\uFF1B\u9A8C\u8BC1\u901A\u8FC7\u540E\u672C\u673A\u8BB0\u4F4F\uFF08\u53EA\u5B58\u672C\u673A\uFF0C\u4E0D\u8FDB vault\uFF09\u3002": "Enter the password set on a sync device to decrypt the store; once verified it is remembered on this device only (never in the vault).",
  "\u914D\u7F6E\u5E93\u672A\u52A0\u5BC6\uFF0C\u65E0\u9700\u5BC6\u7801\u3002": "The store is not encrypted; no password is needed.",
  "\u672A\u627E\u5230\u914D\u7F6E\u5E93\uFF08{path}\uFF09\u3002\u8BF7\u786E\u8BA4\u914D\u7F6E\u5E93\u5DF2\u968F\u7B14\u8BB0\u540C\u6B65\u5230\u672C\u673A\uFF0C\u4E14\u8DEF\u5F84\u4E0E\u540C\u6B65\u8BBE\u5907\u4E00\u81F4\u3002": "Store not found ({path}). Make sure the store has reached this device with your notes and the path matches the sync device.",
  "\u5BC6\u7801\u5DF2\u9A8C\u8BC1\u5E76\u8BB0\u4F4F\uFF08\u53EA\u5B58\u672C\u673A\uFF09\u3002": "Password verified and saved (stored on this device only).",
  "\u4FEE\u6539\u5931\u8D25\uFF1A{message}": "Change failed: {message}",
  // ── 设置页：Profiles 区 ──
  "Profiles": "Profiles",
  "profile \u7BA1\u7406\u8BF7\u5230 PC \u7AEF\uFF08\u624B\u673A\u53EA\u5E94\u7528\u914D\u7F6E\uFF09\u3002": "Manage profiles on desktop (mobile only applies them).",
  "\u65B0\u5EFA profile": "New profile",
  "\u521B\u5EFA\u540E\u91CD\u8F7D\u63D2\u4EF6\uFF0C\u5E94\u7528\u547D\u4EE4\u5373\u53EF\u7528\u3002": "Reload the plugin after creating to register its apply command.",
  "\u65B0\u5EFA": "Create",
  "\u8FD8\u6CA1\u6709 profile\u3002\u65B0\u5EFA\u4E00\u4E2A\uFF0C\u6216\u5728\u4E00\u53F0\u540C\u6B65\u8BBE\u5907\u4E0A\u6267\u884C\u540C\u6B65\u3002": "No profiles yet. Create one, or run a sync on a sync device.",
  "\u5DF2\u5F00\u542F\u624B\u673A\u9002\u914D\uFF1A\u624B\u673A\u7AEF\u5E94\u7528\u300A{name}\uFF08\u624B\u673A\uFF09\u300B\u3002": 'Mobile adaptation on: phones apply "{name} (mobile)".',
  "\u672A\u5F00\u542F\u624B\u673A\u9002\u914D\u3002": "Mobile adaptation off.",
  "\u684C\u9762 profile \u5DF2\u4E0D\u5B58\u5728\u7684\u6D3E\u751F\u6B8B\u7559\uFF0C\u53EF\u5220\u9664\u3002": "Leftover mobile twin whose desktop profile is gone; safe to delete.",
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
  "\u300A{name}\u300B\u6709\u624B\u673A\u9002\u914D\u6D3E\u751F\uFF0C\u4E00\u5E76\u5220\u9664\uFF1F": '"{name}" has a mobile twin. Delete it as well?',
  "\u4E00\u5E76\u5220\u9664": "Delete both",
  "\u5220\u9664\u624B\u673A\u9002\u914D profile": "Delete mobile twin",
  "\u4EC5\u5220\u684C\u9762\u7248": "Desktop only",
  "\u6253\u5F00\u7F16\u8F91\u5668\u5931\u8D25\uFF1A{message}": "Failed to open the editor: {message}",
  "\u64CD\u4F5C\u5931\u8D25\uFF1A{message}": "Operation failed: {message}",
  // ── 命令 ──
  "\u540C\u6B65\u672C\u5730\u914D\u7F6E": "Sync local settings",
  "\u5E94\u7528\u914D\u7F6E\uFF1A{name}": "Apply profile: {name}",
  "\u67E5\u770B/\u7F16\u8F91\u914D\u7F6E\uFF1A{name}": "View/edit profile: {name}",
  "{name}\uFF08\u624B\u673A\uFF09": "{name} (mobile)",
  // ── 同步 Notice / 弹窗 ──
  "\u5BC6\u7801\u4E0D\u6B63\u786E\u3002": "Wrong password.",
  "\u624B\u673A\u7AEF\u53EA\u80FD\u5E94\u7528\u914D\u7F6E\uFF0C\u4E0D\u80FD\u540C\u6B65\u3002": "Mobile devices can only apply profiles, not sync.",
  "\u672C\u673A\u662F\u4EC5\u5E94\u7528\u8BBE\u5907\uFF0C\u4E0D\u80FD\u540C\u6B65\u3002\u53EF\u5728\u8BBE\u7F6E\u4E2D\u5207\u6362\u4E3A\u540C\u6B65\u8BBE\u5907\u3002": "This device is apply-only and cannot sync. Switch it to a sync device in settings.",
  "\u540C\u6B65\u5B8C\u6210\uFF1A\u63A8\u9001 {pushed} \u9879\uFF0C\u62C9\u53D6 {pulled} \u9879\uFF0C\u5220\u9664 {deleted} \u9879\u3002": "Sync finished: {pushed} pushed, {pulled} pulled, {deleted} deleted.",
  "\u51B2\u7A81\u5DF2\u6309\u672C\u673A\u89E3\u51B3\u3002": " Conflicts resolved with local versions.",
  "\u51B2\u7A81\u5DF2\u6309\u6C60\u89E3\u51B3\u3002": " Conflicts resolved with store versions.",
  "\u5DF2\u66F4\u65B0\u79FB\u52A8\u6295\u5F71\u3002": " Mobile projection updated.",
  "\u540C\u6B65\u5931\u8D25\uFF1A{message}": "Sync failed: {message}",
  "\u914D\u7F6E\u5E93\u7684\u65F6\u95F4\u6233\u6765\u81EA\u672A\u6765\uFF0C\u672C\u673A\u6216\u5BF9\u7AEF\u65F6\u949F\u53EF\u80FD\u4E0D\u51C6\u3002\u8BF7\u6821\u51C6\u7CFB\u7EDF\u65F6\u95F4\u540E\u91CD\u8BD5\u3002": "The store's timestamps are in the future; this device or a peer may have a wrong clock. Calibrate the system time and retry.",
  "\u9996\u6B21\u5728\u6B64\u8BBE\u5907\u540C\u6B65": "First sync on this device",
  "\u914D\u7F6E\u5E93\u5DF2\u6709\u5185\u5BB9\uFF0C\u4F46\u672C\u673A\u8FD8\u6CA1\u6709\u540C\u6B65\u8BB0\u5F55\u3002\u4EE5\u54EA\u8FB9\u4E3A\u51C6\uFF1F\u672C\u673A\u591A\u51FA\u7684\u6587\u4EF6\u4F1A\u4FDD\u7559\uFF0C\u4E0B\u6B21\u540C\u6B65\u518D\u4E0A\u4F20\u3002": "The store already has content, but this device has no sync record yet. Which side wins? Files that exist only locally are kept and uploaded on the next sync.",
  "\u76F4\u63A5\u5173\u95ED\u5F39\u7A97\u5373\u53D6\u6D88\u672C\u6B21\u540C\u6B65\u3002": "Closing this dialog cancels the sync.",
  "\u7528\u672C\u673A\u8986\u76D6\u6C60": "Overwrite store with local",
  "\u5148\u628A\u6C60\u5E94\u7528\u56DE\u672C\u673A": "Apply the store to this device first",
  "\u540C\u6B65\u51B2\u7A81": "Sync conflicts",
  "\u4EE5\u4E0B\u6587\u4EF6\u5728\u672C\u673A\u548C\u914D\u7F6E\u5E93\u90FD\u6539\u8FC7\uFF0C\u9700\u8981\u4F60\u51B3\u5B9A\u4FDD\u7559\u54EA\u8FB9\uFF08\u5BF9\u6240\u6709\u5217\u51FA\u7684\u6587\u4EF6\u751F\u6548\uFF09\uFF1A": "These files changed both locally and in the store; choose which side to keep (applies to all listed files):",
  "\u76F4\u63A5\u5173\u95ED\u5F39\u7A97\u5373\u53D6\u6D88\u672C\u6B21\u540C\u6B65\uFF0C\u4E24\u8FB9\u6539\u52A8\u90FD\u4FDD\u6301\u539F\u6837\u3002": "Closing this dialog cancels the sync; both sides stay as they are.",
  "\u4FDD\u7559\u672C\u673A\u7248\u672C": "Keep local versions",
  "\u4FDD\u7559\u914D\u7F6E\u5E93\u7248\u672C": "Keep store versions",
  // ── 应用 ──
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
  "\u8FD9\u4E2A\u914D\u7F6E\u5E93\u5DF2\u52A0\u5BC6\u3002\u8F93\u5165\u4E3B\u914D\u7F6E\u8BBE\u5907\u8BBE\u7F6E\u7684\u5BC6\u7801\u4EE5\u7EE7\u7EED\uFF0C\u9A8C\u8BC1\u901A\u8FC7\u540E\u672C\u673A\u8BB0\u4F4F\u5BC6\u7801\u3002": "This store is encrypted. Enter the password set on the sync device to continue; it will be remembered on this device after verification.",
  "\u786E\u8BA4": "OK",
  "\u4FEE\u6539\u914D\u7F6E\u5E93\u5BC6\u7801": "Change the store password",
  "\u6C60\u5185\u5168\u90E8\u5BC6\u6587\u4F1A\u4EE5\u65B0\u5BC6\u7801\u91CD\u65B0\u52A0\u5BC6\u5E76\u91CD\u5199\uFF0C\u5176\u4ED6\u8BBE\u5907\u4E0B\u6B21\u5E94\u7528\u65F6\u8F93\u5165\u65B0\u5BC6\u7801\u5373\u53EF\u3002": "Every encrypted entry will be re-encrypted with the new password; other devices just enter the new password on their next apply.",
  "\u5F53\u524D\u5BC6\u7801": "Current password",
  "\u5DF2\u81EA\u52A8\u586B\u5165\u672C\u673A\u8BB0\u4F4F\u7684\u5BC6\u7801\uFF08\u70B9\u773C\u775B\u56FE\u6807\u53EF\u67E5\u770B\uFF09\u3002": "Pre-filled with the password remembered on this device (click the eye to view).",
  "\u663E\u793A\u5BC6\u7801": "Show password",
  "\u9690\u85CF\u5BC6\u7801": "Hide password",
  "\u65B0\u5BC6\u7801": "New password",
  "\u518D\u8F93\u4E00\u6B21\u65B0\u5BC6\u7801": "Re-enter new password",
  "\u786E\u8BA4\u4FEE\u6539": "Apply change",
  // ── profile 编辑 ──
  "\u7F16\u8F91 profile\uFF1A{name}": "Edit profile: {name}",
  "\u7F16\u8F91 profile\uFF1A{name}\uFF08\u624B\u673A\uFF09": "Edit profile: {name} (mobile)",
  "\u52FE\u9009\u6539\u52A8\u5373\u65F6\u4FDD\u5B58\uFF0C\u65E0\u9700\u624B\u52A8\u786E\u8BA4\u3002": "Toggles save immediately \u2014 no confirmation needed.",
  "App \u8BBE\u7F6E": "App settings",
  "\u5DF2\u9009 {selected}/{total}": "Selected {selected}/{total}",
  "\u5168\u9009": "Select all",
  "\u6682\u65E0\u6761\u76EE": "Nothing here yet",
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
  "\u4E66\u7B7E": "Bookmarks"
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
    crypto: `${root}/crypto.json`,
    pcPool: poolPaths(root, "pcconfig"),
    mobilePool: poolPaths(root, "mobileconfig"),
    profilesDir: `${root}/profiles`
  };
}
function metaPath(pool) {
  return `${pool.base}/meta.json`;
}
function legacyCryptoPath(root) {
  return `${root}/_crypto.json`;
}
function legacyMetaPath(pool) {
  return `${pool.base}/_meta.json`;
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

// src/store/role.ts
function decideStartupRole(preferredRole) {
  if (preferredRole === "ask") return { kind: "ask" };
  return { kind: "role", role: preferredRole };
}

// src/store/items.ts
var SELF_PLUGIN_ID = "config-profile";
var INSTALL_ARTIFACTS = /* @__PURE__ */ new Set(["main.js", "styles.css", "manifest.json"]);
var APP_FILES = [
  { file: "app.json", label: "\u7F16\u8F91\u5668\u4E0E\u6587\u4EF6\u8BBE\u7F6E" },
  { file: "appearance.json", label: "\u5916\u89C2" },
  { file: "hotkeys.json", label: "\u5FEB\u6377\u952E" },
  { file: "core-plugins.json", label: "\u6838\u5FC3\u63D2\u4EF6\u5F00\u5173" },
  { file: "community-plugins.json", label: "\u793E\u533A\u63D2\u4EF6\u542F\u7528\u5217\u8868" },
  { file: "graph.json", label: "\u5173\u7CFB\u56FE\u8BBE\u7F6E" },
  { file: "bookmarks.json", label: "\u4E66\u7B7E" }
];
var MOBILE_ALLOWED_APP_FILES = ["core-plugins.json", "community-plugins.json"];
function isMobileAllowedAppFile(file) {
  return MOBILE_ALLOWED_APP_FILES.includes(file);
}
function isCarryablePluginFile(fileName) {
  return !INSTALL_ARTIFACTS.has(fileName);
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
  async run(profile, password, options = {}) {
    const installArtifacts = options.installArtifacts === true;
    const report = { applied: [], installedPlugins: [], missingPlugins: [], desktopOnlySkipped: [] };
    const base = this.poolBase(profile);
    const pluginIds = [...profile.plugins];
    if (this.adapter.isMobile) {
      for (const id of [...pluginIds]) {
        if (await this.isDesktopOnlyPlugin(base, id)) {
          pluginIds.splice(pluginIds.indexOf(id), 1);
          report.desktopOnlySkipped.push(id);
        }
      }
    }
    for (const file of profile.app) {
      const content = await this.readPoolEntry(`${base}/app/${file}`, password);
      if (content === null) continue;
      await this.adapter.obsidianWrite(file, content);
      report.applied.push(file);
    }
    const artifactFilter = (fileName) => !installArtifacts && INSTALL_ARTIFACTS.has(fileName);
    for (const id of pluginIds) {
      if (!await this.adapter.hasLocalPluginDir(id)) {
        const poolHasArtifacts = await this.adapter.readIfExists(`${base}/plugins/${id}/manifest.json`) !== null;
        if (!(installArtifacts && poolHasArtifacts)) {
          report.missingPlugins.push(id);
          continue;
        }
        report.installedPlugins.push(id);
      }
      const copied = await this.adapter.copyTree(
        `${base}/plugins/${id}`,
        this.adapter.obsidianPath(`plugins/${id}`),
        {
          excludeFileName: artifactFilter,
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
      if (content !== null) {
        await this.adapter.mkdir(this.adapter.obsidianPath("themes"));
        await this.adapter.obsidianWrite(`themes/${name}`, content);
        report.applied.push(`themes/${name}`);
        continue;
      }
      const copied = await this.adapter.copyTree(
        `${base}/themes/${name}`,
        this.adapter.obsidianPath(`themes/${name}`),
        { transform: (raw) => this.readPoolEntryFromContent(raw, password) }
      );
      if (copied.length > 0) report.applied.push(`themes/${name}`);
    }
    return report;
  }
  /** isDesktopOnly 判定（SPEC §3.3）：池内 manifest（明文产物）优先，其次本机已装 manifest */
  async isDesktopOnlyPlugin(base, id) {
    for (const source of [`${base}/plugins/${id}/manifest.json`, `plugins/${id}/manifest.json`]) {
      const raw = source.startsWith(base) ? await this.adapter.readIfExists(source) : await this.adapter.obsidianRead(source);
      if (raw === null) continue;
      try {
        const manifest = JSON.parse(raw);
        if (manifest.isDesktopOnly === true) return true;
        if (manifest.isDesktopOnly === false) return false;
      } catch (e) {
      }
    }
    return false;
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
var LEGACY_DEVICE_ID_KEY = "cp-device-id";
var STORE_PASSWORD_KEY = "cp-store-password";
var ConfigAdapter = class {
  constructor(app) {
    this.app = app;
  }
  /** 平台探测（SPEC §2.4：只读事实，不提供切换） */
  get isMobile() {
    return import_obsidian.Platform.isMobile;
  }
  /**
   * 旧版（≤0.0.3）存在 localStorage 的设备 id：只读迁移源，不写回。
   * 0.1.0 起 deviceId 存 data.json（清缓存不丢）；无旧值 → null，调用方生成新 id。
   */
  legacyDeviceId() {
    const value = this.app.loadLocalStorage(LEGACY_DEVICE_ID_KEY);
    return typeof value === "string" && value !== "" ? value : null;
  }
  // ── store 密码（SPEC §2.5：只存各设备本地） ──
  storePassword() {
    const value = this.app.loadLocalStorage(STORE_PASSWORD_KEY);
    return typeof value === "string" && value !== "" ? value : null;
  }
  setStorePassword(password) {
    this.app.saveLocalStorage(STORE_PASSWORD_KEY, password);
  }
  // ── store 结构探测 ──
  /** store 根目录是否存在于本机（设置页三态提示用：区分「没同步到」与「未加密」） */
  async storeDirExists(paths) {
    return this.adapter.exists(this.n(paths.root));
  }
  /** vault 相对路径是否存在（旧文件名迁移探测用） */
  async pathExists(path) {
    return this.adapter.exists(this.n(path));
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
  /** 插件目录内的相对文件路径（递归；目录不存在 → 空数组）。同步枚举插件文件用 */
  async listPluginFilesRel(id) {
    const root = this.n(`${this.configDir}/plugins/${id}`);
    if (!await this.adapter.exists(root)) return [];
    const out = [];
    const walk = async (dir) => {
      const listed = await this.adapter.list(this.n(dir));
      out.push(...listed.files.map((file) => file.slice(root.length + 1)));
      for (const folder of listed.folders) await walk(folder);
    };
    await walk(root);
    return out;
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
  /** 列目录直接子项名（文件与文件夹；目录不存在 → 空）——主题目录：松散 css 与文件夹主题并存 */
  async listChildNames(dir) {
    const p = this.n(dir);
    if (!await this.adapter.exists(p)) return { files: [], folders: [] };
    const listed = await this.adapter.list(p);
    return {
      files: listed.files.map((file) => {
        var _a;
        return (_a = file.split("/").pop()) != null ? _a : file;
      }),
      folders: listed.folders.map((folder) => {
        var _a;
        return (_a = folder.split("/").pop()) != null ? _a : folder;
      })
    };
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
    if (!await this.adapter.exists(p)) return;
    const stat = await this.adapter.stat(p);
    if ((stat == null ? void 0 : stat.type) === "file") await this.adapter.remove(p);
    else await this.adapter.rmdir(p, true);
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

// src/store/pool-meta.ts
var EMPTY_POOL_META = {
  schema: 2,
  syncedAt: "",
  encrypted: false,
  entries: {},
  devices: {}
};
function asRecord(value) {
  return typeof value === "object" && value !== null ? value : null;
}
function parseEntry(raw) {
  const rec = asRecord(raw);
  if (rec === null) return null;
  const fp = typeof rec.fp === "string" ? rec.fp : "";
  const ts = typeof rec.ts === "string" ? rec.ts : "";
  const deviceId = typeof rec.deviceId === "string" ? rec.deviceId : "";
  const deleted = rec.deleted === true ? true : void 0;
  return { fp, ts, deviceId, deleted };
}
function parseDevice(raw) {
  const rec = asRecord(raw);
  if (rec === null) return null;
  const baseline = asRecord(rec.baseline);
  const parsed = {};
  if (baseline !== null) {
    for (const [key, value] of Object.entries(baseline)) {
      if (typeof value === "string") parsed[key] = value;
    }
  }
  return {
    name: typeof rec.name === "string" ? rec.name : "",
    lastSyncedAt: typeof rec.lastSyncedAt === "string" ? rec.lastSyncedAt : "",
    baseline: parsed
  };
}
function parsePoolMeta(raw) {
  if (raw === null) return { ...EMPTY_POOL_META, entries: {}, devices: {} };
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return { ...EMPTY_POOL_META, entries: {}, devices: {} };
  }
  const rec = asRecord(parsed);
  if (rec === null) return { ...EMPTY_POOL_META, entries: {}, devices: {} };
  if (rec.schema === 1) {
    const entries2 = {};
    const v1entries = asRecord(rec.entries);
    const syncedAt = typeof rec.syncedAt === "string" ? rec.syncedAt : "";
    if (v1entries !== null) {
      for (const [key, fp] of Object.entries(v1entries)) {
        if (typeof fp === "string") {
          entries2[key] = { fp, ts: syncedAt, deviceId: "" };
        }
      }
    }
    return { schema: 2, syncedAt, encrypted: rec.encrypted === true, entries: entries2, devices: {} };
  }
  const entries = {};
  const rawEntries = asRecord(rec.entries);
  if (rawEntries !== null) {
    for (const [key, value] of Object.entries(rawEntries)) {
      const entry = parseEntry(value);
      if (entry !== null) entries[key] = entry;
    }
  }
  const devices = {};
  const rawDevices = asRecord(rec.devices);
  if (rawDevices !== null) {
    for (const [id, value] of Object.entries(rawDevices)) {
      const device = parseDevice(value);
      if (device !== null) devices[id] = device;
    }
  }
  return {
    schema: 2,
    syncedAt: typeof rec.syncedAt === "string" ? rec.syncedAt : "",
    encrypted: rec.encrypted === true,
    entries,
    devices
  };
}
function serializePoolMeta(meta) {
  return JSON.stringify(meta, null, "	");
}

// src/store/reconcile.ts
function classifyEntry(sides) {
  const { base, local, pool } = sides;
  if (pool === void 0) {
    return local === void 0 ? { kind: "noop" } : { kind: "push" };
  }
  if (pool.deleted) {
    if (local === void 0) return { kind: "noop" };
    return base !== void 0 && local === base ? { kind: "delete-local" } : { kind: "push" };
  }
  if (local === void 0) {
    if (base === void 0) return { kind: "pull" };
    return pool.fp === base ? { kind: "tombstone" } : { kind: "conflict" };
  }
  if (local === pool.fp) return { kind: "noop" };
  if (base === void 0) return { kind: "conflict" };
  if (pool.fp === base) return { kind: "push" };
  if (local === base) return { kind: "pull" };
  return { kind: "conflict" };
}
var CLOCK_TOLERANCE_MS = 5 * 60 * 1e3;
function clockSkewDetected(metaSyncedAt, now) {
  if (metaSyncedAt === "") return false;
  const ts = Date.parse(metaSyncedAt);
  return Number.isFinite(ts) && ts > now.getTime() + CLOCK_TOLERANCE_MS;
}
function monotonicTs(now, poolMaxTs2) {
  const floor = Date.parse(poolMaxTs2);
  if (Number.isFinite(floor) && floor + 1e3 > now.getTime()) {
    return new Date(floor + 1e3).toISOString();
  }
  return now.toISOString();
}
var TOMBSTONE_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1e3;
function tombstoneCollectible(entry, devices, now) {
  const ts = Date.parse(entry.ts);
  if (Number.isFinite(ts) && now.getTime() - ts > TOMBSTONE_MAX_AGE_MS) return true;
  for (const device of Object.values(devices)) {
    const seen = Date.parse(device.lastSyncedAt);
    if (!Number.isFinite(seen) || seen < ts) return false;
  }
  return true;
}
function poolMaxTs(meta) {
  let max = meta.syncedAt;
  for (const entry of Object.values(meta.entries)) {
    if (entry.ts > max) max = entry.ts;
  }
  return max;
}

// src/services/sync-service.ts
var ClockSkewError = class extends Error {
  constructor() {
    super("clock skew detected");
    this.name = "ClockSkewError";
  }
};
var SyncAbortedError = class extends Error {
  constructor() {
    super("sync aborted by user");
    this.name = "SyncAbortedError";
  }
};
var SyncService = class {
  constructor(adapter, paths, device, callbacks) {
    this.adapter = adapter;
    this.paths = paths;
    this.device = device;
    this.callbacks = callbacks;
  }
  async run(password) {
    const meta = parsePoolMeta(await this.adapter.readIfExists(metaPath(this.paths.pcPool)));
    const now = /* @__PURE__ */ new Date();
    if (clockSkewDetected(meta.syncedAt, now)) throw new ClockSkewError();
    await this.adapter.deletePath(`${this.paths.pcPool.base}/_lock.json`);
    const report = {
      pushed: 0,
      pulled: 0,
      tombstoned: 0,
      deletedLocal: 0,
      prunedMeta: 0,
      conflictsResolved: null,
      mobileProjection: false
    };
    const writeTs = monotonicTs(now, poolMaxTs(meta));
    const local = await this.collectLocal();
    const mine = meta.devices[this.device.id];
    const firstSync = mine === void 0;
    if (firstSync && Object.keys(meta.entries).length > 0) {
      const direction = await this.callbacks.firstSyncDirection();
      if (direction === null) throw new SyncAbortedError();
      if (direction === "local-to-pool") {
        for (const [key, content] of local) {
          await this.pushPool(meta, key, content, password, writeTs);
          report.pushed++;
        }
        for (const key of Object.keys(meta.entries)) {
          if (!local.has(key)) {
            if (!this.callbacks.syncArtifacts && this.isPluginArtifactKey(key)) continue;
            this.writeTombstone(meta, key, writeTs);
            report.tombstoned++;
          }
        }
      } else {
        for (const [key, entry] of Object.entries(meta.entries)) {
          if (entry.deleted) continue;
          if (!this.callbacks.syncArtifacts && this.isPluginArtifactKey(key)) continue;
          await this.pullLocal(key, await this.readPool(key, password), report);
        }
      }
    } else {
      const keys = /* @__PURE__ */ new Set([...local.keys(), ...Object.keys(meta.entries)]);
      const conflicts = [];
      for (const key of keys) {
        if (!this.callbacks.syncArtifacts && this.isPluginArtifactKey(key)) continue;
        const action = classifyEntry({
          base: mine == null ? void 0 : mine.baseline[key],
          local: local.has(key) ? fingerprint(local.get(key)) : void 0,
          pool: meta.entries[key]
        });
        switch (action.kind) {
          case "noop":
            break;
          case "push":
            await this.pushPool(meta, key, local.get(key), password, writeTs);
            report.pushed++;
            break;
          case "pull":
            await this.pullLocal(key, await this.readPool(key, password), report);
            break;
          case "tombstone":
            this.writeTombstone(meta, key, writeTs);
            report.tombstoned++;
            break;
          case "delete-local":
            await this.deleteLocalFile(key);
            report.deletedLocal++;
            break;
          case "conflict":
            conflicts.push(key);
            break;
        }
      }
      if (conflicts.length > 0) {
        const resolution = await this.callbacks.resolveConflicts(conflicts);
        if (resolution === null) throw new SyncAbortedError();
        report.conflictsResolved = resolution;
        for (const key of conflicts) {
          if (resolution === "local") {
            await this.pushPool(meta, key, local.get(key), password, writeTs);
            report.pushed++;
          } else {
            await this.pullLocal(key, await this.readPool(key, password), report);
          }
        }
      }
    }
    const baseline = {};
    for (const [key, entry] of Object.entries(meta.entries)) {
      if (entry.deleted) continue;
      baseline[key] = entry.fp;
    }
    for (const key of Object.keys(meta.entries)) {
      const entry = meta.entries[key];
      if ((entry == null ? void 0 : entry.deleted) && tombstoneCollectible(entry, meta.devices, now)) {
        delete meta.entries[key];
        report.prunedMeta++;
      }
    }
    meta.syncedAt = monotonicTs(now, poolMaxTs(meta));
    meta.encrypted = password !== null;
    meta.devices[this.device.id] = {
      name: this.device.name,
      lastSyncedAt: meta.syncedAt,
      baseline
    };
    await this.adapter.mkdir(this.paths.pcPool.base);
    await this.adapter.writeAtomic(metaPath(this.paths.pcPool), serializePoolMeta(meta));
    report.mobileProjection = await this.buildMobileProjection(password);
    return report;
  }
  // ── 本机状态收集 ──
  /** key → 明文内容（key 空间：app/<file>、plugins/<id>/<rel>、snippets/<name>、themes/<name>） */
  async collectLocal() {
    var _a;
    const local = /* @__PURE__ */ new Map();
    for (const spec of APP_FILES) {
      const raw = await this.adapter.obsidianRead(spec.file);
      if (raw !== null) local.set(`app/${spec.file}`, raw);
    }
    const plugins = await this.adapter.listInstalledPlugins();
    for (const plugin of plugins) {
      const files = await this.adapter.listPluginFilesRel(plugin.id);
      for (const rel of files) {
        const fileName = (_a = rel.split("/").pop()) != null ? _a : rel;
        if (!this.callbacks.syncArtifacts && !isCarryablePluginFile(fileName)) continue;
        const raw = await this.adapter.obsidianRead(`plugins/${plugin.id}/${rel}`);
        if (raw !== null) local.set(`plugins/${plugin.id}/${rel}`, raw);
      }
    }
    for (const name of await this.adapter.listFileNames(this.adapter.obsidianPath("snippets"))) {
      const raw = await this.adapter.readIfExists(this.adapter.obsidianPath(`snippets/${name}`));
      if (raw !== null) local.set(`snippets/${name}`, raw);
    }
    const themeDir = this.adapter.obsidianPath("themes");
    const themeChildren = await this.adapter.listChildNames(themeDir);
    for (const name of themeChildren.files) {
      const raw = await this.adapter.readIfExists(`${themeDir}/${name}`);
      if (raw !== null) local.set(`themes/${name}`, raw);
    }
    for (const folder of themeChildren.folders) {
      for (const file of await this.adapter.listFilesRecursive(`${themeDir}/${folder}`)) {
        const raw = await this.adapter.readIfExists(file);
        if (raw !== null) local.set(`themes/${file.slice(themeDir.length + 1)}`, raw);
      }
    }
    return local;
  }
  // ── 编解码（主体明文例外：syncArtifacts 开启时安装产物不加密） ──
  async encode(key, plain, password) {
    var _a;
    if (password === null) return plain;
    const fileName = (_a = key.split("/").pop()) != null ? _a : key;
    if (this.callbacks.syncArtifacts && key.startsWith("plugins/") && INSTALL_ARTIFACTS.has(fileName)) {
      return plain;
    }
    return JSON.stringify(await encryptText(password, plain), null, "	");
  }
  async readPool(key, password) {
    const raw = await this.adapter.readIfExists(this.poolPath(key));
    if (raw === null) throw new Error(`pool entry missing: ${key}`);
    const envelope = parseEnvelopeText(raw);
    if (envelope === null) return raw;
    if (password === null) throw new Error(`encrypted entry but no password: ${key}`);
    try {
      return await decryptText(password, envelope);
    } catch (error) {
      if (error instanceof PasswordError) throw new Error(`cannot decrypt pool entry: ${key}`);
      throw error;
    }
  }
  // ── 动作执行 ──
  poolPath(key) {
    return `${this.paths.pcPool.base}/${key}`;
  }
  /** key 是否为插件安装产物（main.js / styles.css / manifest.json） */
  isPluginArtifactKey(key) {
    var _a;
    return key.startsWith("plugins/") && INSTALL_ARTIFACTS.has((_a = key.split("/").pop()) != null ? _a : key);
  }
  async pushPool(meta, key, plain, password, ts) {
    const fp = fingerprint(plain);
    await this.adapter.mkdir(this.dirname(this.poolPath(key)));
    await this.adapter.writeAtomic(this.poolPath(key), await this.encode(key, plain, password));
    meta.entries[key] = { fp, ts, deviceId: this.device.id };
  }
  writeTombstone(meta, key, ts) {
    meta.entries[key] = { fp: "", ts, deviceId: this.device.id, deleted: true };
  }
  async pullLocal(key, plain, report) {
    if (key.startsWith("app/")) {
      await this.adapter.obsidianWrite(key.slice("app/".length), plain);
    } else {
      await this.adapter.mkdir(this.dirname(this.adapter.obsidianPath(key)));
      await this.adapter.writeText(this.adapter.obsidianPath(key), plain);
    }
    report.pulled++;
  }
  async deleteLocalFile(key) {
    await this.adapter.deletePath(this.adapter.obsidianPath(key));
  }
  dirname(path) {
    const idx = path.lastIndexOf("/");
    return idx === -1 ? "" : path.slice(0, idx);
  }
  // ── 移动投影（SPEC §3.2 末步；mobileconfig 由 PC 重建，手机永不写池） ──
  async buildMobileProjection(password) {
    const profileFiles = await this.adapter.listFileNames(this.paths.profilesDir);
    const mobileProfiles = profileFiles.map((name) => profileFromFileName(name)).filter((entry) => (entry == null ? void 0 : entry.platform) === "mobile");
    if (mobileProfiles.length === 0) return false;
    const transform = password === null ? void 0 : async (content, relPath) => {
      var _a;
      const fileName = (_a = relPath.split("/").pop()) != null ? _a : relPath;
      if (this.callbacks.syncArtifacts && INSTALL_ARTIFACTS.has(fileName)) return content;
      return JSON.stringify(await encryptText(password, content), null, "	");
    };
    const put = async (dstPath, content) => {
      await this.adapter.writeAtomic(dstPath, password === null ? content : await transform(content, ""));
    };
    const localPlugins = await this.adapter.listInstalledPlugins();
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
          excludeFileName: (fileName) => this.callbacks.syncArtifacts ? false : !isCarryablePluginFile(fileName),
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

// src/modals/choice-list.ts
var import_obsidian2 = require("obsidian");
function chooseFromList(app, options) {
  return new Promise((resolve) => {
    new ChoiceListModal(app, options, resolve).open();
  });
}
var ChoiceListModal = class extends import_obsidian2.Modal {
  constructor(app, options, settle) {
    super(app);
    this.options = options;
    this.settle = settle;
    this.answered = false;
  }
  onOpen() {
    this.contentEl.addClass("cp-modal");
    this.titleEl.setText(this.options.title);
    this.contentEl.createEl("p", { cls: "cp-modal__message", text: this.options.message });
    if (this.options.items.length > 0) {
      const ul = this.contentEl.createEl("ul", { cls: "cp-modal__list" });
      for (const item of this.options.items) ul.createEl("li", { text: item });
    }
    if (this.options.hint) {
      this.contentEl.createEl("p", { cls: "cp-modal__hint", text: this.options.hint });
    }
    const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
    for (const choice of this.options.choices) {
      const btn = new import_obsidian2.ButtonComponent(buttons).setButtonText(choice.label).onClick(() => {
        this.answered = true;
        this.settle(choice.value);
        this.close();
      });
      if (choice.tooltip) btn.setTooltip(choice.tooltip);
      if (choice.destructive) btn.setDestructive();
      else if (choice.cta) btn.setCta();
    }
  }
  onClose() {
    this.contentEl.empty();
    if (!this.answered) this.settle(null);
  }
};

// src/modals/apply-result.ts
var import_obsidian3 = require("obsidian");
var ApplyResultModal = class extends import_obsidian3.Modal {
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
    if (this.report.installedPlugins.length > 0) {
      const box = this.contentEl.createDiv();
      box.createEl("p", {
        cls: "cp-modal__hint",
        text: t("\u4EE5\u4E0B\u63D2\u4EF6\u5DF2\u4ECE\u914D\u7F6E\u5E93\u88C5\u9F50\u4E3B\u4F53\uFF0C\u91CD\u8F7D\u540E\u751F\u6548\uFF1A")
      });
      const ul = box.createEl("ul");
      for (const id of this.report.installedPlugins) ul.createEl("li", { text: id });
    }
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
      new import_obsidian3.ButtonComponent(buttons2).setButtonText(t("\u5173\u95ED")).setCta().onClick(() => this.close());
      return;
    }
    const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
    new import_obsidian3.ButtonComponent(buttons).setButtonText(t("\u7A0D\u540E\u624B\u52A8\u91CD\u8F7D")).onClick(() => this.close());
    new import_obsidian3.ButtonComponent(buttons).setButtonText(t("\u7ACB\u5373\u91CD\u8F7D")).setCta().onClick(() => {
      this.close();
      if (!this.reload()) {
        new import_obsidian3.Notice(t("\u65E0\u6CD5\u81EA\u52A8\u91CD\u8F7D\uFF0C\u8BF7\u624B\u52A8\u91CD\u542F Obsidian\uFF08Ctrl/Cmd+R \u6216\u91CD\u542F\u5E94\u7528\uFF09\u3002"));
      }
    });
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/modals/first-run-modal.ts
var import_obsidian4 = require("obsidian");
var FirstRunModal = class extends import_obsidian4.Modal {
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
        "\u672C\u673A\u662F\u300C\u540C\u6B65\u8BBE\u5907\u300D\uFF08\u628A\u672C\u673A Obsidian \u914D\u7F6E\u4E0E\u914D\u7F6E\u5E93\u53CC\u5411\u540C\u6B65\uFF0C\u53EF\u591A\u53F0\u540C\u65F6\u5F00\u542F\uFF09\uFF0C\u8FD8\u662F\u300C\u4EC5\u5E94\u7528\u300D\uFF08\u53EA\u5E94\u7528\u914D\u7F6E\u5E93\u540C\u6B65\u6765\u7684\u914D\u7F6E\uFF09\uFF1F"
      )
    });
    this.contentEl.createEl("p", {
      cls: "cp-modal__hint",
      text: t("\u4E0D\u786E\u5B9A\u5C31\u9009\u4EC5\u5E94\u7528\u2014\u2014\u4EC5\u5E94\u7528\u4E0D\u4F1A\u5199\u5165\u914D\u7F6E\u5E93\uFF0C\u968F\u65F6\u53EF\u4EE5\u5728\u8BBE\u7F6E\u91CC\u6539\u3002")
    });
    const choices = this.contentEl.createDiv({ cls: "cp-first-run__choice" });
    const apply = new import_obsidian4.ButtonComponent(choices).setButtonText(t("\u672C\u673A\u4E3A\u4EC5\u5E94\u7528")).onClick(() => this.answer("apply"));
    apply.buttonEl.addClass("cp-first-run__option");
    apply.setCta();
    const sync = new import_obsidian4.ButtonComponent(choices).setButtonText(t("\u672C\u673A\u4E3A\u540C\u6B65\u8BBE\u5907\uFF08\u4E0E\u914D\u7F6E\u5E93\u53CC\u5411\u540C\u6B65\uFF09")).onClick(() => this.answer("sync"));
    sync.buttonEl.addClass("cp-first-run__option");
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

// src/modals/profile-edit.ts
var import_obsidian6 = require("obsidian");

// src/ui/profile-editor.ts
var import_obsidian5 = require("obsidian");
function toggleRow(container, label, checked, onChange, extra) {
  const setting = new import_obsidian5.Setting(container).setName(label);
  if (extra) setting.setDesc(extra);
  setting.addToggle((toggle) => toggle.setValue(checked).onChange(onChange));
}
function collapsibleGroup(container, name, open = true) {
  const details = container.createEl("details", { cls: "cp-editor__group" });
  details.open = open;
  details.createEl("summary", { text: name });
  return details.createDiv({ cls: "cp-editor__group-body" });
}
function groupHeader(body, items, isSelected, selectAll) {
  if (items.length === 0) {
    new import_obsidian5.Setting(body).setName(t("\u5168\u9009")).setDesc(t("\u6682\u65E0\u6761\u76EE"));
    return;
  }
  const selected = items.filter(isSelected).length;
  new import_obsidian5.Setting(body).setName(t("\u5168\u9009")).setDesc(t("\u5DF2\u9009 {selected}/{total}", { selected, total: items.length })).addToggle(
    (toggle) => toggle.setValue(selected === items.length).setTooltip(t("\u5168\u9009")).onChange((value) => selectAll(value))
  );
}
function renderProfileEditor(container, doc, data, host) {
  var _a, _b;
  const foldState = /* @__PURE__ */ new Map();
  for (const details of Array.from(container.querySelectorAll("details.cp-editor__group"))) {
    const key = (_b = (_a = details.querySelector("summary")) == null ? void 0 : _a.textContent) != null ? _b : "";
    if (key !== "") foldState.set(key, details.open);
  }
  container.empty();
  const wasOpen = (name) => {
    var _a2;
    return (_a2 = foldState.get(name)) != null ? _a2 : true;
  };
  const isMobileDoc = doc.platform === "mobile";
  if (isMobileDoc) {
    container.createEl("p", {
      cls: "cp-modal__hint",
      text: t("\u79FB\u52A8 profile \u4EC5\u5305\u542B\u6838\u5FC3\u63D2\u4EF6\u5F00\u5173\u4E0E\u63D2\u4EF6\u914D\u7F6E\uFF1B\u5916\u89C2\u3001\u4E3B\u9898\u3001\u5FEB\u6377\u952E\u7B49 app \u8BBE\u7F6E\u4E0D\u4F1A\u5E94\u7528\u5230\u624B\u673A\u3002")
    });
  }
  const appBody = collapsibleGroup(container, t("App \u8BBE\u7F6E"), wasOpen(t("App \u8BBE\u7F6E")));
  const appSpecs = APP_FILES.filter((spec) => !isMobileDoc || isMobileAllowedAppFile(spec.file));
  groupHeader(
    appBody,
    appSpecs,
    (spec) => doc.app.includes(spec.file),
    (on) => {
      doc.app = on ? appSpecs.map((spec) => spec.file) : [];
      void host.onChanged(globalThis.structuredClone(doc)).then(() => {
        var _a2;
        return (_a2 = host.onBulkChanged) == null ? void 0 : _a2.call(host);
      });
    }
  );
  for (const spec of appSpecs) {
    toggleRow(
      appBody,
      t(spec.label),
      doc.app.includes(spec.file),
      (value) => {
        doc.app = value ? [...doc.app, spec.file] : doc.app.filter((file) => file !== spec.file);
        void host.onChanged(globalThis.structuredClone(doc));
      }
    );
  }
  const pluginBody = collapsibleGroup(container, t("\u793E\u533A\u63D2\u4EF6"), wasOpen(t("\u793E\u533A\u63D2\u4EF6")));
  groupHeader(
    pluginBody,
    data.plugins,
    (plugin) => doc.plugins.includes(plugin.id),
    (on) => {
      doc.plugins = on ? data.plugins.map((plugin) => plugin.id) : [];
      void host.onChanged(globalThis.structuredClone(doc)).then(() => {
        var _a2;
        return (_a2 = host.onBulkChanged) == null ? void 0 : _a2.call(host);
      });
    }
  );
  for (const plugin of data.plugins) {
    const label = plugin.name === plugin.id ? plugin.id : `${plugin.name}\uFF08${plugin.id}\uFF09`;
    const extra = plugin.isDesktopOnly ? t("\u684C\u9762\u4E13\u5C5E\uFF0C\u4E0D\u8FDB\u79FB\u52A8 profile") : void 0;
    toggleRow(pluginBody, label, doc.plugins.includes(plugin.id), (value) => {
      doc.plugins = value ? [...doc.plugins, plugin.id] : doc.plugins.filter((id) => id !== plugin.id);
      void host.onChanged(globalThis.structuredClone(doc));
    }, extra);
  }
  if (!isMobileDoc) {
    const snippetBody = collapsibleGroup(container, t("CSS \u7247\u6BB5"), wasOpen(t("CSS \u7247\u6BB5")));
    groupHeader(
      snippetBody,
      data.snippets,
      (name) => doc.snippets.includes(name),
      (on) => {
        doc.snippets = on ? [...data.snippets] : [];
        void host.onChanged(globalThis.structuredClone(doc)).then(() => {
          var _a2;
          return (_a2 = host.onBulkChanged) == null ? void 0 : _a2.call(host);
        });
      }
    );
    for (const name of data.snippets) {
      toggleRow(snippetBody, name, doc.snippets.includes(name), (value) => {
        doc.snippets = value ? [...doc.snippets, name] : doc.snippets.filter((item) => item !== name);
        void host.onChanged(globalThis.structuredClone(doc));
      });
    }
    const themeBody = collapsibleGroup(container, t("\u4E3B\u9898"), wasOpen(t("\u4E3B\u9898")));
    groupHeader(
      themeBody,
      data.themes,
      (name) => doc.themes.includes(name),
      (on) => {
        doc.themes = on ? [...data.themes] : [];
        void host.onChanged(globalThis.structuredClone(doc)).then(() => {
          var _a2;
          return (_a2 = host.onBulkChanged) == null ? void 0 : _a2.call(host);
        });
      }
    );
    for (const name of data.themes) {
      toggleRow(themeBody, name, doc.themes.includes(name), (value) => {
        doc.themes = value ? [...doc.themes, name] : doc.themes.filter((item) => item !== name);
        void host.onChanged(globalThis.structuredClone(doc));
      });
    }
  }
}

// src/modals/profile-edit.ts
var ProfileEditModal = class extends import_obsidian6.Modal {
  constructor(plugin, profile, data) {
    super(plugin.app);
    this.plugin = plugin;
    this.profile = profile;
    this.data = data;
  }
  onOpen() {
    this.contentEl.addClass("cp-modal");
    const title = this.profile.platform === "mobile" ? t("\u7F16\u8F91 profile\uFF1A{name}\uFF08\u624B\u673A\uFF09", { name: this.profile.name }) : t("\u7F16\u8F91 profile\uFF1A{name}", { name: this.profile.name });
    this.titleEl.setText(title);
    this.contentEl.createEl("p", {
      cls: "cp-modal__hint",
      text: t("\u52FE\u9009\u6539\u52A8\u5373\u65F6\u4FDD\u5B58\uFF0C\u65E0\u9700\u624B\u52A8\u786E\u8BA4\u3002")
    });
    this.bodyEl = this.contentEl.createDiv();
    this.renderEditor();
  }
  /** 全选等批量变化后整体重渲染（单行开关自己会更新，不触发） */
  renderEditor() {
    renderProfileEditor(this.bodyEl, this.profile, this.data, {
      onChanged: async (changed) => {
        await this.plugin.onProfileEdited(changed);
      },
      onBulkChanged: () => this.renderEditor()
    });
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/modals/password.ts
var import_obsidian7 = require("obsidian");
function readInputValue(input) {
  var _a;
  return (_a = input == null ? void 0 : input.value) != null ? _a : "";
}
function addRevealToggle(setting, input) {
  let visible = false;
  setting.addExtraButton(
    (btn) => btn.setIcon("eye").setTooltip(t("\u663E\u793A\u5BC6\u7801")).onClick(() => {
      visible = !visible;
      const el = input();
      if (el) el.type = visible ? "text" : "password";
      btn.setIcon(visible ? "eye-off" : "eye").setTooltip(visible ? t("\u9690\u85CF\u5BC6\u7801") : t("\u663E\u793A\u5BC6\u7801"));
    })
  );
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
function promptChangeStorePassword(app, currentPassword) {
  return new Promise((resolve) => {
    new ChangePasswordModal(app, currentPassword, resolve).open();
  });
}
var NewPasswordModal = class extends import_obsidian7.Modal {
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
    const pwSetting = new import_obsidian7.Setting(this.contentEl).setName(t("\u5BC6\u7801"));
    pwSetting.addText((text) => {
      text.inputEl.type = "password";
      pwInput = text.inputEl;
    });
    addRevealToggle(pwSetting, () => pwInput);
    const pw2Setting = new import_obsidian7.Setting(this.contentEl).setName(t("\u518D\u8F93\u4E00\u6B21"));
    pw2Setting.addText((text) => {
      text.inputEl.type = "password";
      pw2Input = text.inputEl;
    });
    addRevealToggle(pw2Setting, () => pw2Input);
    const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
    new import_obsidian7.ButtonComponent(buttons).setButtonText(t("\u6682\u4E0D\u52A0\u5BC6")).setTooltip(t("store \u4EE5\u660E\u6587\u968F\u7B14\u8BB0\u540C\u6B65\uFF1B\u540E\u7EED\u53EF\u5728\u8BBE\u7F6E\u91CC\u5F00\u542F\u52A0\u5BC6\uFF08\u89E6\u53D1\u4E00\u6B21\u91CD\u65B0\u540C\u6B65\uFF09")).onClick(() => {
      this.answered = true;
      this.settle(null);
      this.close();
    });
    new import_obsidian7.ButtonComponent(buttons).setButtonText(t("\u542F\u7528\u52A0\u5BC6")).setCta().onClick(() => {
      const pw = readInputValue(pwInput);
      if (pw === "" || pw !== readInputValue(pw2Input)) {
        new import_obsidian7.Notice(t("\u4E24\u6B21\u8F93\u5165\u4E0D\u4E00\u81F4\u6216\u4E3A\u7A7A\u3002"));
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
var PasswordInputModal = class extends import_obsidian7.Modal {
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
    const pwSetting = new import_obsidian7.Setting(this.contentEl).setName(t("\u5BC6\u7801"));
    pwSetting.addText((text) => {
      text.inputEl.type = "password";
      pwInput = text.inputEl;
    });
    addRevealToggle(pwSetting, () => pwInput);
    const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
    new import_obsidian7.ButtonComponent(buttons).setButtonText(t("\u53D6\u6D88")).onClick(() => {
      this.answered = true;
      this.settle(null);
      this.close();
    });
    new import_obsidian7.ButtonComponent(buttons).setButtonText(t("\u786E\u8BA4")).setCta().onClick(() => {
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
var ChangePasswordModal = class extends import_obsidian7.Modal {
  constructor(app, currentPassword, settle) {
    super(app);
    this.currentPassword = currentPassword;
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
    const oldSetting = new import_obsidian7.Setting(this.contentEl).setName(t("\u5F53\u524D\u5BC6\u7801"));
    if (this.currentPassword !== null) {
      oldSetting.setDesc(t("\u5DF2\u81EA\u52A8\u586B\u5165\u672C\u673A\u8BB0\u4F4F\u7684\u5BC6\u7801\uFF08\u70B9\u773C\u775B\u56FE\u6807\u53EF\u67E5\u770B\uFF09\u3002"));
    }
    oldSetting.addText((text) => {
      text.inputEl.type = "password";
      if (this.currentPassword !== null) text.setValue(this.currentPassword);
      oldInput = text.inputEl;
    });
    addRevealToggle(oldSetting, () => oldInput);
    const newSetting = new import_obsidian7.Setting(this.contentEl).setName(t("\u65B0\u5BC6\u7801"));
    newSetting.addText((text) => {
      text.inputEl.type = "password";
      newInput = text.inputEl;
    });
    addRevealToggle(newSetting, () => newInput);
    const new2Setting = new import_obsidian7.Setting(this.contentEl).setName(t("\u518D\u8F93\u4E00\u6B21\u65B0\u5BC6\u7801"));
    new2Setting.addText((text) => {
      text.inputEl.type = "password";
      new2Input = text.inputEl;
    });
    addRevealToggle(new2Setting, () => new2Input);
    const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
    new import_obsidian7.ButtonComponent(buttons).setButtonText(t("\u53D6\u6D88")).onClick(() => {
      this.answered = true;
      this.settle(null);
      this.close();
    });
    new import_obsidian7.ButtonComponent(buttons).setButtonText(t("\u786E\u8BA4\u4FEE\u6539")).setCta().onClick(() => {
      const newPassword = readInputValue(newInput);
      if (newPassword === "" || newPassword !== readInputValue(new2Input)) {
        new import_obsidian7.Notice(t("\u4E24\u6B21\u8F93\u5165\u4E0D\u4E00\u81F4\u6216\u4E3A\u7A7A\u3002"));
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
var import_obsidian10 = require("obsidian");

// src/modals/confirm.ts
var import_obsidian8 = require("obsidian");
var ConfirmModal = class extends import_obsidian8.Modal {
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
    new import_obsidian8.ButtonComponent(buttons).setButtonText(this.options.cancelLabel).onClick(() => this.close());
    const accept = new import_obsidian8.ButtonComponent(buttons).setButtonText(this.options.acceptLabel).onClick(() => {
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
var import_obsidian9 = require("obsidian");
function promptText(app, options) {
  return new Promise((resolve) => {
    new TextInputModal(app, options, resolve).open();
  });
}
var TextInputModal = class extends import_obsidian9.Modal {
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
    new import_obsidian9.Setting(this.contentEl).setName(this.options.title).addText((text) => {
      if (this.options.placeholder) text.setPlaceholder(this.options.placeholder);
      if (this.options.value !== void 0) text.setValue(this.options.value);
      input = text.inputEl;
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") this.accept(input);
      });
    });
    const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
    new import_obsidian9.ButtonComponent(buttons).setButtonText(t("\u53D6\u6D88")).onClick(() => {
      this.answered = true;
      this.settle(null);
      this.close();
    });
    new import_obsidian9.ButtonComponent(buttons).setButtonText((_a = this.options.acceptLabel) != null ? _a : t("\u786E\u8BA4")).setCta().onClick(() => this.accept(input));
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
var CPSettingTab = class extends import_obsidian10.PluginSettingTab {
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
    new import_obsidian10.Setting(container).setName(t("\u901A\u7528")).setHeading();
    new import_obsidian10.Setting(container).setName(t("\u914D\u7F6E\u5E93\u8DEF\u5F84")).setDesc(t("store \u5728 vault \u5185\u7684\u8DEF\u5F84\uFF08\u9ED8\u8BA4 SettingProfiles\uFF0Cvault \u6839\uFF09\u3002\u4FEE\u6539\u540E\u91CD\u8F7D\u63D2\u4EF6\u751F\u6548\u3002")).addText(
      (text) => text.setPlaceholder("SettingProfiles").setValue(this.plugin.config.storePath).onChange(async (value) => {
        this.plugin.config.storePath = value;
        await this.plugin.saveConfig();
      })
    );
    new import_obsidian10.Setting(container).setName(t("\u8BBE\u5907\u540D")).setDesc(t("\u4EC5\u4F5C\u6765\u6E90\u6807\u6CE8\uFF1A\u663E\u793A\u5728\u540C\u6B65\u8BB0\u5F55\u4E0E\u51B2\u7A81\u63D0\u793A\u91CC\uFF0C\u8BF4\u660E\u914D\u7F6E\u6765\u81EA\u54EA\u53F0\u8BBE\u5907\uFF1B\u4E0D\u53C2\u4E0E\u540C\u6B65\u5339\u914D\u3002")).addText(
      (text) => text.setPlaceholder(this.plugin.effectiveDeviceName()).setValue(this.plugin.config.deviceName).onChange(async (value) => {
        this.plugin.config.deviceName = value;
        await this.plugin.saveConfig();
      })
    );
    if (!this.plugin.store.isMobile && this.plugin.config.preferredRole === "sync") {
      new import_obsidian10.Setting(container).setName(t("\u540C\u6B65\u63D2\u4EF6\u4E3B\u4F53")).setDesc(
        t("\u628A\u63D2\u4EF6\u7684 main.js / styles.css / manifest.json \u4E00\u5E76\u660E\u6587\u540C\u6B65\uFF08\u4E0D\u52A0\u5BC6\uFF09\u3002\u5F00\u542F\u540E\u5E94\u7528\u7AEF\u53EF\u76F4\u63A5\u88C5\u9F50\u7F3A\u5931\u63D2\u4EF6\uFF1B\u4E0B\u6B21\u540C\u6B65\u751F\u6548\u3002")
      ).addToggle(
        (toggle) => toggle.setValue(this.plugin.config.syncArtifacts).onChange(async (value) => {
          this.plugin.config.syncArtifacts = value;
          await this.plugin.saveConfig();
        })
      );
    } else {
      new import_obsidian10.Setting(container).setName(t("\u540C\u6B65\u63D2\u4EF6\u4E3B\u4F53")).setDesc(
        t("\u5F00\u542F\u540E\u5E94\u7528\u65F6\u628A\u6C60\u91CC\u7684\u63D2\u4EF6\u4E3B\u4F53\uFF08main.js / styles.css / manifest.json\uFF09\u8FDE\u540C\u914D\u7F6E\u4E00\u8D77\u5199\u5165\uFF0C\u672A\u5B89\u88C5\u7684\u63D2\u4EF6\u76F4\u63A5\u88C5\u9F50\uFF0C\u91CD\u8F7D\u540E\u751F\u6548\uFF1B\u5173\u95ED\u5219\u53EA\u5E94\u7528\u914D\u7F6E\uFF0C\u672A\u5B89\u88C5\u7684\u63D2\u4EF6\u8DF3\u8FC7\u3002")
      ).addToggle(
        (toggle) => toggle.setValue(this.plugin.config.applyArtifacts).onChange(async (value) => {
          this.plugin.config.applyArtifacts = value;
          await this.plugin.saveConfig();
        })
      );
    }
    new import_obsidian10.Setting(container).setName(t("\u8BED\u8A00")).addDropdown(
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
    new import_obsidian10.Setting(container).setName(t("\u89D2\u8272")).setHeading();
    const isSync = this.plugin.config.preferredRole === "sync";
    const roleName = isSync ? t("\u540C\u6B65\u8BBE\u5907") : this.plugin.config.preferredRole === "apply" ? t("\u4EC5\u5E94\u7528") : t("\u5C1A\u672A\u8BBE\u5B9A");
    new import_obsidian10.Setting(container).setName(t("\u5F53\u524D\u89D2\u8272")).setDesc(t("\u540C\u6B65\u8BBE\u5907\u53EF\u4E0E\u914D\u7F6E\u5E93\u53CC\u5411\u540C\u6B65\uFF08\u591A\u53F0\u53EF\u540C\u65F6\u5F00\u542F\uFF09\uFF1B\u4EC5\u5E94\u7528\u53EA\u8986\u76D6\u672C\u673A\uFF0C\u4E0D\u5199\u914D\u7F6E\u5E93\u3002")).then((s) => {
      s.controlEl.createSpan({ text: roleName });
    });
    new import_obsidian10.Setting(container).setName(t("\u5207\u6362\u89D2\u8272")).setDesc(t("\u5207\u6362\u540E\u7ACB\u5373\u751F\u6548\uFF0C\u65E0\u9700\u91CD\u8F7D\u3002")).addToggle(
      (toggle) => toggle.setValue(isSync).setTooltip(t("\u5F00 = \u540C\u6B65\u8BBE\u5907\uFF0C\u5173 = \u4EC5\u5E94\u7528")).onChange(
        (value) => void this.plugin.setRole(value ? "sync" : "apply").then(() => this.display())
      )
    );
  }
  // ── 加密（SPEC §2.5：改密 / 启用仅同步设备 PC 端） ──
  async renderCrypto(container) {
    let encrypted = false;
    try {
      encrypted = await this.plugin.storeEncrypted();
    } catch (e) {
      encrypted = false;
    }
    const canManage = !this.plugin.store.isMobile && this.plugin.config.preferredRole === "sync";
    if (!canManage) {
      new import_obsidian10.Setting(container).setName(t("\u52A0\u5BC6")).setHeading();
      if (encrypted) {
        new import_obsidian10.Setting(container).setName(t("\u5F55\u5165\u540C\u6B65\u5BC6\u7801")).setDesc(t("\u8F93\u5165\u540C\u6B65\u8BBE\u5907\u8BBE\u7F6E\u7684\u5BC6\u7801\u4EE5\u89E3\u5BC6\u914D\u7F6E\u5E93\uFF1B\u9A8C\u8BC1\u901A\u8FC7\u540E\u672C\u673A\u8BB0\u4F4F\uFF08\u53EA\u5B58\u672C\u673A\uFF0C\u4E0D\u8FDB vault\uFF09\u3002")).addButton((btn) => btn.setButtonText(t("\u5F55\u5165\u540C\u6B65\u5BC6\u7801")).onClick(() => void this.plugin.enterStorePassword()));
        return;
      }
      const storeExists = await this.plugin.storeDirExists();
      new import_obsidian10.Setting(container).setName(t("\u5F55\u5165\u540C\u6B65\u5BC6\u7801")).setDesc(
        storeExists ? t("\u914D\u7F6E\u5E93\u672A\u52A0\u5BC6\uFF0C\u65E0\u9700\u5BC6\u7801\u3002") : t("\u672A\u627E\u5230\u914D\u7F6E\u5E93\uFF08{path}\uFF09\u3002\u8BF7\u786E\u8BA4\u914D\u7F6E\u5E93\u5DF2\u968F\u7B14\u8BB0\u540C\u6B65\u5230\u672C\u673A\uFF0C\u4E14\u8DEF\u5F84\u4E0E\u540C\u6B65\u8BBE\u5907\u4E00\u81F4\u3002", {
          path: this.plugin.config.storePath
        })
      );
      return;
    }
    new import_obsidian10.Setting(container).setName(t("\u52A0\u5BC6")).setHeading();
    if (encrypted) {
      new import_obsidian10.Setting(container).setName(t("\u914D\u7F6E\u5E93\u52A0\u5BC6")).setDesc(t("store \u6574\u5E93\u52A0\u5BC6\uFF1B\u5BC6\u7801\u53EA\u5B58\u5404\u8BBE\u5907\u672C\u5730\uFF0C\u4E0D\u8FDB vault\u3002"));
      new import_obsidian10.Setting(container).setName(t("\u4FEE\u6539\u5BC6\u7801")).setDesc(t("\u6C60\u5185\u5168\u90E8\u5BC6\u6587\u4F1A\u4EE5\u65B0\u5BC6\u7801\u91CD\u65B0\u52A0\u5BC6\u91CD\u5199\u3002")).addButton((btn) => btn.setButtonText(t("\u4FEE\u6539\u5BC6\u7801")).onClick(() => void this.changePassword()));
    } else {
      new import_obsidian10.Setting(container).setName(t("\u914D\u7F6E\u5E93\u52A0\u5BC6")).setDesc(t("\u5C1A\u672A\u52A0\u5BC6\u3002\u4E0B\u6B21\u540C\u6B65\u65F6\u53EF\u8BBE\u7F6E\u5BC6\u7801\uFF0Cstore \u5C06\u6574\u5E93\u52A0\u5BC6\u3002"));
      new import_obsidian10.Setting(container).setName(t("\u542F\u7528\u52A0\u5BC6")).setDesc(t("\u8BBE\u7F6E\u5BC6\u7801\u5E76\u7ACB\u5373\u91CD\u65B0\u540C\u6B65\uFF08\u6574\u5E93\u52A0\u5BC6\uFF09\u3002")).addButton((btn) => btn.setButtonText(t("\u542F\u7528\u52A0\u5BC6")).onClick(() => void this.plugin.runSync()));
    }
  }
  async changePassword() {
    const input = await promptChangeStorePassword(this.app, this.plugin.store.storePassword());
    if (input === null) return;
    try {
      await this.plugin.changeStorePassword(input.oldPassword, input.newPassword);
      new import_obsidian10.Notice(t("\u5BC6\u7801\u5DF2\u4FEE\u6539\uFF0C\u6C60\u5185\u5BC6\u6587\u5DF2\u91CD\u5199\u3002"));
    } catch (error) {
      if (error instanceof WrongStorePasswordError) {
        new import_obsidian10.Notice(t("\u5BC6\u7801\u4E0D\u6B63\u786E\u3002"));
        return;
      }
      new import_obsidian10.Notice(t("\u4FEE\u6539\u5931\u8D25\uFF1A{message}", { message: error instanceof Error ? error.message : String(error) }));
    }
  }
  // ── Profiles（PC 端管理；与编辑 Modal 共用渲染） ──
  async renderProfiles(container) {
    new import_obsidian10.Setting(container).setName(t("Profiles")).setHeading();
    if (this.plugin.store.isMobile) {
      new import_obsidian10.Setting(container).setDesc(t("profile \u7BA1\u7406\u8BF7\u5230 PC \u7AEF\uFF08\u624B\u673A\u53EA\u5E94\u7528\u914D\u7F6E\uFF09\u3002"));
      return;
    }
    const profiles = await this.plugin.listProfiles();
    const names = [...new Set(profiles.map((entry) => entry.name))];
    new import_obsidian10.Setting(container).setName(t("\u65B0\u5EFA profile")).setDesc(t("\u521B\u5EFA\u540E\u91CD\u8F7D\u63D2\u4EF6\uFF0C\u5E94\u7528\u547D\u4EE4\u5373\u53EF\u7528\u3002")).addButton((btn) => btn.setButtonText(t("\u65B0\u5EFA")).setCta().onClick(() => void this.createProfile()));
    if (profiles.length === 0) {
      new import_obsidian10.Setting(container).setDesc(t("\u8FD8\u6CA1\u6709 profile\u3002\u65B0\u5EFA\u4E00\u4E2A\uFF0C\u6216\u5728\u4E00\u53F0\u540C\u6B65\u8BBE\u5907\u4E0A\u6267\u884C\u540C\u6B65\u3002"));
      return;
    }
    for (const name of names) {
      const desktop = profiles.find((entry) => entry.name === name && entry.platform === "desktop");
      if (desktop) {
        const mobile = profiles.some((entry) => entry.name === name && entry.platform === "mobile");
        this.renderProfileRow(container, name, mobile);
      } else {
        this.renderOrphanMobileRow(container, name);
      }
    }
  }
  /** 每个 profile 名一行：手机适配是开关状态，不单列 mobile 行（派生跟随桌面，编辑它无意义） */
  renderProfileRow(container, name, hasMobileTwin) {
    const setting = new import_obsidian10.Setting(container).setName(name).setDesc(
      hasMobileTwin ? t("\u5DF2\u5F00\u542F\u624B\u673A\u9002\u914D\uFF1A\u624B\u673A\u7AEF\u5E94\u7528\u300A{name}\uFF08\u624B\u673A\uFF09\u300B\u3002", { name }) : t("\u672A\u5F00\u542F\u624B\u673A\u9002\u914D\u3002")
    );
    setting.addToggle(
      (toggle) => toggle.setValue(hasMobileTwin).setTooltip(t("\u9002\u914D\u624B\u673A")).onChange((value) => void this.setMobileAdaptation(name, value))
    );
    setting.addButton((btn) => btn.setButtonText(t("\u67E5\u770B/\u7F16\u8F91")).onClick(() => void this.plugin.openProfileEditor(name, "desktop"))).addButton((btn) => btn.setButtonText(t("\u91CD\u547D\u540D")).onClick(() => void this.renameProfile(name))).addButton(
      (btn) => btn.setButtonText(t("\u5220\u9664")).setDestructive().onClick(() => void this.deleteProfile(name))
    );
  }
  renderOrphanMobileRow(container, name) {
    new import_obsidian10.Setting(container).setName(t("{name}\uFF08\u624B\u673A\uFF09", { name })).setDesc(t("\u684C\u9762 profile \u5DF2\u4E0D\u5B58\u5728\u7684\u6D3E\u751F\u6B8B\u7559\uFF0C\u53EF\u5220\u9664\u3002")).addButton(
      (btn) => btn.setButtonText(t("\u5220\u9664")).setDestructive().onClick(() => void this.plugin.deleteProfile(name, "mobile").then(() => this.display()))
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
  async deleteProfile(name) {
    const confirmed = await askConfirm(this.app, {
      title: t("\u5220\u9664 profile"),
      message: t("\u786E\u5B9A\u5220\u9664\u300A{label}\u300B\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002", { label: name }),
      acceptLabel: t("\u5220\u9664"),
      cancelLabel: t("\u53D6\u6D88"),
      acceptStyle: "warning"
    });
    if (!confirmed) return;
    const twin = await this.plugin.readProfile(name, "mobile");
    if (twin !== null) {
      const deleteTwin = await askConfirm(this.app, {
        title: t("\u5220\u9664\u624B\u673A\u9002\u914D profile"),
        message: t("\u300A{name}\u300B\u6709\u624B\u673A\u9002\u914D\u6D3E\u751F\uFF0C\u4E00\u5E76\u5220\u9664\uFF1F", { name }),
        acceptLabel: t("\u4E00\u5E76\u5220\u9664"),
        cancelLabel: t("\u4EC5\u5220\u684C\u9762\u7248")
      });
      if (deleteTwin) await this.plugin.deleteProfile(name, "mobile");
    }
    await this.plugin.deleteProfile(name, "desktop");
    this.display();
  }
  async setMobileAdaptation(name, enabled) {
    try {
      await this.plugin.setMobileAdaptation(name, enabled);
    } catch (error) {
      new import_obsidian10.Notice(t("\u64CD\u4F5C\u5931\u8D25\uFF1A{message}", { message: error instanceof Error ? error.message : String(error) }));
    }
    this.display();
  }
};

// src/types.ts
var DEFAULT_STORE_PATH = "SettingProfiles";
var DEFAULT_CONFIG = {
  storePath: DEFAULT_STORE_PATH,
  language: "auto",
  deviceName: "",
  deviceId: "",
  preferredRole: "ask",
  syncArtifacts: false,
  applyArtifacts: false
};
function mergeConfig(saved) {
  const source = saved != null ? saved : {};
  return {
    storePath: typeof source.storePath === "string" && source.storePath.trim() !== "" ? source.storePath : DEFAULT_STORE_PATH,
    language: source.language === "zh" || source.language === "en" ? source.language : "auto",
    deviceName: typeof source.deviceName === "string" ? source.deviceName : "",
    deviceId: typeof source.deviceId === "string" ? source.deviceId : "",
    preferredRole: source.preferredRole === "sync" || source.preferredRole === "apply" ? source.preferredRole : "ask",
    syncArtifacts: source.syncArtifacts === true,
    applyArtifacts: source.applyArtifacts === true
  };
}

// src/main.ts
var ConfigProfilePlugin = class extends import_obsidian11.Plugin {
  constructor() {
    super(...arguments);
    this.config = DEFAULT_CONFIG;
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
    await this.ensureDeviceId();
    await this.migrateStoreFileNames();
    this.addSettingTab(new CPSettingTab(this.app, this));
    this.app.workspace.onLayoutReady(() => {
      this.registerCommands();
      if (decideStartupRole(this.config.preferredRole).kind === "ask") {
        new FirstRunModal(this.app, (choice) => void this.applyFirstRunChoice(choice)).open();
      }
    });
  }
  async saveConfig() {
    await this.saveData(this.config);
  }
  /** 设备身份持久化进 data.json（0.1.0 起；旧 localStorage 值只作迁移源） */
  async ensureDeviceId() {
    var _a;
    if (this.config.deviceId !== "") return;
    this.config.deviceId = (_a = this.store.legacyDeviceId()) != null ? _a : this.randomId();
    await this.saveConfig();
  }
  randomId() {
    const c = globalThis.crypto;
    if (c && typeof c.randomUUID === "function") return c.randomUUID();
    return `cp-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  }
  // ── 旧文件名迁移（0.1.6：`_crypto.json`/`_meta.json` → 去下划线） ──
  // 下划线前缀撞部分同步工具（如 remotely-save）的排除规则，导致这两个文件不随 vault 同步。
  // 见到旧名就改为新名；新名已存在（对端先迁好同步过来）则删旧文件。失败静默——下次启动重试。
  async migrateStoreFileNames() {
    const paths = this.paths();
    const pairs = [
      [legacyCryptoPath(paths.root), paths.crypto],
      [legacyMetaPath(paths.pcPool), metaPath(paths.pcPool)],
      [legacyMetaPath(paths.mobilePool), metaPath(paths.mobilePool)]
    ];
    for (const [from, to] of pairs) {
      try {
        if (!await this.store.pathExists(from)) continue;
        if (await this.store.pathExists(to)) await this.store.deletePath(from);
        else await this.store.renamePath(from, to);
      } catch (e) {
      }
    }
  }
  // ── 角色（SPEC §3.1：本地偏好，无 lock） ──
  async applyFirstRunChoice(choice) {
    await this.setRole(choice);
  }
  async setRole(role) {
    this.config.preferredRole = role;
    await this.saveConfig();
    new import_obsidian11.Notice(role === "sync" ? t("\u672C\u673A\u5DF2\u8BBE\u4E3A\u540C\u6B65\u8BBE\u5907\u3002") : t("\u672C\u673A\u5DF2\u8BBE\u4E3A\u4EC5\u5E94\u7528\u3002"));
  }
  // ── 加密（SPEC §2.5） ──
  async readCryptoMeta() {
    const raw = await this.store.readIfExists(this.paths().crypto);
    return raw === null ? null : parseCryptoMeta(raw);
  }
  /** store 是否已加密（有合法 crypto.json） */
  async storeEncrypted() {
    return await this.readCryptoMeta() !== null;
  }
  /** store 根目录是否存在于本机（设置页三态提示用） */
  async storeDirExists() {
    return this.store.storeDirExists(this.paths());
  }
  /** 确保密码可用：未存则弹输入框并验证；验证失败返回 null（调用方中止） */
  async ensurePassword(meta) {
    let password = this.store.storePassword();
    if (password !== null && await verifyPassword(meta, password)) return password;
    password = await promptStorePassword(this.app);
    if (password === null || password === "") return null;
    if (!await verifyPassword(meta, password)) {
      new import_obsidian11.Notice(t("\u5BC6\u7801\u4E0D\u6B63\u786E\u3002"));
      this.store.setStorePassword(null);
      return null;
    }
    this.store.setStorePassword(password);
    return password;
  }
  /** 设置页「录入密码」（仅应用设备，SPEC §4）：显式输入并验证，成功后本机记住 */
  async enterStorePassword() {
    const meta = await this.readCryptoMeta();
    if (meta === null) {
      new import_obsidian11.Notice(t("\u914D\u7F6E\u5E93\u672A\u52A0\u5BC6\uFF0C\u65E0\u9700\u5BC6\u7801\u3002"));
      return;
    }
    const password = await promptStorePassword(this.app);
    if (password === null || password === "") return;
    if (!await verifyPassword(meta, password)) {
      new import_obsidian11.Notice(t("\u5BC6\u7801\u4E0D\u6B63\u786E\u3002"));
      return;
    }
    this.store.setStorePassword(password);
    new import_obsidian11.Notice(t("\u5BC6\u7801\u5DF2\u9A8C\u8BC1\u5E76\u8BB0\u4F4F\uFF08\u53EA\u5B58\u672C\u673A\uFF09\u3002"));
  }
  /** 修改密码（仅同步设备；设置页调用）：解密池内全部密文 → 新密码重加密重写 */
  async changeStorePassword(oldPassword, newPassword) {
    const meta = await this.readCryptoMeta();
    if (meta === null) throw new Error("store not encrypted");
    if (!await verifyPassword(meta, oldPassword)) throw new WrongStorePasswordError();
    const paths = this.paths();
    await this.store.writeAtomic(paths.crypto, JSON.stringify(await createCryptoMeta(newPassword), null, "	"));
    await this.runSync(newPassword);
  }
  // ── 同步（SPEC §3.2，仅 PC + 仅同步设备；多主时间戳双向） ──
  async runSync(passwordOverride) {
    if (this.store.isMobile) {
      new import_obsidian11.Notice(t("\u624B\u673A\u7AEF\u53EA\u80FD\u5E94\u7528\u914D\u7F6E\uFF0C\u4E0D\u80FD\u540C\u6B65\u3002"));
      return;
    }
    if (this.config.preferredRole !== "sync") {
      new import_obsidian11.Notice(t("\u672C\u673A\u662F\u4EC5\u5E94\u7528\u8BBE\u5907\uFF0C\u4E0D\u80FD\u540C\u6B65\u3002\u53EF\u5728\u8BBE\u7F6E\u4E2D\u5207\u6362\u4E3A\u540C\u6B65\u8BBE\u5907\u3002"));
      return;
    }
    let password = passwordOverride != null ? passwordOverride : null;
    const meta = await this.readCryptoMeta();
    if (meta === null) {
      password = await promptNewStorePassword(this.app);
      if (password !== null) {
        await this.store.writeAtomic(
          this.paths().crypto,
          JSON.stringify(await createCryptoMeta(password), null, "	")
        );
        this.store.setStorePassword(password);
      }
    } else if (passwordOverride === void 0) {
      password = await this.ensurePassword(meta);
      if (password === null) return;
    }
    const service = new SyncService(this.store, this.paths(), {
      id: this.config.deviceId,
      name: this.effectiveDeviceName()
    }, {
      syncArtifacts: this.config.syncArtifacts,
      firstSyncDirection: () => this.promptFirstSyncDirection(),
      resolveConflicts: (files) => this.promptConflictResolution(files)
    });
    try {
      const report = await service.run(password);
      new import_obsidian11.Notice(
        t("\u540C\u6B65\u5B8C\u6210\uFF1A\u63A8\u9001 {pushed} \u9879\uFF0C\u62C9\u53D6 {pulled} \u9879\uFF0C\u5220\u9664 {deleted} \u9879\u3002", {
          pushed: report.pushed,
          pulled: report.pulled,
          deleted: report.tombstoned + report.deletedLocal + report.prunedMeta
        }) + (report.conflictsResolved === "local" ? t("\u51B2\u7A81\u5DF2\u6309\u672C\u673A\u89E3\u51B3\u3002") : report.conflictsResolved === "pool" ? t("\u51B2\u7A81\u5DF2\u6309\u6C60\u89E3\u51B3\u3002") : "") + (report.mobileProjection ? t("\u5DF2\u66F4\u65B0\u79FB\u52A8\u6295\u5F71\u3002") : "")
      );
    } catch (error) {
      if (error instanceof SyncAbortedError) return;
      if (error instanceof ClockSkewError) {
        new import_obsidian11.Notice(t("\u914D\u7F6E\u5E93\u7684\u65F6\u95F4\u6233\u6765\u81EA\u672A\u6765\uFF0C\u672C\u673A\u6216\u5BF9\u7AEF\u65F6\u949F\u53EF\u80FD\u4E0D\u51C6\u3002\u8BF7\u6821\u51C6\u7CFB\u7EDF\u65F6\u95F4\u540E\u91CD\u8BD5\u3002"));
        return;
      }
      new import_obsidian11.Notice(t("\u540C\u6B65\u5931\u8D25\uFF1A{message}", { message: error instanceof Error ? error.message : String(error) }));
    }
  }
  async promptFirstSyncDirection() {
    return chooseFromList(this.app, {
      title: t("\u9996\u6B21\u5728\u6B64\u8BBE\u5907\u540C\u6B65"),
      message: t(
        "\u914D\u7F6E\u5E93\u5DF2\u6709\u5185\u5BB9\uFF0C\u4F46\u672C\u673A\u8FD8\u6CA1\u6709\u540C\u6B65\u8BB0\u5F55\u3002\u4EE5\u54EA\u8FB9\u4E3A\u51C6\uFF1F\u672C\u673A\u591A\u51FA\u7684\u6587\u4EF6\u4F1A\u4FDD\u7559\uFF0C\u4E0B\u6B21\u540C\u6B65\u518D\u4E0A\u4F20\u3002"
      ),
      items: [],
      hint: t("\u76F4\u63A5\u5173\u95ED\u5F39\u7A97\u5373\u53D6\u6D88\u672C\u6B21\u540C\u6B65\u3002"),
      choices: [
        { label: t("\u7528\u672C\u673A\u8986\u76D6\u6C60"), value: "local-to-pool", destructive: true },
        { label: t("\u5148\u628A\u6C60\u5E94\u7528\u56DE\u672C\u673A"), value: "pool-to-local", cta: true }
      ]
    });
  }
  async promptConflictResolution(files) {
    return chooseFromList(this.app, {
      title: t("\u540C\u6B65\u51B2\u7A81"),
      message: t("\u4EE5\u4E0B\u6587\u4EF6\u5728\u672C\u673A\u548C\u914D\u7F6E\u5E93\u90FD\u6539\u8FC7\uFF0C\u9700\u8981\u4F60\u51B3\u5B9A\u4FDD\u7559\u54EA\u8FB9\uFF08\u5BF9\u6240\u6709\u5217\u51FA\u7684\u6587\u4EF6\u751F\u6548\uFF09\uFF1A"),
      items: files,
      hint: t("\u76F4\u63A5\u5173\u95ED\u5F39\u7A97\u5373\u53D6\u6D88\u672C\u6B21\u540C\u6B65\uFF0C\u4E24\u8FB9\u6539\u52A8\u90FD\u4FDD\u6301\u539F\u6837\u3002"),
      choices: [
        { label: t("\u4FDD\u7559\u672C\u673A\u7248\u672C"), value: "local", cta: true },
        { label: t("\u4FDD\u7559\u914D\u7F6E\u5E93\u7248\u672C"), value: "pool" }
      ]
    });
  }
  // ── 应用（SPEC §3.3） ──
  async runApply(name, platform) {
    const paths = this.paths();
    const raw = await this.store.readIfExists(`${paths.profilesDir}/${profileFileName(name, platform)}`);
    if (raw === null) {
      new import_obsidian11.Notice(t("\u627E\u4E0D\u5230 profile\uFF1A{name}", { name }));
      return;
    }
    const parsed = parseProfile(raw);
    if (!parsed.ok) {
      new import_obsidian11.Notice(t("profile \u6587\u4EF6\u635F\u574F\uFF1A{name}", { name }));
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
      const report = await service.run(parsed.profile, password, {
        installArtifacts: this.config.applyArtifacts
      });
      if (report.applied.length === 0 && report.missingPlugins.length === 0 && report.desktopOnlySkipped.length === 0) {
        new import_obsidian11.Notice(t("profile \u91CC\u6CA1\u6709\u52FE\u9009\u4EFB\u4F55\u5185\u5BB9\uFF1A{name}", { name }));
        return;
      }
      new ApplyResultModal(this.app, name, report, () => this.store.reloadApp()).open();
    } catch (error) {
      if (error instanceof WrongStorePasswordError) {
        this.store.setStorePassword(null);
        new import_obsidian11.Notice(t("\u5BC6\u7801\u4E0D\u6B63\u786E\u3002"));
        return;
      }
      new import_obsidian11.Notice(t("\u5E94\u7528\u5931\u8D25\uFF1A{message}", { message: error instanceof Error ? error.message : String(error) }));
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
      new import_obsidian11.Notice(t("\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A\uFF0C\u4E14\u4E0D\u80FD\u5305\u542B / \u6216 \\\u3002"));
      return false;
    }
    const existing = await this.listProfiles();
    if (existing.some((entry) => entry.name === normalized)) {
      new import_obsidian11.Notice(t("\u540C\u540D profile \u5DF2\u5B58\u5728\uFF1A{name}", { name: normalized }));
      return false;
    }
    await this.writeProfile(emptyProfile(normalized, "desktop"));
    if (adaptMobile) {
      await this.writeProfile(emptyProfile(normalized, "mobile"));
    }
    new import_obsidian11.Notice(t("\u5DF2\u521B\u5EFA profile\u3002\u91CD\u8F7D\u63D2\u4EF6\u540E\u65B0\u547D\u4EE4\u751F\u6548\u3002"));
    return true;
  }
  async deleteProfile(name, platform) {
    await this.store.deletePath(`${this.paths().profilesDir}/${profileFileName(name, platform)}`);
  }
  async renameProfile(from, to) {
    const normalized = normalizeProfileName(to);
    if (!isValidProfileName(to)) {
      new import_obsidian11.Notice(t("\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A\uFF0C\u4E14\u4E0D\u80FD\u5305\u542B / \u6216 \\\u3002"));
      return false;
    }
    if (normalized === from) return true;
    const existing = await this.listProfiles();
    if (existing.some((entry) => entry.name === normalized)) {
      new import_obsidian11.Notice(t("\u540C\u540D profile \u5DF2\u5B58\u5728\uFF1A{name}", { name: normalized }));
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
    const themes = /* @__PURE__ */ new Set();
    for (const dir of [this.store.obsidianPath("themes"), `${(platform === "mobile" ? pool.mobilePool : pool.pcPool).themes}`]) {
      const children = await this.store.listChildNames(dir);
      for (const name of children.files) themes.add(name);
      for (const name of children.folders) themes.add(name);
    }
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
    try {
      const doc = await this.readProfile(name, platform);
      if (doc === null) {
        new import_obsidian11.Notice(t("\u627E\u4E0D\u5230 profile\uFF1A{name}", { name }));
        return;
      }
      const data = await this.profileEditorData(platform);
      new ProfileEditModal(this, globalThis.structuredClone(doc), data).open();
    } catch (error) {
      new import_obsidian11.Notice(t("\u6253\u5F00\u7F16\u8F91\u5668\u5931\u8D25\uFF1A{message}", { message: error instanceof Error ? error.message : String(error) }));
    }
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
