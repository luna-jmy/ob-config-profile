import type { App } from "obsidian";
import { Notice, PluginSettingTab, Setting } from "obsidian";
import type ConfigProfilePlugin from "./main";
import { t } from "./i18n";
import { askConfirm } from "./modals/confirm";
import { promptChangeStorePassword } from "./modals/password";
import { promptText } from "./modals/text-input";
import { WrongStorePasswordError } from "./services/apply-service";
import type { ProfilePlatform } from "./store/profile";

/**
 * 设置页（SPEC §4）：通用 / 角色 / 加密 / Profiles 四区。
 * profile 小节与编辑 Modal 共用 renderProfileEditor 渲染（防两套真相）；
 * profile 管理写 store——手机端只显示提示，不提供操作（SPEC：手机只应用）。
 */
export class CPSettingTab extends PluginSettingTab {
	constructor(
		app: App,
		private readonly plugin: ConfigProfilePlugin,
	) {
		super(app, plugin);
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		this.renderGeneral(containerEl);
		this.renderRole(containerEl);
		void this.renderCrypto(containerEl);
		void this.renderProfiles(containerEl);
	}

	private renderGeneral(container: HTMLElement): void {
		new Setting(container).setName(t("通用")).setHeading();

		new Setting(container)
			.setName(t("配置库路径"))
			.setDesc(t("store 在 vault 内的路径（默认 SettingProfiles，vault 根）。修改后重载插件生效。"))
			.addText((text) =>
				text
					.setPlaceholder("SettingProfiles")
					.setValue(this.plugin.config.storePath)
					.onChange(async (value) => {
						this.plugin.config.storePath = value;
						await this.plugin.saveConfig();
					}),
			);

		new Setting(container)
			.setName(t("设备名"))
			.setDesc(t("显示在主配置归属提示里，帮助识别哪台设备持有主配置。"))
			.addText((text) =>
				text
					.setPlaceholder(this.plugin.effectiveDeviceName())
					.setValue(this.plugin.config.deviceName)
					.onChange(async (value) => {
						this.plugin.config.deviceName = value;
						await this.plugin.saveConfig();
					}),
			);

		new Setting(container).setName(t("语言")).addDropdown((drop) =>
			drop
				.addOptions({
					auto: t("跟随 Obsidian"),
					zh: t("中文"),
					en: t("English"),
				})
				.setValue(this.plugin.config.language)
				.onChange(async (value) => {
					this.plugin.config.language = value as (typeof this.plugin.config)["language"];
					await this.plugin.saveConfig();
					this.plugin.applyLanguage();
					this.display();
				}),
		);
	}

	private renderRole(container: HTMLElement): void {
		new Setting(container).setName(t("角色")).setHeading();

		const role = this.plugin.currentRole;
		const roleName =
			role.kind === "master" ? t("主配置") : role.kind === "apply" ? t("应用配置") : t("尚未设定");
		const holderDesc = role.holderName ? t("主配置持有者：{name}", { name: role.holderName }) : "";
		new Setting(container).setName(t("当前角色")).setDesc(holderDesc).then((s) => {
			s.controlEl.createSpan({ text: roleName });
		});

		if (role.kind === "master") {
			new Setting(container)
				.setName(t("让出主配置"))
				.then((s) => s.addButton((btn) => btn.setButtonText(t("让出主配置")).onClick(() => void this.releaseMaster(s))));
		} else {
			new Setting(container)
				.setName(t("夺取主配置"))
				.then((s) => s.addButton((btn) => btn.setButtonText(t("夺取主配置")).onClick(() => void this.claimMaster(s))));
		}
	}

	// ── 加密（SPEC §2.5：改密 / 启用仅主配置 PC 端） ──

	private async renderCrypto(container: HTMLElement): Promise<void> {
		new Setting(container).setName(t("加密")).setHeading();

		let encrypted = false;
		try {
			encrypted = await this.plugin.storeEncrypted();
		} catch {
			encrypted = false;
		}
		const canManage = !this.plugin.store.isMobile && this.plugin.currentRole.kind === "master";

		if (encrypted) {
			new Setting(container)
				.setName(t("配置库加密"))
				.setDesc(t("store 整库加密；密码只存各设备本地，不进 vault。"));
			if (canManage) {
				new Setting(container)
					.setName(t("修改密码"))
					.setDesc(t("池内全部密文会以新密码重新加密重写。"))
					.addButton((btn) => btn.setButtonText(t("修改密码")).onClick(() => void this.changePassword()));
			}
		} else {
			new Setting(container)
				.setName(t("配置库加密"))
				.setDesc(
					canManage
						? t("尚未加密。下次同步时可设置密码，store 将整库加密。")
						: t("尚未加密（主配置设备可在其设置中开启）。"),
				);
			if (canManage) {
				new Setting(container)
					.setName(t("启用加密"))
					.setDesc(t("设置密码并立即重新同步（整库加密）。"))
					.addButton((btn) => btn.setButtonText(t("启用加密")).onClick(() => void this.plugin.runSync()));
			}
		}
	}

	private async changePassword(): Promise<void> {
		const input = await promptChangeStorePassword(this.app);
		if (input === null) return;
		try {
			await this.plugin.changeStorePassword(input.oldPassword, input.newPassword);
			new Notice(t("密码已修改，池内密文已重写。"));
		} catch (error) {
			if (error instanceof WrongStorePasswordError) {
				new Notice(t("密码不正确。"));
				return;
			}
			new Notice(t("修改失败：{message}", { message: error instanceof Error ? error.message : String(error) }));
		}
	}

