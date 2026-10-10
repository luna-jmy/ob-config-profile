/**
 * 池元数据 `meta.json`（纯函数，零 DOM、不 import obsidian）。
 *
 * schema 2（0.1.0，多主时间戳同步，SPEC §3.2）：
 * - entries 记每个池条目的明文指纹、写入时间戳与写入设备（LWW 依据），
 *   `deleted: true` 为墓碑（删除传播）；
 * - devices 记每个同步设备的显示名、上次同步时间与 baseline 指纹
 *   （三方合并的「本机上次看到的版本」）。
 * 指纹一律是**明文内容**的指纹——加密只是传输编码，不参与比较。
 * 保持明文存储：指纹与设备 id 不是秘密，且同步算法要在解密前读它。
 */

export interface PoolEntryMeta {
	/** 明文内容指纹（fingerprint）；墓碑无内容时为空串 */
	fp: string;
	/** ISO 时间戳（写入/删除时刻，单调化由 reconcile.ts 负责） */
	ts: string;
	/** 写入设备 id（来源标注，不参与匹配） */
	deviceId: string;
	/** 墓碑：条目已被删除（池文件已物理删除） */
	deleted?: true;
}

export interface DeviceBaseline {
	name: string;
	lastSyncedAt: string;
	/** 本设备上次同步时各条目的明文指纹（key → fp；墓碑不进 baseline） */
	baseline: Record<string, string>;
}

export interface PoolMeta {
	schema: 2;
	syncedAt: string;
	encrypted: boolean;
	entries: Record<string, PoolEntryMeta>;
	devices: Record<string, DeviceBaseline>;
}

export const EMPTY_POOL_META: PoolMeta = {
	schema: 2,
	syncedAt: "",
	encrypted: false,
	entries: {},
	devices: {},
};

function asRecord(value: unknown): Record<string, unknown> | null {
	return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

function parseEntry(raw: unknown): PoolEntryMeta | null {
	const rec = asRecord(raw);
	if (rec === null) return null;
	const fp = typeof rec.fp === "string" ? rec.fp : "";
	const ts = typeof rec.ts === "string" ? rec.ts : "";
	const deviceId = typeof rec.deviceId === "string" ? rec.deviceId : "";
	const deleted = rec.deleted === true ? (true as const) : undefined;
	return { fp, ts, deviceId, deleted };
}

function parseDevice(raw: unknown): DeviceBaseline | null {
	const rec = asRecord(raw);
	if (rec === null) return null;
	const baseline = asRecord(rec.baseline);
	const parsed: Record<string, string> = {};
	if (baseline !== null) {
		for (const [key, value] of Object.entries(baseline)) {
			if (typeof value === "string") parsed[key] = value;
		}
	}
	return {
		name: typeof rec.name === "string" ? rec.name : "",
		lastSyncedAt: typeof rec.lastSyncedAt === "string" ? rec.lastSyncedAt : "",
		baseline: parsed,
	};
}

/**
 * 解析 `meta.json` 原文：不存在 / 损坏 → 空 meta（fail-safe，走首同步护栏）；
 * schema 1（0.0.3）→ 读时升级：fp 是旧密文指纹，但 devices 留空意味着
 * 任何设备下次同步都会走「首次同步确认」，全量推或拉后指纹体系归位。
 */
export function parsePoolMeta(raw: string | null): PoolMeta {
	if (raw === null) return { ...EMPTY_POOL_META, entries: {}, devices: {} };
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return { ...EMPTY_POOL_META, entries: {}, devices: {} };
	}
	const rec = asRecord(parsed);
	if (rec === null) return { ...EMPTY_POOL_META, entries: {}, devices: {} };

	if (rec.schema === 1) {
		// v1：entries: Record<string, string>（密文指纹），无 devices
		const entries: Record<string, PoolEntryMeta> = {};
		const v1entries = asRecord(rec.entries);
		const syncedAt = typeof rec.syncedAt === "string" ? rec.syncedAt : "";
		if (v1entries !== null) {
			for (const [key, fp] of Object.entries(v1entries)) {
				if (typeof fp === "string") {
					entries[key] = { fp, ts: syncedAt, deviceId: "" };
				}
			}
		}
		return { schema: 2, syncedAt, encrypted: rec.encrypted === true, entries, devices: {} };
	}

	const entries: Record<string, PoolEntryMeta> = {};
	const rawEntries = asRecord(rec.entries);
	if (rawEntries !== null) {
		for (const [key, value] of Object.entries(rawEntries)) {
			const entry = parseEntry(value);
			if (entry !== null) entries[key] = entry;
		}
	}
	const devices: Record<string, DeviceBaseline> = {};
	const rawDevices = asRecord(rec.devices);
	if (rawDevices !== null) {
		for (const [id, value] of Object.entries(rawDevices)) {
			const device = parseDevice(value);
			if (device !== null) devices[id] = device;
		}
	}
	return {
		schema: 2,
		syncedAt: typeof rec.syncedAt === "string" ? rec.syncedAt : "",
		encrypted: rec.encrypted === true,
		entries,
		devices,
	};
}

export function serializePoolMeta(meta: PoolMeta): string {
	return JSON.stringify(meta, null, "\t");
}
