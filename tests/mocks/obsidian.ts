/**
 * 测试用 obsidian 运行时桩：npm 的 obsidian 包只有 .d.ts 没有运行时入口，
 * vitest 解析不了 import "obsidian"——由 vitest.config 的 alias 指到本桩。
 * 类型检查仍走真实 obsidian.d.ts，这里只补运行时形状。
 * M0 的被测纯函数（store/lock、store/paths、types）不 import obsidian；
 * 后续里程碑测到 UI / adapter 时再按需补充桩形状。
 */

export {};
