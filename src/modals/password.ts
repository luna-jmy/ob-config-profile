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

/** 密码输入框的「眼睛」显隐切换（Setting 需先 addText，再追加该按钮） */
function addRevealToggle(setting: Setting, input: () => HTMLInputElement | null): void {
	let visible = false;
	setting.addExtraButton((btn) =>
		btn
			.setIcon("eye")
			.setTooltip(t("显示密码"))
			.onClick(() => {
				visible = !visible;
				const el = input();
				if (el) el.type = visible ? "text" : "password";
				btn.setIcon(visible ? "eye-off" : "eye").setTooltip(visible ? t("隐藏密码") : t("显示密码"));
			}),
	);
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

/** 修改密码（仅主配置）：currentPassword 预填本机记住的密码（小黑点 + 眼睛可见）。
 *  取消 / 关闭返回 null */
export function promptChangeStorePassword(
	app: App,
	currentPassword: string | null,
): Promise<{ oldPassword: string; newPassword: string } | null> {
	return new Promise((resolve) => {
		new ChangePasswordModal(app, currentPassword, resolve).open();
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

		const pwSetting = new Setting(this.contentEl).setName(t("密码"));
		pwSetting.addText((text) => {
			text.inputEl.type = "password";
			pwInput = text.inputEl;
		});
		addRevealToggle(pwSetting, () => pwInput);
		const pw2Setting = new Setting(this.contentEl).setName(t("再输一次"));
		pw2Setting.addText((text) => {
			text.inputEl.type = "password";
			pw2Input = text.inputEl;
		});
		addRevealToggle(pw2Setting, () => pw2Input);

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
		const pwSetting = new Setting(this.contentEl).setName(t("密码"));
		pwSetting.addText((text) => {
			text.inputEl.type = "password";
			pwInput = text.inputEl;
		});
		addRevealToggle(pwSetting, () => pwInput);

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
		private readonly currentPassword: string | null,
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
		const oldSetting = new Setting(this.contentEl).setName(t("当前密码"));
		if (this.currentPassword !== null) {
			oldSetting.setDesc(t("已自动填入本机记住的密码（点眼睛图标可查看）。"));
		}
		oldSetting.addText((text) => {
			text.inputEl.type = "password";
			if (this.currentPassword !== null) text.setValue(this.currentPassword);
			oldInput = text.inputEl;
		});
		addRevealToggle(oldSetting, () => oldInput);
		const newSetting = new Setting(this.contentEl).setName(t("新密码"));
		newSetting.addText((text) => {
			text.inputEl.type = "password";
			newInput = text.inputEl;
		});
		addRevealToggle(newSetting, () => newInput);
		const new2Setting = new Setting(this.contentEl).setName(t("再输一次新密码"));
		new2Setting.addText((text) => {
			text.inputEl.type = "password";
			new2Input = text.inputEl;
		});
		addRevealToggle(new2Setting, () => new2Input);

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
