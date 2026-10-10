/**
 * Config Profile 入口：薄装配层——配置装载、语言、角色判定（fail-safe）、
 * 命令注册（同步 / 应用 profile / 编辑 profile）、设置页。
 * 不做自动同步（SPEC §0.7）：唯一写入口是手动命令与设置页操作。
 */

import { Notice, Plugin } from "obsidian";
import {
	createCryptoMeta,
	parseCryptoMeta,
	verifyPassword,
} from "./crypto/envelope";
import type { CryptoMeta } from "./crypto/envelope";
import { setLanguage, t } from "./i18n";
import { storePaths } from "./store/paths";
import type { StorePaths } from "./store/paths";
import { decideRole, parseLock, roleStateKey } from "./store/lock";
import type { RoleDecision } from "./store/lock";
import {
	buildMobileProfile,
	emptyProfile,
	isValidProfileName,
	normalizeProfileName,
	parseProfile,
	profileFileName,
	profileFromFileName,
	serializeProfile,
} from "./store/profile";
import type { ProfileDoc, ProfilePlatform } from "./store/profile";
import { ApplyService, WrongStorePasswordError } from "./services/apply-service";
import type { ApplyReport } from "./services/apply-service";
import { ConfigAdapter } from "./services/config-adapter";
import type { PluginInfo } from "./services/config-adapter";
import { SyncService } from "./services/sync-service";
import { ApplyResultModal } from "./modals/apply-result";
import { FirstRunModal } from "./modals/first-run-modal";
import { promptNewStorePassword, promptStorePassword } from "./modals/password";
import { CPSettingTab } from "./settings";
import { DEFAULT_CONFIG, mergeConfig } from "./types";
import type { CPConfig } from "./types";

export default class ConfigProfilePlugin extends Plugin {
	config: CPConfig = DEFAULT_CONFIG;
	store!: ConfigAdapter;
	/** 本会话的角色判定结果（每次启动与写池操作前重新计算） */
	currentRole: { kind: "fresh" | "master" | "apply"; holderName?: string } = { kind: "fresh" };

	/** obsidian.d.ts 1.8.7 未声明 App.locale（运行时存在），收口在这一个转换里（qj 同款） */
	private localeOf(app: unknown): string | undefined {
		return (app as { locale?: string })?.locale;
	}

	applyLanguage(): void {
		setLanguage(this.config.language, () => this.localeOf(this.app));
	}

	effectiveDeviceName(): string {
		return this.config.deviceName !== "" ? this.config.deviceName : this.store.isMobile ? t("手机") : t("PC");
	}

	private paths(): StorePaths {
		return storePaths(this.config.storePath);
	}

	async onload(): Promise<void> {
		this.config = mergeConfig(await this.loadData());
		this.applyLanguage();
		this.store = new ConfigAdapter(this.app);
		this.addSettingTab(new CPSettingTab(this.app, this));

		// 角色 / store 读取是磁盘 IO，放布局就绪后做，不阻塞 onload
		this.app.workspace.onLayoutReady(() => {
			void this.initRole().then(() => this.registerCommands());
		});
	}

	async saveConfig(): Promise<void> {
		await this.saveData(this.config);
	}

	// ── 角色判定（SPEC §3.1） ──

