/**
 * 加密信封（纯函数层，SPEC §2.5）：全库默认加密、单一共享密码。
 * AES-256-GCM + PBKDF2-SHA256（600k 迭代，OWASP 现行推荐，目标场景含公开 git 仓）。
 * Web Crypto 在 Obsidian 全平台可用；明文密码永不写入 vault / store / data.json。
 */

export const CRYPTO_SCHEMA = "aes-256-gcm";
export const PBKDF2_ITERATIONS = 600_000;
/** 校验信封的固定明文（不是秘密，只用来验证「密码对不对」） */
const VERIFICATION_PLAINTEXT = "config-profile:verification:1";

/** 池内密文条目的形状：文件名不变，内容是这个 JSON 信封 */
export interface Envelope {
	scheme: string;
	salt: string;
	iv: string;
	data: string;
}

/** store 根 `_crypto.json` 的形状 */
export interface CryptoMeta {
	schema: 1;
	kdf: "pbkdf2-sha256";
	iterations: number;
	verification: Envelope;
	createdAt: string;
}

export class PasswordError extends Error {
	constructor(message = "wrong password or corrupted data") {
		super(message);
		this.name = "PasswordError";
	}
}

function subtle(): SubtleCrypto {
	const c = globalThis.crypto;
	if (!c?.subtle) {
		throw new Error("WebCrypto unavailable on this platform");
	}
	return c.subtle;
}

function toB64(bytes: Uint8Array): string {
	let binary = "";
	const chunk = 0x8000;
	for (let i = 0; i < bytes.length; i += chunk) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	}
	return globalThis.btoa(binary);
}

function fromB64(b64: string): Uint8Array {
	const binary = globalThis.atob(b64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes;
}

function randomBytes(length: number): Uint8Array {
	const bytes = new Uint8Array(length);
	globalThis.crypto.getRandomValues(bytes);
	return bytes;
}

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
	const material = await subtle().importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
		"deriveKey",
	]);
	return subtle().deriveKey(
		{ name: "PBKDF2", salt: salt as unknown as BufferSource, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
		material,
		{ name: "AES-GCM", length: 256 },
		false,
		["encrypt", "decrypt"],
	);
}

export function isEnvelope(value: unknown): value is Envelope {
	if (typeof value !== "object" || value === null) return false;
	const env = value as Partial<Envelope>;
	return (
		env.scheme === CRYPTO_SCHEMA &&
		typeof env.salt === "string" &&
		typeof env.iv === "string" &&
		typeof env.data === "string"
	);
}

/** 尝试把一段文本解析为信封（池条目读回时区分明文 / 密文） */
export function parseEnvelopeText(text: string): Envelope | null {
	let parsed: unknown;
	try {
		parsed = JSON.parse(text);
	} catch {
		return null;
	}
	return isEnvelope(parsed) ? parsed : null;
}

/** 明文 → 信封（加密） */
export async function encryptText(password: string, plaintext: string): Promise<Envelope> {
	const salt = randomBytes(16);
	const iv = randomBytes(12);
	const key = await deriveKey(password, salt);
	const cipher = await subtle().encrypt(
		{ name: "AES-GCM", iv: iv as unknown as BufferSource },
		key,
		new TextEncoder().encode(plaintext),
	);
	return {
		scheme: CRYPTO_SCHEMA,
		salt: toB64(salt),
		iv: toB64(iv),
		data: toB64(new Uint8Array(cipher)),
	};
}

/** 信封 → 明文；密码错误 / 数据损坏抛 PasswordError（调用方按条目跳过或中止） */
export async function decryptText(password: string, envelope: Envelope): Promise<string> {
	if (envelope.scheme !== CRYPTO_SCHEMA) throw new PasswordError("unknown scheme");
	const key = await deriveKey(password, fromB64(envelope.salt));
	let plain: ArrayBuffer;
	try {
		plain = await subtle().decrypt(
			{ name: "AES-GCM", iv: fromB64(envelope.iv) as unknown as BufferSource },
			key,
			fromB64(envelope.data) as unknown as BufferSource,
		);
	} catch {
		throw new PasswordError();
	}
	return new TextDecoder().decode(plain);
}

/** 生成 `_crypto.json`（含校验信封） */
export async function createCryptoMeta(password: string): Promise<CryptoMeta> {
	return {
		schema: 1,
		kdf: "pbkdf2-sha256",
		iterations: PBKDF2_ITERATIONS,
		verification: await encryptText(password, VERIFICATION_PLAINTEXT),
		createdAt: new Date().toISOString(),
	};
}

/** 验证密码：用校验信封解一段已知明文 */
export async function verifyPassword(meta: CryptoMeta, password: string): Promise<boolean> {
	try {
		const plain = await decryptText(password, meta.verification);
		return plain === VERIFICATION_PLAINTEXT;
	} catch {
		return false;
	}
}

export function parseCryptoMeta(raw: string): CryptoMeta | null {
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return null;
	}
	if (typeof parsed !== "object" || parsed === null) return null;
	const meta = parsed as Partial<CryptoMeta>;
	if (meta.schema !== 1 || meta.kdf !== "pbkdf2-sha256" || !isEnvelope(meta.verification)) {
		return null;
	}
	return {
		schema: 1,
		kdf: "pbkdf2-sha256",
		iterations: typeof meta.iterations === "number" ? meta.iterations : PBKDF2_ITERATIONS,
		verification: meta.verification,
		createdAt: typeof meta.createdAt === "string" ? meta.createdAt : "",
	};
}
