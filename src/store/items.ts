/**
 * 可同步条目清单（纯函数）：app 级文件、排除规则（SPEC §0.5 / §0.6 / §9.3 裁决）。
 */

/** 本插件自身永不同步（data.json 里有角色与路径，同步过去就是鸡生蛋——SPEC §0.6） */
export const SELF_PLUGIN_ID = "config-profile";

/** 插件目录入池时排除的三件安装产物（SPEC §9.3 裁决，2026-10-09） */
export const INSTALL_ARTIFACTS: ReadonlySet<string> = new Set(["main.js", "styles.css", "manifest.json"]);

export interface AppFileSpec {
	/** `.obsidian/` 下的文件名 */
	file: string;
	/** 中文原文即 i18n 键 */
	label: string;
}

/** app 级可同步文件（SPEC §2.1；workspace.json / core-plugins-migration.json 永不进池） */
export const APP_FILES: readonly AppFileSpec[] = [
	{ file: "app.json", label: "编辑器与文件设置" },
	{ file: "appearance.json", label: "外观" },
	{ file: "hotkeys.json", label: "快捷键" },
	{ file: "core-plugins.json", label: "核心插件开关" },
	{ file: "community-plugins.json", label: "社区插件启用列表" },
	{ file: "graph.json", label: "关系图设置" },
	{ file: "bookmarks.json", label: "书签" },
];

/** mobile profile 允许的 app 文件（SPEC §2.3：仅核心插件开关与启用列表） */
export const MOBILE_ALLOWED_APP_FILES: readonly string[] = ["core-plugins.json", "community-plugins.json"];

export function appFileLabel(file: string): string {
	return APP_FILES.find((spec) => spec.file === file)?.label ?? file;
}

export function isKnownAppFile(file: string): boolean {
	return APP_FILES.some((spec) => spec.file === file);
}

export function isMobileAllowedAppFile(file: string): boolean {
	return MOBILE_ALLOWED_APP_FILES.includes(file);
}

/** 插件目录内是否为应带走的文件（排除安装产物） */
export function isCarryablePluginFile(fileName: string): boolean {
	return !INSTALL_ARTIFACTS.has(fileName);
}
