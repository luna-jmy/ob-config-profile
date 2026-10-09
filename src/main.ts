/**
 * Config Profile 入口：薄装配层——配置装载、语言、角色判定（fail-safe）、设置页。
 * 命令（同步 / 应用 / 编辑 profile）在 M1/M2 加入；不做自动同步（SPEC §0.7）。
 */

import { Notice, Plugin } from "obsidian";
import { setLanguage, t } from "./i18n";
import type { RoleDecision } from "./store/lock";
import { decideRole, parseLock, roleStateKey } from "./store/lock";
import { storePaths } from "./store/paths";
import { ConfigAdapter } from "./services/config-adapter";
import { FirstRunModal } from "./modals/first-run-modal";
import { CPSettingTab } from "./settings";
import { DEFAULT_CONFIG, mergeConfig } from "./types";
import type { CPConfig } from "./types";

export default class ConfigProfilePlugin extends Plugin {
	config: CPConfig = DEFAULT_CONFIG;
	store!: ConfigAdapter;
	/** 本会话的角色判定结果（设置页展示用；每次启动与写池操作前重新计算） */
	currentRole: RoleDecision = { kind: "fresh" };

	/** obsidian.d.ts 1.8.7 未声明 App.locale（运行时存在），收口在这一个转换里（qj 同款） */
	private localeOf(app: unknown): string | undefined {
		return (app as { locale?: string })?.locale;
	}

	applyLanguage(): void {
		setLanguage(this.config.language, () => this.localeOf(this.app));
	}

	/** 设备显示名：未设置时按平台给默认值 */
	effectiveDeviceName(): string {
		return this.config.deviceName !== "" ? this.config.deviceName : this.store.isMobile ? t("手机") : t("PC");
	}

	async onload(): Promise<void> {
		this.config = mergeConfig(await this.loadData());
		this.applyLanguage();
		this.store = new ConfigAdapter(this.app);
		this.addSettingTab(new CPSettingTab(this.app, this));

		// 角色判定要读 store（磁盘 IO），放布局就绪后做，不阻塞 onload
		this.app.workspace.onLayoutReady(() => {
			void this.initRole();
		});
	}

	async saveConfig(): Promise<void> {
		await this.saveData(this.config);
	}

	/** 重算角色判定并给出提示；fresh 场景弹选择框（preferredRole=apply 时静默） */
	private async initRole(): Promise<void> {
		const decision = await this.computeRole();
		this.currentRole = decision;

		if (decision.kind === "fresh") {
			if (this.config.preferredRole === "apply") {
				await this.saveRoleState("apply:preferred");
				return;
			}
			new FirstRunModal(this.app, (choice) => void this.applyFirstRunChoice(choice)).open();
			return;
		}
		if (this.config.lastRoleState !== roleStateKey(decision)) {
			this.noticeFor(decision);
			await this.saveRoleState(roleStateKey(decision));
		}
	}

	/** 全量重算：lock 原文（读失败按损坏）+ 池内容 → decideRole（纯函数） */
	async computeRole(): Promise<RoleDecision> {
		const paths = storePaths(this.config.storePath);
		let raw: string | null = null;
		try {
			raw = await this.store.readLockRaw(paths);
		} catch {
			raw = ""; // 读得到存在但读失败 → parseLock 按 corrupt 处理
		}
		let poolHasContent = false;
		try {
			poolHasContent = await this.store.poolHasContent(paths);
		} catch {
			poolHasContent = false;
		}
		return decideRole({
			lock: parseLock(raw),
			poolHasContent,
			localDeviceId: this.store.deviceId(),
		});
	}

	private async applyFirstRunChoice(choice: "master" | "apply"): Promise<void> {
		if (choice === "master") {
			await this.claimMaster();
			return;
		}
		this.config.preferredRole = "apply";
		this.currentRole = { kind: "apply", reason: "pool-without-lock" };
		await this.saveConfig();
		new Notice(t("本机已设为应用配置。"));
	}

	/** 夺取主配置（首次选择「主配置」与设置页按钮共用）：写 lock，更新角色 */
	async claimMaster(): Promise<void> {
		const paths = storePaths(this.config.storePath);
		await this.store.writeLock(paths, this.store.buildLock(this.effectiveDeviceName()));
		this.currentRole = { kind: "master" };
		new Notice(t("本机已设为主配置。"));
		await this.saveRoleState("master");
	}

	/** 让出主配置：删 lock；此后所有设备（含本机）按「有池无 lock」兜底为应用配置 */
	async releaseMaster(): Promise<void> {
		const paths = storePaths(this.config.storePath);
		await this.store.deleteLock(paths);
		this.currentRole = { kind: "apply", reason: "pool-without-lock" };
		new Notice(t("已让出主配置。"));
		await this.saveRoleState(roleStateKey(this.currentRole));
	}

	private async saveRoleState(stateKey: string): Promise<void> {
		this.config.lastRoleState = stateKey;
		await this.saveConfig();
	}

	private noticeFor(decision: RoleDecision): void {
		if (decision.kind === "master") {
			new Notice(t("本机已设为主配置。"));
			return;
		}
		if (decision.kind === "fresh") return;
		switch (decision.reason) {
			case "other-device":
				new Notice(
					t(
						"检测到主配置来自设备《{name}》，本机已设为应用配置。若主配置其实属于本机（重装或清除数据后身份丢失），请在设置中重新夺取。",
						{ name: decision.holderName ?? "" },
					),
				);
				break;
			case "lock-corrupt":
				new Notice(t("无法确认主配置归属（lock 文件损坏），本机暂按应用配置处理。"));
				break;
			case "future-schema":
				new Notice(t("store 由更新版本的 Config Profile 写入，本机暂按应用配置处理。请更新插件。"));
				break;
			case "pool-without-lock":
				new Notice(t("无法确认主配置归属（配置池存在但没有 lock，可能同步未完成），本机暂按应用配置处理。"));
				break;
		}
	}
}
