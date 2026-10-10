import type { App } from "obsidian";
import { ButtonComponent, Modal } from "obsidian";
import { t } from "../i18n";
import type { DeviceRole } from "../store/role";

/**
 * 首次运行角色选择（SPEC §3.1）：只问一次，答案存本地偏好（preferredRole）。
 * **默认选中仅应用**（保守）；直接关掉（Esc / 遮罩）也按仅应用处理——fail-safe。
 */

export type FirstRunChoice = DeviceRole;

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
				"本机是「同步设备」（把本机 Obsidian 配置与配置库双向同步，可多台同时开启），还是「仅应用」（只应用配置库同步来的配置）？",
			),
		});
		this.contentEl.createEl("p", {
			cls: "cp-modal__hint",
			text: t("不确定就选仅应用——仅应用不会写入配置库，随时可以在设置里改。"),
		});

		const choices = this.contentEl.createDiv({ cls: "cp-first-run__choice" });

		// 仅应用是默认选项：排在前 + cta 高亮（SPEC §3.1 fail-safe）
		const apply = new ButtonComponent(choices)
			.setButtonText(t("本机为仅应用"))
			.onClick(() => this.answer("apply"));
		apply.buttonEl.addClass("cp-first-run__option");
		apply.setCta();

		const sync = new ButtonComponent(choices)
			.setButtonText(t("本机为同步设备（与配置库双向同步）"))
			.onClick(() => this.answer("sync"));
		sync.buttonEl.addClass("cp-first-run__option");
	}

	onClose(): void {
		this.contentEl.empty();
		// 直接关掉 = 按仅应用处理（fail-safe：不写配置库）
		if (!this.answered) this.onChoose("apply");
	}

	private answer(choice: FirstRunChoice): void {
		this.answered = true;
		this.close();
		this.onChoose(choice);
	}
}
