import { describe, expect, it } from "vitest";
import { lockPath, metaPath, normalizeStorePath, storePaths } from "../src/store/paths";

describe("normalizeStorePath", () => {
	it("去首尾空白与斜杠", () => {
		expect(normalizeStorePath("  SettingProfiles  ")).toBe("SettingProfiles");
		expect(normalizeStorePath("/a/b/")).toBe("a/b");
		expect(normalizeStorePath("///x///")).toBe("x");
	});

	it("反斜杠归一为正斜杠（Windows 输入）", () => {
		expect(normalizeStorePath("900 Assets\\SettingProfiles")).toBe("900 Assets/SettingProfiles");
	});

	it("空 / 纯斜杠回落默认值", () => {
		expect(normalizeStorePath("")).toBe("SettingProfiles");
		expect(normalizeStorePath("   ")).toBe("SettingProfiles");
		expect(normalizeStorePath("///")).toBe("SettingProfiles");
	});
});

describe("storePaths（SPEC §2.1 结构）", () => {
	it("根级：_crypto.json 全 store 一份", () => {
		const p = storePaths("SettingProfiles");
		expect(p.root).toBe("SettingProfiles");
		expect(p.crypto).toBe("SettingProfiles/_crypto.json");
	});

	it("PC 池与移动池物理隔离", () => {
		const p = storePaths("store");
		expect(p.pcPool.base).toBe("store/pcconfig");
		expect(p.mobilePool.base).toBe("store/mobileconfig");
		expect(p.pcPool.app).toBe("store/pcconfig/app");
		expect(p.pcPool.plugins).toBe("store/pcconfig/plugins");
		expect(p.mobilePool.plugins).toBe("store/mobileconfig/plugins");
	});

	it("profiles 目录在根下", () => {
		expect(storePaths("store").profilesDir).toBe("store/profiles");
	});

	it("lock 只存在于 pcconfig 下（手机端无写池入口）", () => {
		expect(lockPath(storePaths("store"))).toBe("store/pcconfig/_lock.json");
	});

	it("meta 路径", () => {
		expect(metaPath(storePaths("store").pcPool)).toBe("store/pcconfig/_meta.json");
	});

	it("输入先规整再组路径", () => {
		const p = storePaths(" /My Store/ ");
		expect(p.root).toBe("My Store");
		expect(p.crypto).toBe("My Store/_crypto.json");
	});
});