	// ── Profiles（PC 端管理；与编辑 Modal 共用渲染） ──

	private async renderProfiles(container: HTMLElement): Promise<void> {
		new Setting(container).setName(t("Profiles")).setHeading();

		if (this.plugin.store.isMobile) {
			new Setting(container).setDesc(t("profile 管理请到 PC 端（手机只应用配置）。"));
			return;
		}

		const profiles = await this.plugin.listProfiles();
		const names = [...new Set(profiles.map((entry) => entry.name))];

		new Setting(container)
			.setName(t("新建 profile"))
			.setDesc(t("创建后重载插件，应用命令即可用。"))
			.addButton((btn) => btn.setButtonText(t("新建")).setCta().onClick(() => void this.createProfile()));

		if (profiles.length === 0) {
			new Setting(container).setDesc(t("还没有 profile。新建一个，或在主配置端执行同步。"));
			return;
		}

		for (const name of names) {
			const desktop = profiles.find((entry) => entry.name === name && entry.platform === "desktop");
			const mobile = profiles.find((entry) => entry.name === name && entry.platform === "mobile");
			if (desktop) {
				this.renderProfileRow(container, name, "desktop", mobile !== null);
			}
			if (mobile) {
				this.renderProfileRow(container, name, "mobile", false);
			}
		}
	}

	private renderProfileRow(
		container: HTMLElement,
		name: string,
		platform: ProfilePlatform,
		hasMobileTwin: boolean,
	): void {
		const label = platform === "mobile" ? t("{name}（手机）", { name }) : name;
		const desc =
			platform === "mobile"
				? t("由同名桌面 profile 适配生成，跟随其更新。")
				: hasMobileTwin
					? t("已开启手机适配。")
					: "";
		const setting = new Setting(container).setName(label).setDesc(desc);
		if (platform === "desktop") {
			setting.addToggle((toggle) =>
				toggle
					.setValue(hasMobileTwin)
					.setTooltip(t("适配手机"))
					.onChange((value) => void this.setMobileAdaptation(name, value)),
			);
		}
		setting
			.addButton((btn) => btn.setButtonText(t("查看/编辑")).onClick(() => void this.plugin.openProfileEditor(name, platform)))
			.addButton((btn) => btn.setButtonText(t("重命名")).onClick(() => void this.renameProfile(name)))
			.addButton((btn) =>
				btn
					.setButtonText(t("删除"))
					.setDestructive()
					.onClick(() => void this.deleteProfile(name, platform)),
			);
	}

	private async createProfile(): Promise<void> {
		const name = await promptText(this.app, {
			title: t("新建 profile"),
			placeholder: t("名称"),
		});
		if (name === null) return;
		const adaptMobile = await askConfirm(this.app, {
			title: t("新建 profile"),
			message: t("为《{name}》同时生成手机适配 profile 吗？", { name }),
			acceptLabel: t("桌面 + 手机"),
			cancelLabel: t("仅桌面"),
		});
		const ok = await this.plugin.createProfile(name, adaptMobile);
		if (ok) this.display();
	}

	private async renameProfile(from: string): Promise<void> {
		const to = await promptText(this.app, {
			title: t("重命名 profile"),
			value: from,
		});
		if (to === null) return;
		const ok = await this.plugin.renameProfile(from, to);
		if (ok) this.display();
	}

	private async deleteProfile(name: string, platform: ProfilePlatform): Promise<void> {
		const label = platform === "mobile" ? t("{name}（手机）", { name }) : name;
		const confirmed = await askConfirm(this.app, {
			title: t("删除 profile"),
			message: t("确定删除《{label}》？此操作不可撤销。", { label }),
			acceptLabel: t("删除"),
			cancelLabel: t("取消"),
			acceptStyle: "warning",
		});
		if (!confirmed) return;
		await this.plugin.deleteProfile(name, platform);
		this.display();
	}

	private async setMobileAdaptation(name: string, enabled: boolean): Promise<void> {
		try {
			await this.plugin.setMobileAdaptation(name, enabled);
		} catch (error) {
			new Notice(t("操作失败：{message}", { message: error instanceof Error ? error.message : String(error) }));
		}
		this.display();
	}

	// ── 角色切换 ──

	private async claimMaster(setting: Setting): Promise<void> {
		const confirmed = await askConfirm(this.app, {
			title: t("夺取主配置"),
			message: t("将以本机身份接管 store 的主配置。原主配置设备会在下次操作前自动降级为应用配置。继续？"),
			acceptLabel: t("夺取主配置"),
			cancelLabel: t("取消"),
		});
		if (!confirmed) return;
		try {
			await this.plugin.claimMaster();
			this.display();
		} catch (error) {
			setting.setName(`${t("夺取或让出失败：{message}", { message: String(error) })}`);
		}
	}

	private async releaseMaster(setting: Setting): Promise<void> {
		const confirmed = await askConfirm(this.app, {
			title: t("让出主配置"),
			message: t("让出后 store 暂无主配置，所有设备都只能应用，直到有人重新夺取。继续？"),
			acceptLabel: t("让出主配置"),
			cancelLabel: t("取消"),
		});
		if (!confirmed) return;
		try {
			await this.plugin.releaseMaster();
			this.display();
		} catch (error) {
			setting.setName(`${t("夺取或让出失败：{message}", { message: String(error) })}`);
		}
	}
}
