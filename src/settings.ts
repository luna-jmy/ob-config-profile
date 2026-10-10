import type { App } from "obsidian";
import { Notice, PluginSettingTab, Setting } from "obsidian";
import type ConfigProfilePlugin from "./main";
import { t } from "./i18n";
import { askConfirm } from "./modals/confirm";
import { promptChangeStorePassword } from "./modals/password";
import { promptText } from "./modals/text-input";
import { WrongStorePasswordError } from "./services/apply-service";

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
			.setDesc(t("仅作来源标注：显示在同步记录与冲突提示里，说明配置来自哪台设备；不参与同步匹配。"))
			.addText((text) =>
				text
					.setPlaceholder(this.plugin.effectiveDeviceName())
					.setValue(this.plugin.config.deviceName)
					.onChange(async (value) => {
						this.plugin.config.deviceName = value;
						await this.plugin.saveConfig();
					}),
			);

		// 「同步插件主体」按角色分两侧：PC 同步设备 = 上传侧；仅应用设备/手机 = 应用侧
		if (!this.plugin.store.isMobile && this.plugin.config.preferredRole === "sync") {
			new Setting(container)
				.setName(t("同步插件主体"))
				.setDesc(
					t("把插件的 main.js / styles.css / manifest.json 一并明文同步（不加密）。开启后应用端可直接装齐缺失插件；下次同步生效。"),
				)
				.addToggle((toggle) =>
					toggle.setValue(this.plugin.config.syncArtifacts).onChange(async (value) => {
						this.plugin.config.syncArtifacts = value;
						await this.plugin.saveConfig();
					}),
				);
		} else {
			new Setting(container)
				.setName(t("同步插件主体"))
				.setDesc(
					t("开启后应用时把池里的插件主体（main.js / styles.css / manifest.json）连同配置一起写入，未安装的插件直接装齐，重载后生效；关闭则只应用配置，未安装的插件跳过。"),
				)
				.addToggle((toggle) =>
					toggle.setValue(this.plugin.config.applyArtifacts).onChange(async (value) => {
						this.plugin.config.applyArtifacts = value;
						await this.plugin.saveConfig();
					}),
				);
		}

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

		const isSync = this.plugin.config.preferredRole === "sync";
		const roleName = isSync ? t("同步设备") : this.plugin.config.preferredRole === "apply" ? t("仅应用") : t("尚未设定");
		new Setting(container)
			.setName(t("当前角色"))
			.setDesc(t("同步设备可与配置库双向同步（多台可同时开启）；仅应用只覆盖本机，不写配置库。"))
			.then((s) => {
				s.controlEl.createSpan({ text: roleName });
			});

		new Setting(container)
			.setName(t("切换角色"))
			.setDesc(t("切换后立即生效，无需重载。"))
			.addToggle((toggle) =>
				toggle
					.setValue(isSync)
					.setTooltip(t("开 = 同步设备，关 = 仅应用"))
					.onChange((value) =>
						void this.plugin.setRole(value ? "sync" : "apply").then(() => this.display()),
					),
			);
	}

	// ── 加密（SPEC §2.5：改密 / 启用仅同步设备 PC 端） ──

	private async renderCrypto(container: HTMLElement): Promise<void> {
		let encrypted = false;
		try {
			encrypted = await this.plugin.storeEncrypted();
		} catch {
			encrypted = false;
		}
		const canManage = !this.plugin.store.isMobile && this.plugin.config.preferredRole === "sync";

		if (!canManage) {
			// 仅应用设备：无加密管理权。三态明示，绝不静默隐藏（否则用户找不到录入密码的入口）：
			// store 已加密 → 「录入同步密码」动作行；store 在但未加密 → 无需密码；store 目录缺失 → 提示同步/查路径
			new Setting(container).setName(t("加密")).setHeading();
			if (encrypted) {
				new Setting(container)
					.setName(t("录入同步密码"))
					.setDesc(t("输入同步设备设置的密码以解密配置库；验证通过后本机记住（只存本机，不进 vault）。"))
					.addButton((btn) => btn.setButtonText(t("录入同步密码")).onClick(() => void this.plugin.enterStorePassword()));
				return;
			}
			const storeExists = await this.plugin.storeDirExists();
			new Setting(container)
				.setName(t("录入同步密码"))
				.setDesc(
					storeExists
						? t("配置库未加密，无需密码。")
						: t("未找到配置库（{path}）。请确认配置库已随笔记同步到本机，且路径与同步设备一致。", {
								path: this.plugin.config.storePath,
							}),
				);
			return;
		}

		new Setting(container).setName(t("加密")).setHeading();

		if (encrypted) {
			new Setting(container)
				.setName(t("配置库加密"))
				.setDesc(t("store 整库加密；密码只存各设备本地，不进 vault。"));
			new Setting(container)
				.setName(t("修改密码"))
				.setDesc(t("池内全部密文会以新密码重新加密重写。"))
				.addButton((btn) => btn.setButtonText(t("修改密码")).onClick(() => void this.changePassword()));
		} else {
			new Setting(container)
				.setName(t("配置库加密"))
				.setDesc(t("尚未加密。下次同步时可设置密码，store 将整库加密。"));
			new Setting(container)
				.setName(t("启用加密"))
				.setDesc(t("设置密码并立即重新同步（整库加密）。"))
				.addButton((btn) => btn.setButtonText(t("启用加密")).onClick(() => void this.plugin.runSync()));
		}
	}

	private async changePassword(): Promise<void> {
		const input = await promptChangeStorePassword(this.app, this.plugin.store.storePassword());
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
			new Setting(container).setDesc(t("还没有 profile。新建一个，或在一台同步设备上执行同步。"));
			return;
		}

		for (const name of names) {
			const desktop = profiles.find((entry) => entry.name === name && entry.platform === "desktop");
			if (desktop) {
				const mobile = profiles.some((entry) => entry.name === name && entry.platform === "mobile");
				this.renderProfileRow(container, name, mobile);
			} else {
				// 孤儿派生：mobile 文件在、桌面文件被手删——只提供删除
				this.renderOrphanMobileRow(container, name);
			}
		}
	}

	/** 每个 profile 名一行：手机适配是开关状态，不单列 mobile 行（派生跟随桌面，编辑它无意义） */
	private renderProfileRow(container: HTMLElement, name: string, hasMobileTwin: boolean): void {
		const setting = new Setting(container).setName(name).setDesc(
			hasMobileTwin
				? t("已开启手机适配：手机端应用《{name}（手机）》。", { name })
				: t("未开启手机适配。"),
		);
		setting.addToggle((toggle) =>
			toggle
				.setValue(hasMobileTwin)
				.setTooltip(t("适配手机"))
				.onChange((value) => void this.setMobileAdaptation(name, value)),
		);
		setting
			.addButton((btn) => btn.setButtonText(t("查看/编辑")).onClick(() => void this.plugin.openProfileEditor(name, "desktop")))
			.addButton((btn) => btn.setButtonText(t("重命名")).onClick(() => void this.renameProfile(name)))
			.addButton((btn) =>
				btn
					.setButtonText(t("删除"))
					.setDestructive()
					.onClick(() => void this.deleteProfile(name)),
			);
	}

	private renderOrphanMobileRow(container: HTMLElement, name: string): void {
		new Setting(container)
			.setName(t("{name}（手机）", { name }))
			.setDesc(t("桌面 profile 已不存在的派生残留，可删除。"))
			.addButton((btn) =>
				btn
					.setButtonText(t("删除"))
					.setDestructive()
					.onClick(() => void this.plugin.deleteProfile(name, "mobile").then(() => this.display())),
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

	private async deleteProfile(name: string): Promise<void> {
		const confirmed = await askConfirm(this.app, {
			title: t("删除 profile"),
			message: t("确定删除《{label}》？此操作不可撤销。", { label: name }),
			acceptLabel: t("删除"),
			cancelLabel: t("取消"),
			acceptStyle: "warning",
		});
		if (!confirmed) return;
		// SPEC §3.5：删 desktop 时询问是否连带删 mobile 派生
		const twin = await this.plugin.readProfile(name, "mobile");
		if (twin !== null) {
			const deleteTwin = await askConfirm(this.app, {
				title: t("删除手机适配 profile"),
				message: t("《{name}》有手机适配派生，一并删除？", { name }),
				acceptLabel: t("一并删除"),
				cancelLabel: t("仅删桌面版"),
			});
			if (deleteTwin) await this.plugin.deleteProfile(name, "mobile");
		}
		await this.plugin.deleteProfile(name, "desktop");
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
}
