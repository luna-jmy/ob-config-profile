import type { App } from "obsidian";
import { ButtonComponent, Modal, Notice } from "obsidian";
import { t } from "../i18n";
import type { ApplyReport } from "../services/apply-service";

/**
 * 应用结果弹窗（SPEC §3.3 第 3/4 步）：已应用条目 + 缺失插件清单 +
 * 「重载 Obsidian」确认（默认主操作；不重载会被运行中插件的退出回写弄脏结果）。
 */
export class ApplyResultModal extends Modal {
	constructor(
		app: App,
		private readonly profileName: string,
		private readonly report: ApplyReport,
		private readonly reload: () => boolean,
	) {
		super(app);
	}

	onOpen(): void {
		this.contentEl.addClass("cp-modal");
		this.titleEl.setText(t("已应用 profile：{name}", { name: this.profileName }));

		const message =
			this.report.applied.length > 0
				? t("已应用 {count} 项。重载 Obsidian 使配置生效？", { count: this.report.applied.length })
				: t("没有可应用的条目。");
		this.contentEl.createEl("p", { cls: "cp-modal__message", text: message });

		this.contentEl.createEl("p", {
			cls: "cp-modal__hint",
			text: t("必须重载：运行中的插件退出时会把内存里的旧配置写回，不重载会覆盖刚应用的文件。"),
		});

		if (this.report.installedPlugins.length > 0) {
			const box = this.contentEl.createDiv();
			box.createEl("p", {
				cls: "cp-modal__hint",
				text: t("以下插件已从配置库装齐主体，重载后生效："),
			});
			const ul = box.createEl("ul");
			for (const id of this.report.installedPlugins) ul.createEl("li", { text: id });
		}
		if (this.report.missingPlugins.length > 0) {
			const box = this.contentEl.createDiv();
			box.createEl("p", {
				cls: "cp-modal__hint",
				text: t("以下插件本机未安装，已跳过（安装后重新应用即可）："),
			});
			const ul = box.createEl("ul");
			for (const id of this.report.missingPlugins) ul.createEl("li", { text: id });
		}
		if (this.report.desktopOnlySkipped.length > 0) {
			const box = this.contentEl.createDiv();
			box.createEl("p", { cls: "cp-modal__hint", text: t("以下插件为桌面专属，已从手机端剔除：") });
			const ul = box.createEl("ul");
			for (const id of this.report.desktopOnlySkipped) ul.createEl("li", { text: id });
		}

		if (this.report.applied.length === 0) {
			const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
			new ButtonComponent(buttons).setButtonText(t("关闭")).setCta().onClick(() => this.close());
			return;
		}

		const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
		new ButtonComponent(buttons)
			.setButtonText(t("稍后手动重载"))
			.onClick(() => this.close());
		new ButtonComponent(buttons)
			.setButtonText(t("立即重载"))
			.setCta()
			.onClick(() => {
				this.close();
				if (!this.reload()) {
					new Notice(t("无法自动重载，请手动重启 Obsidian（Ctrl/Cmd+R 或重启应用）。"));
				}
			});
	}

	onClose(): void {
		this.contentEl.empty();
	}
}
