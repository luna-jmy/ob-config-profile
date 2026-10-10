import { Setting } from "obsidian";
import { t } from "../i18n";
import { APP_FILES, appFileLabel, isMobileAllowedAppFile } from "../store/items";
import type { ProfileDoc } from "../store/profile";

/**
 * profile 编辑器（SPEC §3.4 / §4）：设置页的 profile 小节与「查看/编辑」Modal
 * **共用这一份渲染**——防两套真相。勾选改动即回调（由调用方决定落盘时机）。
 */

export interface PluginOption {
	id: string;
	name: string;
	isDesktopOnly: boolean;
}

export interface ProfileEditorData {
	/** 本机已安装 + 池内出现的插件（并集，由调用方备好） */
	plugins: PluginOption[];
	/** 本机 + 池内 snippets 文件名并集 */
	snippets: string[];
	/** 本机 + 池内 themes 文件名并集 */
	themes: string[];
}

export interface ProfileEditorHost {
	/** 勾选变化（doc 已就地修改）；返回 Promise 由调用方落盘 */
	onChanged(doc: ProfileDoc): Promise<void>;
}

function toggleRow(
	container: HTMLElement,
	label: string,
	checked: boolean,
	onChange: (value: boolean) => void,
	extra?: string,
): void {
	const setting = new Setting(container).setName(label);
	if (extra) setting.setDesc(extra);
	setting.addToggle((toggle) => toggle.setValue(checked).onChange(onChange));
}

function groupHeading(container: HTMLElement, name: string): void {
	new Setting(container).setName(name).setHeading();
}

export function renderProfileEditor(
	container: HTMLElement,
	doc: ProfileDoc,
	data: ProfileEditorData,
	host: ProfileEditorHost,
): void {
	container.empty();

	const isMobileDoc = doc.platform === "mobile";
	if (isMobileDoc) {
		container.createEl("p", {
			cls: "cp-modal__hint",
			text: t("移动 profile 仅包含核心插件开关与插件配置；外观、主题、快捷键等 app 设置不会应用到手机。"),
		});
	}

	// ── app 设置 ──
	groupHeading(container, t("App 设置"));
	for (const spec of APP_FILES) {
		if (isMobileDoc && !isMobileAllowedAppFile(spec.file)) continue;
		toggleRow(
			container,
			t(spec.label),
			doc.app.includes(spec.file),
			(value) => {
				doc.app = value
					? [...doc.app, spec.file]
					: doc.app.filter((file) => file !== spec.file);
				void host.onChanged(globalThis.structuredClone(doc));
			},
		);
	}

	// ── 社区插件 ──
	groupHeading(container, t("社区插件"));
	for (const plugin of data.plugins) {
		const label = plugin.name === plugin.id ? plugin.id : `${plugin.name}（${plugin.id}）`;
		const extra = plugin.isDesktopOnly ? t("桌面专属，不进移动 profile") : undefined;
		toggleRow(container, label, doc.plugins.includes(plugin.id), (value) => {
			doc.plugins = value ? [...doc.plugins, plugin.id] : doc.plugins.filter((id) => id !== plugin.id);
			void host.onChanged(globalThis.structuredClone(doc));
		}, extra);
	}

	// ── 片段 / 主题（mobile profile 没有这两组） ──
	if (!isMobileDoc) {
		groupHeading(container, t("CSS 片段"));
		for (const name of data.snippets) {
			toggleRow(container, name, doc.snippets.includes(name), (value) => {
				doc.snippets = value ? [...doc.snippets, name] : doc.snippets.filter((item) => item !== name);
				void host.onChanged(globalThis.structuredClone(doc));
			});
		}
		groupHeading(container, t("主题"));
		for (const name of data.themes) {
			toggleRow(container, name, doc.themes.includes(name), (value) => {
				doc.themes = value ? [...doc.themes, name] : doc.themes.filter((item) => item !== name);
				void host.onChanged(globalThis.structuredClone(doc));
			});
		}
	}
}

/** app 文件显示名（结果弹窗等处复用） */
export function appFileDisplayName(file: string): string {
	return t(appFileLabel(file));
}
