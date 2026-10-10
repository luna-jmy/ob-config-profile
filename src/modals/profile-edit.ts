import { Modal } from "obsidian";
import { t } from "../i18n";
import type { ProfileDoc } from "../store/profile";
import { renderProfileEditor } from "../ui/profile-editor";
import type { ProfileEditorData } from "../ui/profile-editor";
import type ConfigProfilePlugin from "../main";

/**
 * profile 查看/编辑弹窗（SPEC §3.4）：与设置页 profile 小节共用
 * renderProfileEditor 渲染；勾选即存（onProfileEdited 落盘并联动 mobile 派生）。
 */
export class ProfileEditModal extends Modal {
	private bodyEl!: HTMLElement;

	constructor(
		private readonly plugin: ConfigProfilePlugin,
		private readonly profile: ProfileDoc,
		private readonly data: ProfileEditorData,
	) {
		super(plugin.app);
	}

	onOpen(): void {
		this.contentEl.addClass("cp-modal");
		const title =
			this.profile.platform === "mobile"
				? t("编辑 profile：{name}（手机）", { name: this.profile.name })
				: t("编辑 profile：{name}", { name: this.profile.name });
		this.titleEl.setText(title);
		this.contentEl.createEl("p", {
			cls: "cp-modal__hint",
			text: t("勾选改动即时保存，无需手动确认。"),
		});
		this.bodyEl = this.contentEl.createDiv();
		this.renderEditor();
	}

	/** 全选等批量变化后整体重渲染（单行开关自己会更新，不触发） */
	private renderEditor(): void {
		renderProfileEditor(this.bodyEl, this.profile, this.data, {
			onChanged: async (changed) => {
				await this.plugin.onProfileEdited(changed);
			},
			onBulkChanged: () => this.renderEditor(),
		});
	}

	onClose(): void {
		this.contentEl.empty();
	}
}
