import type { App } from "obsidian";
import { ButtonComponent, Modal } from "obsidian";

/**
 * 通用「清单 + 多选一」弹窗：同步冲突裁决、首次同步方向确认共用。
 * 文案由调用方传（先过自己仓的 t()）；Esc / 关掉 = null（调用方按取消处理）。
 */

export interface ChoiceOption<T> {
	label: string;
	value: T;
	cta?: boolean;
	destructive?: boolean;
	tooltip?: string;
}

export interface ChoiceListOptions<T> {
	title: string;
	message: string;
	/** 条目清单（文件路径等）；空数组则不渲染列表 */
	items: string[];
	choices: ChoiceOption<T>[];
	hint?: string;
}

export function chooseFromList<T>(app: App, options: ChoiceListOptions<T>): Promise<T | null> {
	return new Promise((resolve) => {
		new ChoiceListModal(app, options, resolve).open();
	});
}

class ChoiceListModal<T> extends Modal {
	private answered = false;

	constructor(
		app: App,
		private readonly options: ChoiceListOptions<T>,
		private readonly settle: (value: T | null) => void,
	) {
		super(app);
	}

	onOpen(): void {
		this.contentEl.addClass("cp-modal");
		this.titleEl.setText(this.options.title);
		this.contentEl.createEl("p", { cls: "cp-modal__message", text: this.options.message });

		if (this.options.items.length > 0) {
			const ul = this.contentEl.createEl("ul", { cls: "cp-modal__list" });
			for (const item of this.options.items) ul.createEl("li", { text: item });
		}
		if (this.options.hint) {
			this.contentEl.createEl("p", { cls: "cp-modal__hint", text: this.options.hint });
		}

		const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
		for (const choice of this.options.choices) {
			const btn = new ButtonComponent(buttons)
				.setButtonText(choice.label)
				.onClick(() => {
					this.answered = true;
					this.settle(choice.value);
					this.close();
				});
			if (choice.tooltip) btn.setTooltip(choice.tooltip);
			if (choice.destructive) btn.setDestructive();
			else if (choice.cta) btn.setCta();
		}
	}

	onClose(): void {
		this.contentEl.empty();
		if (!this.answered) this.settle(null);
	}
}
