import type { App } from "obsidian";
import { ButtonComponent, Modal, Notice, Setting } from "obsidian";
import { t } from "../i18n";

/**
 * 密码弹窗（SPEC §2.5）：
 * - promptNewStorePassword：主配置首次同步——设密码（两次输入）或「暂不加密」；
 * - promptStorePassword：应用端 / 密码缺失时录入（校验由调用方做，错则重新弹）。
 */

function readInputValue(input: HTMLInputElement | null): string {
	return input?.value ?? "";
}

export function promptNewStorePassword(app: App): Promise<string | null> {
	return new Promise((resolve) => {
		new NewPasswordModal(app, resolve).open();
	});
}

export function promptStorePassword(app: App): Promise<string | null> {
	return new Promise((resolve) => {
		new PasswordInputModal(app, resolve).open();
	});
}

/** 修改密码（仅主配置）：返回 {oldPassword, newPassword}；取消 / 关闭返回 null */
export function promptChangeStorePassword(app: App): Promise<{ oldPassword: string; newPassword: string } | null> {
	return new Promise((resolve) => {
		new ChangePasswordModal(app, resolve).open();
	});
}

class NewPasswordModal extends Modal {
	private answered = false;

	constructor(
		app: App,
		private readonly settle: (password: string | null) => void,
	) {
		super(app);
	}

	onOpen(): void {
		this.contentEl.addClass("cp-modal");
		this.titleEl.setText(t("为配置库设置密码"));
		this.contentEl.createEl("p", {
			cls: "cp-modal__message",
			text: t("store 将随你的笔记同步，插件配置里可能含 token 等敏感信息——默认整库加密，密码只存各设备本地，不进 vault。"),
		});

		let pwInput: HTMLInputElement | null = null;
		let pw2Input: HTMLInputElement | null = null;

		new Setting(this.contentEl)
			.setName(t("密码"))
			.addText((text) => {
				text.inputEl.type = "password";
				pwInput = text.inputEl;
			});
		new Setting(this.contentEl)
			.setName(t("再输一次"))
			.addText((text) => {
				text.inputEl.type = "password";
				pw2Input = text.inputEl;
			});

		const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
		new ButtonComponent(buttons)
			.setButtonText(t("暂不加密"))
			.setTooltip(t("store 以明文随笔记同步；后续可在设置里开启加密（触发一次重新同步）"))
			.onClick(() => {
				this.answered = true;
				this.settle(null);
				this.close();
			});
		new ButtonComponent(buttons)
			.setButtonText(t("启用加密"))
			.setCta()
			.onClick(() => {
				const pw = readInputValue(pwInput);
				if (pw === "" || pw !== readInputValue(pw2Input)) {
					new Notice(t("两次输入不一致或为空。"));
					return;
				}
				this.answered = true;
				this.settle(pw);
				this.close();
			});
	}

	onClose(): void {
		this.contentEl.empty();
		// 直接关掉 = 本次同步暂不加密（不阻塞首次同步，SPEC fail-safe 精神：先能干活）
		if (!this.answered) this.settle(null);
	}
}

class PasswordInputModal extends Modal {
	private answered = false;

	constructor(
		app: App,
		private readonly settle: (password: string | null) => void,
	) {
		super(app);
	}

	onOpen(): void {
		this.contentEl.addClass("cp-modal");
		this.titleEl.setText(t("输入配置库密码"));
		this.contentEl.createEl("p", {
			cls: "cp-modal__message",
			text: t("这个配置库已加密。输入主配置设备设置的密码以继续，验证通过后本机记住密码。"),
		});

		let pwInput: HTMLInputElement | null = null;
		new Setting(this.contentEl).setName(t("密码")).addText((text) => {
			text.inputEl.type = "password";
			pwInput = text.inputEl;
		});

		const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
		new ButtonComponent(buttons)
			.setButtonText(t("取消"))
			.onClick(() => {
				this.answered = true;
				this.settle(null);
				this.close();
			});
		new ButtonComponent(buttons)
			.setButtonText(t("确认"))
			.setCta()
			.onClick(() => {
				this.answered = true;
				this.settle(readInputValue(pwInput));
				this.close();
			});
	}

	onClose(): void {
		this.contentEl.empty();
		if (!this.answered) this.settle(null);
	}
}

class ChangePasswordModal extends Modal {
	private answered = false;

	constructor(
		app: App,
		private readonly settle: (result: { oldPassword: string; newPassword: string } | null) => void,
	) {
		super(app);
	}

	onOpen(): void {
		this.contentEl.addClass("cp-modal");
		this.titleEl.setText(t("修改配置库密码"));
		this.contentEl.createEl("p", {
			cls: "cp-modal__message",
			text: t("池内全部密文会以新密码重新加密并重写，其他设备下次应用时输入新密码即可。"),
		});

		let oldInput: HTMLInputElement | null = null;
		let newInput: HTMLInputElement | null = null;
		let new2Input: HTMLInputElement | null = null;
		new Setting(this.contentEl).setName(t("当前密码")).addText((text) => {
			text.inputEl.type = "password";
			oldInput = text.inputEl;
		});
		new Setting(this.contentEl).setName(t("新密码")).addText((text) => {
			text.inputEl.type = "password";
			newInput = text.inputEl;
		});
		new Setting(this.contentEl).setName(t("再输一次新密码")).addText((text) => {
			text.inputEl.type = "password";
			new2Input = text.inputEl;
		});

		const buttons = this.contentEl.createDiv({ cls: "cp-modal__buttons" });
		new ButtonComponent(buttons).setButtonText(t("取消")).onClick(() => {
			this.answered = true;
			this.settle(null);
			this.close();
		});
		new ButtonComponent(buttons)
			.setButtonText(t("确认修改"))
			.setCta()
			.onClick(() => {
				const newPassword = readInputValue(newInput);
				if (newPassword === "" || newPassword !== readInputValue(new2Input)) {
					new Notice(t("两次输入不一致或为空。"));
					return;
				}
				this.answered = true;
				this.settle({ oldPassword: readInputValue(oldInput), newPassword });
				this.close();
			});
	}

	onClose(): void {
		this.contentEl.empty();
		if (!this.answered) this.settle(null);
	}
}
