import type { App } from "obsidian";
import { ButtonComponent, Modal } from "obsidian";

/**
 * Promise 式确认模态（ob-tdk-general shared/ts/ui/confirm.ts 的 cp- 版）。
 *
 * 对外只暴露 Promise：调用方写起来是 `await`，不必再套一层回调——
 * 回调套回调最容易出「点了取消但外层已经把改动写下去了」这类错。
 *
 * 不使用 `window.confirm`：原生对话框会阻塞主线程，且样式与主题无关。
 * 样式见 styles.css 的 .cp-modal / .cp-modal__message / .cp-modal__buttons。
 */

export interface ConfirmOptions {
	/** 标题 */
	title: string;
	/** 正文（占位符由调用方先替换好再传） */
	message: string;
	/** 确认按钮文案 */
	acceptLabel: string;
	/** 取消按钮文案 */
	cancelLabel: string;
	/** 确认按钮样式：cta（主操作）/ warning（危险操作），默认 cta */
	acceptStyle?: "cta" | "warning";
}

class ConfirmModal extends Modal {
	private answered = false;

	constructor(
		app: App,
		private readonly options: ConfirmOptions,
		private readonly settle: (confirmed: boolean) => void,
	) {
		super(app);
	}

	onOpen(): void {
		this.contentEl.addClass("cp-modal");
		this.titleEl.setText(this.options.title);
		this.contentEl.createEl("p", {
			cls: "cp-modal__message",
			text: this.options.message,
		});

		const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
		new ButtonComponent(buttons)
			.setButtonText(this.options.cancelLabel)
			.onClick(() => this.close());
		const accept = new ButtonComponent(buttons)
			.setButtonText(this.options.acceptLabel)
			.onClick(() => {
				this.answered = true;
				this.settle(true);
				this.close();
			});
		if (this.options.acceptStyle === "warning") accept.setDestructive();
		else accept.setCta();
	}

	onClose(): void {
		this.contentEl.empty();
		// 直接关掉（点遮罩、按 Esc）= 取消，外层不必再判一次
		if (!this.answered) this.settle(false);
	}
}

/** 询问确认；关闭模态（Esc / 遮罩）= 拒绝。文案由调用方传（先过一遍自己仓的 t()）。 */
export function askConfirm(app: App, options: ConfirmOptions): Promise<boolean> {
	return new Promise((resolve) => {
		new ConfirmModal(app, options, resolve).open();
	});
}
