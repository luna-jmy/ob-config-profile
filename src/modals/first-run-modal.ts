import type { App } from "obsidian";
import { ButtonComponent, Modal } from "obsidian";
import { t } from "../i18n";

/**
 * 首次运行角色选择（SPEC §3.1 规则 1）：只在「真·全新」（无 lock 且池空）时出现，
 * **默认选中应用配置**（保守）；直接关掉（Esc / 遮罩）也按应用配置处理——fail-safe。
 */

export type FirstRunChoice = "master" | "apply";

export class FirstRunModal extends Modal {
	private answered = false;

	constructor(
		app: App,
		private readonly onChoose: (choice: FirstRunChoice) => void,
	) {
		super(app);
	}

	onOpen(): void {
		this.contentEl.addClass("cp-modal", "cp-first-run");
		this.titleEl.setText(t("选择本机角色"));
		this.contentEl.createEl("p", {
			cls: "cp-modal__message",
			text: t(
				"当前 vault 内没有发现配置库。本机是「主配置」（把本机 Obsidian 配置同步到 store），还是「应用配置」（只应用其他设备同步来的配置）？",
			),
		});
		this.contentEl.createEl("p", {
			cls: "cp-modal__hint",
			text: t("不确定就选应用配置——应用配置不会写入 store，随时可以在设置里改。"),
		});

		const choices = this.contentEl.createDiv({ cls: "cp-first-run__choice" });

		// 应用配置是默认选项：排在前 + cta 高亮（SPEC §3.1 fail-safe）
		const apply = new ButtonComponent(choices)
			.setButtonText(t("本机为应用配置"))
			.onClick(() => this.answer("apply"));
		apply.buttonEl.addClass("cp-first-run__option");
		apply.setCta();

		const master = new ButtonComponent(choices)
			.setButtonText(t("本机为主配置（同步本机配置到 store）"))
			.onClick(() => this.answer("master"));
		master.buttonEl.addClass("cp-first-run__option");
	}

	onClose(): void {
		this.contentEl.empty();
		// 直接关掉 = 按应用配置处理（fail-safe：不写 store）
		if (!this.answered) this.onChoose("apply");
	}

	private answer(choice: FirstRunChoice): void {
		this.answered = true;
		this.close();
		this.onChoose(choice);
	}
}
