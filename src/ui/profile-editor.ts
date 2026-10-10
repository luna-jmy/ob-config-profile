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
	/** 全选/全关等批量变化落盘后调用；调用方应重渲染编辑器刷新各行与计数 */
	onBulkChanged?(): void;
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

/** 分组标题行：带「已选 N/M」计数与全选开关（点一下全开/全关，单次落盘） */
function groupHeader<T>(
	container: HTMLElement,
	name: string,
	items: readonly T[],
	isSelected: (item: T) => boolean,
	selectAll: (selected: boolean) => void,
): void {
	const setting = new Setting(container).setName(name).setHeading();
	if (items.length === 0) return;
	const selected = items.filter(isSelected).length;
	setting
		.setDesc(t("已选 {selected}/{total}", { selected, total: items.length }))
		.addToggle((toggle) =>
			toggle
				.setValue(selected === items.length)
				.setTooltip(t("全选"))
				.onChange((value) => selectAll(value)),
		);
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
	const appSpecs = APP_FILES.filter((spec) => !isMobileDoc || isMobileAllowedAppFile(spec.file));
	groupHeader(
		container,
		t("App 设置"),
		appSpecs,
		(spec) => doc.app.includes(spec.file),
		(on) => {
			doc.app = on ? appSpecs.map((spec) => spec.file) : [];
			void host.onChanged(globalThis.structuredClone(doc)).then(() => host.onBulkChanged?.());
		},
	);
	for (const spec of appSpecs) {
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
	groupHeader(
		container,
		t("社区插件"),
		data.plugins,
		(plugin) => doc.plugins.includes(plugin.id),
		(on) => {
			doc.plugins = on ? data.plugins.map((plugin) => plugin.id) : [];
			void host.onChanged(globalThis.structuredClone(doc)).then(() => host.onBulkChanged?.());
		},
	);
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
		groupHeader(
			container,
			t("CSS 片段"),
			data.snippets,
			(name) => doc.snippets.includes(name),
			(on) => {
				doc.snippets = on ? [...data.snippets] : [];
				void host.onChanged(globalThis.structuredClone(doc)).then(() => host.onBulkChanged?.());
			},
		);
		for (const name of data.snippets) {
			toggleRow(container, name, doc.snippets.includes(name), (value) => {
				doc.snippets = value ? [...doc.snippets, name] : doc.snippets.filter((item) => item !== name);
				void host.onChanged(globalThis.structuredClone(doc));
			});
		}
		groupHeader(
			container,
			t("主题"),
			data.themes,
			(name) => doc.themes.includes(name),
			(on) => {
				doc.themes = on ? [...data.themes] : [];
				void host.onChanged(globalThis.structuredClone(doc)).then(() => host.onBulkChanged?.());
			},
		);
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
