import type { App } from "obsidian";
import { ButtonComponent, Modal, Setting } from "obsidian";
import { t } from "../i18n";

/**
 * 单行文本输入弹窗（新建 / 重命名 profile 用）。
 * 空输入不落盘；直接关掉 = 取消（null）。
 */

export interface TextInputOptions {
	title: string;
	placeholder?: string;
	/** 预填文本（重命名时传旧名） */
	value?: string;
	acceptLabel?: string;
}

export function promptText(app: App, options: TextInputOptions): Promise<string | null> {
	return new Promise((resolve) => {
		new TextInputModal(app, options, resolve).open();
	});
}

class TextInputModal extends Modal {
	private answered = false;

	constructor(
		app: App,
		private readonly options: TextInputOptions,
		private readonly settle: (value: string | null) => void,
	) {
		super(app);
	}

	onOpen(): void {
		this.contentEl.addClass("cp-modal");
		this.titleEl.setText(this.options.title);
		let input: HTMLInputElement | null = null;
		new Setting(this.contentEl)
			.setName(this.options.title)
			.addText((text) => {
				if (this.options.placeholder) text.setPlaceholder(this.options.placeholder);
				if (this.options.value !== undefined) text.setValue(this.options.value);
				input = text.inputEl;
				// 回车即确认（单行输入的习惯路径）
				input.addEventListener("keydown", (event) => {
					if (event.key === "Enter") this.accept(input);
				});
			});

		const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
		new ButtonComponent(buttons).setButtonText(t("取消")).onClick(() => {
			this.answered = true;
			this.settle(null);
			this.close();
		});
		new ButtonComponent(buttons)
			.setButtonText(this.options.acceptLabel ?? t("确认"))
			.setCta()
			.onClick(() => this.accept(input));
	}

	private accept(input: HTMLInputElement | null): void {
		const value = (input?.value ?? "").trim();
		if (value === "") return;
		this.answered = true;
		this.settle(value);
		this.close();
	}

	onClose(): void {
		this.contentEl.empty();
		if (!this.answered) this.settle(null);
	}
}
