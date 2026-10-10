/**
 * profile 文档的解析 / 校验 / 移动投影（纯函数，零 DOM、不 import obsidian）。
 * 形状见 SPEC §2.3。
 */

export type ProfilePlatform = "desktop" | "mobile";

export interface ProfileDoc {
	name: string;
	platform: ProfilePlatform;
	/** mobile profile 记录派生来源 desktop profile 名 */
	adaptedFrom: string | null;
	app: string[];
	plugins: string[];
	snippets: string[];
	themes: string[];
	createdAt: string;
	updatedAt: string;
}

export type ProfileParseResult = { ok: true; profile: ProfileDoc } | { ok: false };

/** profile 显示名规则：非空、无路径分隔符、去首尾空白 */
export function normalizeProfileName(input: string): string {
	return input.trim().replace(/[/\\]/g, "");
}

export function isValidProfileName(input: string): boolean {
	return normalizeProfileName(input) !== "";
}

export function profileFileName(name: string, platform: ProfilePlatform): string {
	return platform === "mobile" ? `${name}.mobile.json` : `${name}.json`;
}

/** 从文件名反解（只认两种形态；其他文件忽略） */
export function profileFromFileName(
	fileName: string,
): { name: string; platform: ProfilePlatform } | null {
	if (fileName.endsWith(".mobile.json")) {
		const name = fileName.slice(0, -".mobile.json".length);
		return name === "" ? null : { name, platform: "mobile" };
	}
	if (fileName.endsWith(".json")) {
		const name = fileName.slice(0, -".json".length);
		return name === "" || name.endsWith(".mobile") ? null : { name, platform: "desktop" };
	}
	return null;
}

function stringArray(value: unknown): string[] {
	return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : [];
}

export function parseProfile(raw: string): ProfileParseResult {
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return { ok: false };
	}
	if (typeof parsed !== "object" || parsed === null) return { ok: false };
	const doc = parsed as Partial<ProfileDoc>;
	if (typeof doc.name !== "string" || doc.name.trim() === "") return { ok: false };
	if (doc.platform !== "desktop" && doc.platform !== "mobile") return { ok: false };
	return {
		ok: true,
		profile: {
			name: doc.name,
			platform: doc.platform,
			adaptedFrom: typeof doc.adaptedFrom === "string" ? doc.adaptedFrom : null,
			app: stringArray(doc.app),
			plugins: stringArray(doc.plugins),
			snippets: stringArray(doc.snippets),
			themes: stringArray(doc.themes),
			createdAt: typeof doc.createdAt === "string" ? doc.createdAt : "",
			updatedAt: typeof doc.updatedAt === "string" ? doc.updatedAt : "",
		},
	};
}

export function serializeProfile(profile: ProfileDoc): string {
	return JSON.stringify(profile, null, "\t");
}

export function emptyProfile(name: string, platform: ProfilePlatform): ProfileDoc {
	const now = new Date().toISOString();
	return {
		name,
		platform,
		adaptedFrom: platform === "mobile" ? name : null,
		app: [],
		plugins: [],
		snippets: [],
		themes: [],
		createdAt: now,
		updatedAt: now,
	};
}

/**
 * 桌面 → 移动投影（SPEC §2.5/§3.2 第 3 步）：
 * app 只留 core/community 两项；插件剔除 isDesktopOnly；snippets/themes 清空
 * （外观类不落到手机）。
 */
export function buildMobileProfile(
	source: ProfileDoc,
	desktopOnlyPluginIds: ReadonlySet<string>,
): ProfileDoc {
	return {
		name: source.name,
		platform: "mobile",
		adaptedFrom: source.name,
		app: source.app.filter((file) => MOBILE_ALLOWED.includes(file)),
		plugins: source.plugins.filter((id) => !desktopOnlyPluginIds.has(id)),
		snippets: [],
		themes: [],
		createdAt: source.createdAt,
		updatedAt: new Date().toISOString(),
	};
}

const MOBILE_ALLOWED = ["core-plugins.json", "community-plugins.json"];

/**
 * mobile 投影用的 community-plugins.json 过滤：剔除 isDesktopOnly 插件的 id
 * （纯字符串变换：坏 JSON 原样返回，不动它）。
 */
export function filterCommunityListForMobile(
	rawJson: string,
	desktopOnlyPluginIds: ReadonlySet<string>,
): string {
	let list: unknown;
	try {
		list = JSON.parse(rawJson);
	} catch {
		return rawJson;
	}
	if (!Array.isArray(list) || !list.every((id) => typeof id === "string")) return rawJson;
	const filtered = list.filter((id) => !desktopOnlyPluginIds.has(id));
	return JSON.stringify(filtered, null, "\t");
}
