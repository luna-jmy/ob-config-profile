/**
 * store 路径组成（纯函数，零 DOM、不 import obsidian；normalizePath 是宿主的，
 * 在 config-adapter 边界统一应用——这里只做纯字符串规整）。
 * 结构见 SPEC §2.1。
 */

export interface PoolPaths {
	base: string;
	app: string;
	plugins: string;
	snippets: string;
	themes: string;
}

export interface StorePaths {
	root: string;
	/** 加密元数据（全 store 一份，SPEC §2.5） */
	crypto: string;
	pcPool: PoolPaths;
	mobilePool: PoolPaths;
	profilesDir: string;
}

/** 规整用户输入的 store 路径：去首尾空白与首尾斜杠，反斜杠归一为正斜杠。 */
export function normalizeStorePath(input: string): string {
	const trimmed = input.trim().replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
	return trimmed === "" ? "SettingProfiles" : trimmed;
}

function poolPaths(root: string, name: string): PoolPaths {
	const base = `${root}/${name}`;
	return {
		base,
		app: `${base}/app`,
		plugins: `${base}/plugins`,
		snippets: `${base}/snippets`,
		themes: `${base}/themes`,
	};
}

export function storePaths(storePath: string): StorePaths {
	const root = normalizeStorePath(storePath);
	return {
		root,
		crypto: `${root}/crypto.json`,
		pcPool: poolPaths(root, "pcconfig"),
		mobilePool: poolPaths(root, "mobileconfig"),
		profilesDir: `${root}/profiles`,
	};
}

/** 池元数据路径 */
export function metaPath(pool: PoolPaths): string {
	return `${pool.base}/meta.json`;
}

/** 旧版下划线前缀文件名（0.1.6 前用 `_crypto.json` / `_meta.json`，会撞部分
 *  同步工具的排除规则，见 CHANGELOG 0.1.6）——迁移用 */
export function legacyCryptoPath(root: string): string {
	return `${root}/_crypto.json`;
}

export function legacyMetaPath(pool: PoolPaths): string {
	return `${pool.base}/_meta.json`;
}
