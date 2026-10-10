import { Setting } from "obsidian";
import { t } from "../i18n";
import { APP_FILES, appFileLabel, isMobileAllowedAppFile } from "../store/items";
import type { ProfileDoc } from "../store/profile";

/**
 * profile 编辑器（SPEC §3.4 / §4）：设置页的 profile 小节与「查看/编辑」Modal
 * **共用这一份渲染**——防两套真相。勾选改动即回调（由调用方决定落盘时机）。
 * 分组用原生 details/summary 折叠（组太长）；全选开关落盘后由 onBulkChanged 整体重渲染。
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
	/** 本机 + 池内主题名并集（松散 css 文件名或文件夹主题名） */
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

/** 折叠分组：summary 是组名，返回组体容器（行渲染进去）；open 透传旧状态（批量重渲染不丢折叠） */
function collapsibleGroup(container: HTMLElement, name: string, open = true): HTMLElement {
	const details = container.createEl("details", { cls: "cp-editor__group" });
	details.open = open;
	details.createEl("summary", { text: name });
	return details.createDiv({ cls: "cp-editor__group-body" });
}

/** 组体首行：全选开关 + 「已选 N/M」计数（点一下全开/全关，单次落盘） */
function groupHeader<T>(
	body: HTMLElement,
	items: readonly T[],
	isSelected: (item: T) => boolean,
	selectAll: (selected: boolean) => void,
): void {
	if (items.length === 0) {
		new Setting(body).setName(t("全选")).setDesc(t("暂无条目"));
		return;
	}
	const selected = items.filter(isSelected).length;
	new Setting(body)
		.setName(t("全选"))
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
	// 整体重渲染（全选）前记录各组折叠状态，重建后恢复——别把用户收起的组弹开
	const foldState = new Map<string, boolean>();
	for (const details of Array.from(container.querySelectorAll<HTMLDetailsElement>("details.cp-editor__group"))) {
		const key = details.querySelector("summary")?.textContent ?? "";
		if (key !== "") foldState.set(key, details.open);
	}
	container.empty();
	const wasOpen = (name: string): boolean => foldState.get(name) ?? true;

	const isMobileDoc = doc.platform === "mobile";
	if (isMobileDoc) {
		container.createEl("p", {
			cls: "cp-modal__hint",
			text: t("移动 profile 仅包含核心插件开关与插件配置；外观、主题、快捷键等 app 设置不会应用到手机。"),
		});
	}

	// ── app 设置 ──
	const appBody = collapsibleGroup(container, t("App 设置"), wasOpen(t("App 设置")));
	const appSpecs = APP_FILES.filter((spec) => !isMobileDoc || isMobileAllowedAppFile(spec.file));
	groupHeader(
		appBody,
		appSpecs,
		(spec) => doc.app.includes(spec.file),
		(on) => {
			doc.app = on ? appSpecs.map((spec) => spec.file) : [];
			void host.onChanged(globalThis.structuredClone(doc)).then(() => host.onBulkChanged?.());
		},
	);
	for (const spec of appSpecs) {
		toggleRow(
			appBody,
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
	const pluginBody = collapsibleGroup(container, t("社区插件"), wasOpen(t("社区插件")));
	groupHeader(
		pluginBody,
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
		toggleRow(pluginBody, label, doc.plugins.includes(plugin.id), (value) => {
			doc.plugins = value ? [...doc.plugins, plugin.id] : doc.plugins.filter((id) => id !== plugin.id);
			void host.onChanged(globalThis.structuredClone(doc));
		}, extra);
	}

	// ── 片段 / 主题（mobile profile 没有这两组） ──
	if (!isMobileDoc) {
		const snippetBody = collapsibleGroup(container, t("CSS 片段"), wasOpen(t("CSS 片段")));
		groupHeader(
			snippetBody,
			data.snippets,
			(name) => doc.snippets.includes(name),
			(on) => {
				doc.snippets = on ? [...data.snippets] : [];
				void host.onChanged(globalThis.structuredClone(doc)).then(() => host.onBulkChanged?.());
			},
		);
		for (const name of data.snippets) {
			toggleRow(snippetBody, name, doc.snippets.includes(name), (value) => {
				doc.snippets = value ? [...doc.snippets, name] : doc.snippets.filter((item) => item !== name);
				void host.onChanged(globalThis.structuredClone(doc));
			});
		}

		const themeBody = collapsibleGroup(container, t("主题"), wasOpen(t("主题")));
		groupHeader(
			themeBody,
			data.themes,
			(name) => doc.themes.includes(name),
			(on) => {
				doc.themes = on ? [...data.themes] : [];
				void host.onChanged(globalThis.structuredClone(doc)).then(() => host.onBulkChanged?.());
			},
		);
		for (const name of data.themes) {
			toggleRow(themeBody, name, doc.themes.includes(name), (value) => {
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
