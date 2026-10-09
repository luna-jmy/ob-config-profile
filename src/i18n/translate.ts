/**
 * 翻译核心（纯函数）：中文是源，键就是中文原文；英文查 en.ts 字典。
 * 语言解析顺序：显式设置 > Obsidian 界面语言（localeProvider）> 中文。
 * 带占位符：t(key, { name }) 形式按字面替换 {name}（shared kit 同款）。
 */

export type Language = "zh" | "en";
export type LanguageSetting = "auto" | "zh" | "en";

/** 中文文案 → 目标语言文案。键即中文原文。 */
export type TranslateTable = Record<string, string>;

/** 纯查表 + 参数替换。查不到时回退键本身（中文口径下即原文）。 */
function translate(table: TranslateTable, key: string, params?: Record<string, string | number>): string {
	let text = table[key] ?? key;
	if (params) {
		for (const [name, value] of Object.entries(params)) {
			text = text.replaceAll(`{${name}}`, String(value));
		}
	}
	return text;
}

import { EN } from "./en";

let currentSetting: LanguageSetting = "auto";
let localeProvider: () => string | undefined = () => undefined;

export function setLanguage(setting: LanguageSetting, provider?: () => string | undefined): void {
	currentSetting = setting;
	if (provider) localeProvider = provider;
}

export function effectiveLanguage(): Language {
	if (currentSetting === "zh" || currentSetting === "en") return currentSetting;
	const locale = localeProvider();
	if (locale && locale.toLowerCase().startsWith("zh")) return "zh";
	return locale ? "en" : "zh";
}

/** 取文案：英文模式下查字典，查不到回退中文原文（键）；占位符在两种语言下都替换。 */
export function t(key: string, params?: Record<string, string | number>): string {
	const table = effectiveLanguage() === "en" ? EN : {};
	return translate(table, key, params);
}
