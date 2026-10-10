/**
 * 测试用 obsidian 运行时桩：npm 的 obsidian 包只有 .d.ts 没有运行时入口，
 * vitest 解析不了 import "obsidian"——由 vitest.config 的 alias 指到本桩。
 * 类型检查仍走真实 obsidian.d.ts，这里只补运行时形状。
 * 被测纯函数（store/paths、store/profile 等）不 import obsidian；
 * config-adapter / services 用到 normalizePath 与 Platform，在此补桩。
 */

/** 对齐宿主行为口径：反斜杠归正、折叠重复斜杠、去首尾斜杠（不改大小写） */
export function normalizePath(path: string): string {
	return path.replace(/\\/g, "/").replace(/\/+/g, "/").replace(/^\/+|\/+$/g, "");
}

export const Platform = { isMobile: false };
