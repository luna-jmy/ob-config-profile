import { describe, expect, it } from "vitest";
import {
	createCryptoMeta,
	decryptText,
	encryptText,
	isEnvelope,
	PasswordError,
	parseCryptoMeta,
	parseEnvelopeText,
	verifyPassword,
} from "../src/crypto/envelope";

// PBKDF2 600k 迭代下每个用例 ~几百 ms——用例数保持克制

describe("encryptText / decryptText", () => {
	it("roundtrip", async () => {
		const envelope = await encryptText("pw123", "secret-token");
		expect(await decryptText("pw123", envelope)).toBe("secret-token");
	});

	it("错误密码抛 PasswordError", async () => {
		const envelope = await encryptText("pw123", "data");
		await expect(decryptText("wrong", envelope)).rejects.toThrowError(PasswordError);
	});

	it("同一明文两次加密 iv 不同（GCM nonce 不复用）", async () => {
		const a = await encryptText("pw", "same");
		const b = await encryptText("pw", "same");
		expect(a.iv).not.toBe(b.iv);
	});
});

describe("信封识别", () => {
	it("parseEnvelopeText 认信封 JSON，明文返回 null", async () => {
		const envelope = await encryptText("pw", "x");
		expect(parseEnvelopeText(JSON.stringify(envelope))).toEqual(envelope);
		expect(parseEnvelopeText("plain text")).toBeNull();
		expect(isEnvelope(envelope)).toBe(true);
	});
});

describe("_crypto.json 元数据", () => {
	it("verifyPassword 对 / 错密码", async () => {
		const meta = await createCryptoMeta("pw123");
		expect(await verifyPassword(meta, "pw123")).toBe(true);
		expect(await verifyPassword(meta, "nope")).toBe(false);
	});

	it("parseCryptoMeta 坏输入返回 null", () => {
		expect(parseCryptoMeta("not json")).toBeNull();
		expect(parseCryptoMeta(JSON.stringify({ schema: 1 }))).toBeNull();
	});
});