	private async initRole(): Promise<void> {
		const decision = await this.computeRole();
		this.currentRole = {
			kind: decision.kind,
			holderName: decision.kind === "apply" ? decision.holderName : undefined,
		};

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
	async computeRole() {
		const paths = this.paths();
		let raw: string | null = null;
		try {
			raw = await this.store.readLockRaw(paths);
		} catch {
			raw = ""; // 文件存在但读失败 → parseLock 按 corrupt 处理
		}
		let poolHasContent = false;
		try {
			poolHasContent = await this.store.poolHasContent(paths);
		} catch {
			poolHasContent = false;
		}
		return decideRole({ lock: parseLock(raw), poolHasContent, localDeviceId: this.store.deviceId() });
	}

	private async applyFirstRunChoice(choice: "master" | "apply"): Promise<void> {
		if (choice === "master") {
			await this.claimMaster();
			return;
		}
		this.config.preferredRole = "apply";
		this.currentRole = { kind: "apply" };
		await this.saveConfig();
		new Notice(t("本机已设为应用配置。"));
	}

	/** 夺取主配置（首次选择与设置页按钮共用） */
	async claimMaster(): Promise<void> {
		const paths = this.paths();
		await this.store.writeLock(paths, this.store.buildLock(this.effectiveDeviceName()));
		this.currentRole = { kind: "master" };
		new Notice(t("本机已设为主配置。"));
		await this.saveRoleState("master");
	}

	/** 让出主配置 */
	async releaseMaster(): Promise<void> {
		const paths = this.paths();
		await this.store.deleteLock(paths);
		this.currentRole = { kind: "apply" };
		new Notice(t("已让出主配置。"));
		await this.saveRoleState("apply:pool-without-lock");
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

	// ── 加密（SPEC §2.5） ──

	private async readCryptoMeta(): Promise<CryptoMeta | null> {
		const raw = await this.store.readIfExists(`${this.paths().root}/_crypto.json`);
		return raw === null ? null : parseCryptoMeta(raw);
	}

	/** store 是否已加密（有合法 _crypto.json） */
	async storeEncrypted(): Promise<boolean> {
		return (await this.readCryptoMeta()) !== null;
	}

	/** 确保密码可用：未存则弹输入框并验证；验证失败返回 null（调用方中止） */
	async ensurePassword(meta: CryptoMeta): Promise<string | null> {
		let password = this.store.storePassword();
		if (password !== null && (await verifyPassword(meta, password))) return password;
		password = await promptStorePassword(this.app);
		if (password === null || password === "") return null;
		if (!(await verifyPassword(meta, password))) {
			new Notice(t("密码不正确。"));
			this.store.setStorePassword(null);
			return null;
		}
		this.store.setStorePassword(password);
		return password;
	}

	/** 修改密码（仅主配置；设置页调用）：解密池内全部密文 → 新密码重加密重写 */
	async changeStorePassword(oldPassword: string, newPassword: string): Promise<void> {
		const meta = await this.readCryptoMeta();
		if (meta === null) throw new Error("store not encrypted");
		if (!(await verifyPassword(meta, oldPassword))) throw new WrongStorePasswordError();

		const paths = this.paths();
		await this.store.writeAtomic(`${paths.root}/_crypto.json`, JSON.stringify(await createCryptoMeta(newPassword), null, "\t"));
		// 池内容以新密码重写：直接复用同步流程（同步前会重新校验 lock）
		await this.runSync(newPassword);
	}

	// ── 同步（SPEC §3.2，仅 PC + 仅主配置） ──

	async runSync(passwordOverride?: string): Promise<void> {
		if (this.store.isMobile) {
			new Notice(t("手机端只能应用配置，不能同步。"));
			return;
		}
		const decision = await this.computeRole();
		if (decision.kind !== "master") {
			new Notice(t("本机不是主配置设备，不能同步。可在设置中夺取主配置。"));
			return;
		}

		let password = passwordOverride ?? null;
		const meta = await this.readCryptoMeta();
		if (meta === null) {
			// 首次（或未启用加密）：二选一——设密码 / 暂不加密（SPEC §2.5）
			password = await promptNewStorePassword(this.app);
			if (password !== null) {
				await this.store.writeAtomic(
					`${this.paths().root}/_crypto.json`,
					JSON.stringify(await createCryptoMeta(password), null, "\t"),
				);
				this.store.setStorePassword(password);
			}
		} else if (passwordOverride === undefined) {
			password = await this.ensurePassword(meta);
			if (password === null) return;
		}

		const service = new SyncService(this.store, this.paths(), this.effectiveDeviceName());
		try {
			const report = await service.run(password);
			new Notice(
				t("同步完成：更新 {updated} 项，跳过 {skipped} 项，清理 {pruned} 项。", {
					updated: report.updated,
					skipped: report.skipped,
					pruned: report.pruned,
				}) + (report.mobileProjection ? t("已更新移动投影。") : ""),
			);
		} catch (error) {
			new Notice(t("同步失败：{message}", { message: error instanceof Error ? error.message : String(error) }));
		}
	}

	// ── 应用（SPEC §3.3） ──

	async runApply(name: string, platform: ProfilePlatform): Promise<void> {
		const paths = this.paths();
		const raw = await this.store.readIfExists(`${paths.profilesDir}/${profileFileName(name, platform)}`);
		if (raw === null) {
			new Notice(t("找不到 profile：{name}", { name }));
			return;
		}
		const parsed = parseProfile(raw);
		if (!parsed.ok) {
			new Notice(t("profile 文件损坏：{name}", { name }));
			return;
		}

		let password: string | null = null;
		const meta = await this.readCryptoMeta();
		if (meta !== null) {
			password = await this.ensurePassword(meta);
			if (password === null) return;
		}

		const service = new ApplyService(this.store, paths);
		try {
			const report: ApplyReport = await service.run(parsed.profile, password);
			if (report.applied.length === 0 && report.missingPlugins.length === 0 && report.desktopOnlySkipped.length === 0) {
				new Notice(t("profile 里没有勾选任何内容：{name}", { name }));
				return;
			}
			new ApplyResultModal(this.app, name, report, () => this.store.reloadApp()).open();
		} catch (error) {
			if (error instanceof WrongStorePasswordError) {
				this.store.setStorePassword(null);
				new Notice(t("密码不正确。"));
				return;
			}
			new Notice(t("应用失败：{message}", { message: error instanceof Error ? error.message : String(error) }));
		}
	}

	// ── profile CRUD（设置页与编辑弹窗共用） ──

	async listProfiles(): Promise<{ name: string; platform: ProfilePlatform }[]> {
		const files = await this.store.listFileNames(`${this.paths().profilesDir}`);
		const out: { name: string; platform: ProfilePlatform }[] = [];
		for (const file of files) {
			const entry = profileFromFileName(file);
			if (entry) out.push(entry);
		}
		return out;
	}

	async readProfile(name: string, platform: ProfilePlatform): Promise<ProfileDoc | null> {
		const raw = await this.store.readIfExists(`${this.paths().profilesDir}/${profileFileName(name, platform)}`);
		if (raw === null) return null;
		const parsed = parseProfile(raw);
		return parsed.ok ? parsed.profile : null;
	}

	async writeProfile(doc: ProfileDoc): Promise<void> {
		doc.updatedAt = new Date().toISOString();
		await this.store.mkdir(`${this.paths().profilesDir}`);
		await this.store.writeAtomic(
			`${this.paths().profilesDir}/${profileFileName(doc.name, doc.platform)}`,
			serializeProfile(doc),
		);
	}

	async createProfile(name: string, adaptMobile: boolean): Promise<boolean> {
		const normalized = normalizeProfileName(name);
		if (!isValidProfileName(name)) {
			new Notice(t("名称不能为空，且不能包含 / 或 \\。"));
			return false;
		}
		const existing = await this.listProfiles();
		if (existing.some((entry) => entry.name === normalized)) {
			new Notice(t("同名 profile 已存在：{name}", { name: normalized }));
			return false;
		}
		await this.writeProfile(emptyProfile(normalized, "desktop"));
		if (adaptMobile) {
			await this.writeProfile(emptyProfile(normalized, "mobile"));
		}
		new Notice(t("已创建 profile。重载插件后新命令生效。"));
		return true;
	}

	async deleteProfile(name: string, platform: ProfilePlatform): Promise<void> {
		await this.store.deletePath(`${this.paths().profilesDir}/${profileFileName(name, platform)}`);
	}

	async renameProfile(from: string, to: string): Promise<boolean> {
		const normalized = normalizeProfileName(to);
		if (!isValidProfileName(to)) {
			new Notice(t("名称不能为空，且不能包含 / 或 \\。"));
			return false;
		}
		if (normalized === from) return true;
		const existing = await this.listProfiles();
		if (existing.some((entry) => entry.name === normalized)) {
			new Notice(t("同名 profile 已存在：{name}", { name: normalized }));
			return false;
		}
		const paths = this.paths();
		await this.store.renamePath(
			`${paths.profilesDir}/${profileFileName(from, "desktop")}`,
			`${paths.profilesDir}/${profileFileName(normalized, "desktop")}`,
		);
		const mobile = await this.readProfile(from, "mobile");
		if (mobile !== null) {
			// 同名 mobile 派生一起改名并回指新名
			await this.store.renamePath(
				`${paths.profilesDir}/${profileFileName(from, "mobile")}`,
				`${paths.profilesDir}/${profileFileName(normalized, "mobile")}`,
			);
			mobile.name = normalized;
			mobile.adaptedFrom = normalized;
			await this.writeProfile(mobile);
		}
		const desktop = await this.readProfile(normalized, "desktop");
		if (desktop !== null) {
			desktop.name = normalized;
			await this.writeProfile(desktop);
		}
		return true;
	}

	/** 桌面 profile 的「适配手机」开关（SPEC §3.4）：开 = 生成/更新同名 mobile 派生 */
	async setMobileAdaptation(name: string, enabled: boolean): Promise<void> {
		if (!enabled) {
			await this.store.deletePath(`${this.paths().profilesDir}/${profileFileName(name, "mobile")}`);
			return;
		}
		const desktop = await this.readProfile(name, "desktop");
		if (desktop === null) return;
		const installed = await this.store.listInstalledPlugins();
		const desktopOnly = new Set(installed.filter((p) => p.isDesktopOnly).map((p) => p.id));
		await this.writeProfile(buildMobileProfile(desktop, desktopOnly));
	}

	/** profile 编辑器数据（本机 + 池内并集） */
	async profileEditorData(platform: ProfilePlatform): Promise<{
		plugins: PluginInfo[];
		snippets: string[];
		themes: string[];
	}> {
		const installed = await this.store.listInstalledPlugins();
		const pool = this.paths();
		const poolIds = await this.store.listPoolPluginIds(
			platform === "mobile" ? pool.mobilePool : pool.pcPool,
		);
		const merged = new Map<string, PluginInfo>();
		for (const plugin of installed) merged.set(plugin.id, plugin);
		for (const id of poolIds) {
			if (!merged.has(id)) merged.set(id, { id, name: id, isDesktopOnly: false });
		}
		const snippets = new Set([
			...(await this.store.listFileNames(this.store.obsidianPath("snippets"))),
			...(await this.store.listFileNames(
				`${(platform === "mobile" ? pool.mobilePool : pool.pcPool).snippets}`,
			)),
		]);
		const themes = new Set([
			...(await this.store.listFileNames(this.store.obsidianPath("themes"))),
			...(await this.store.listFileNames(
				`${(platform === "mobile" ? pool.mobilePool : pool.pcPool).themes}`,
			)),
		]);
		return {
			plugins: [...merged.values()],
			snippets: [...snippets],
			themes: [...themes],
		};
	}

	// ── 命令注册（SPEC §5） ──

	private registerCommands(): void {
		// 同步：仅 PC 注册（手机没有这个命令，SPEC §3.2）
		if (!this.store.isMobile) {
			this.addCommand({
				id: "sync-local-config",
				name: t("同步本地配置"),
				callback: () => void this.runSync(),
			});
		}

		void this.listProfiles().then((profiles) => {
			for (const entry of profiles) {
				if (entry.platform === "mobile" || !this.store.isMobile) {
					this.addCommand({
						id: `apply-${entry.platform}-${entry.name}`,
						name: t("应用配置：{name}", { name: displayName(entry.name, entry.platform) }),
						callback: () => void this.runApply(entry.name, entry.platform),
					});
				}
				// 编辑 profile 会写 store——手机端不提供（SPEC：手机只应用）
				if (!this.store.isMobile) {
					this.addCommand({
						id: `edit-${entry.platform}-${entry.name}`,
						name: t("查看/编辑配置：{name}", { name: displayName(entry.name, entry.platform) }),
						callback: () => void this.openProfileEditor(entry.name, entry.platform),
					});
				}
			}
		});
	}

	async openProfileEditor(name: string, platform: ProfilePlatform): Promise<void> {
		const doc = await this.readProfile(name, platform);
		if (doc === null) {
			new Notice(t("找不到 profile：{name}", { name }));
			return;
		}
		const data = await this.profileEditorData(platform);
		const { ProfileEditModal } = await import("./modals/profile-edit");
		new ProfileEditModal(this, globalThis.structuredClone(doc), data).open();
	}

	/** 编辑器落盘回调（设置页小节与 Modal 共用） */
	async onProfileEdited(doc: ProfileDoc): Promise<void> {
		await this.writeProfile(doc);
		// desktop profile 有 mobile 派生时跟随刷新（SPEC §3.4 适配开关的派生语义）
		if (doc.platform === "desktop") {
			const twin = await this.readProfile(doc.name, "mobile");
			if (twin !== null) await this.setMobileAdaptation(doc.name, true);
		}
	}
}

function displayName(name: string, platform: ProfilePlatform): string {
	return platform === "mobile" ? t("{name}（手机）", { name }) : name;
}
