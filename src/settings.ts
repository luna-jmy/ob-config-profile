import type { App } from "obsidian";
import { PluginSettingTab, Setting } from "obsidian";
import type ConfigProfilePlugin from "./main";
import { t } from "./i18n";
import { askConfirm } from "./modals/confirm";

/**
 * 设置页（SPEC §4）：M0 只有通用区 + 角色区；profile 小节在 M1 加入
 * （与编辑 Modal 共用同一渲染函数，防两套真相）。
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
		const holderDesc =
			role.kind === "apply" && role.reason === "other-device" && role.holderName
				? t("主配置持有者：{name}", { name: role.holderName })
				: "";
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
