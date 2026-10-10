import { describe, expect, it } from "vitest";
import {
	buildMobileProfile,
	emptyProfile,
	filterCommunityListForMobile,
	isValidProfileName,
	normalizeProfileName,
	parseProfile,
	profileFileName,
	profileFromFileName,
	serializeProfile,
} from "../src/store/profile";

describe("profile 文件名", () => {
	it("desktop / mobile 两形态", () => {
		expect(profileFileName("daily", "desktop")).toBe("daily.json");
		expect(profileFileName("daily", "mobile")).toBe("daily.mobile.json");
	});

	it("反解 roundtrip", () => {
		expect(profileFromFileName("daily.json")).toEqual({ name: "daily", platform: "desktop" });
		expect(profileFromFileName("daily.mobile.json")).toEqual({ name: "daily", platform: "mobile" });
	});

	it("不认识的文件名忽略", () => {
		expect(profileFromFileName("readme.md")).toBeNull();
		expect(profileFromFileName(".json")).toBeNull();
		expect(profileFromFileName(".mobile.json")).toBeNull();
	});
});

describe("名称规则", () => {
	it("去首尾空白并剥掉路径分隔符", () => {
		expect(normalizeProfileName("  a/b\\c ")).toBe("abc");
	});
	it("合法性 = 归一后非空", () => {
		expect(isValidProfileName("x")).toBe(true);
		expect(isValidProfileName(" / ")).toBe(false);
	});
});

describe("parseProfile", () => {
	it("serialize → parse roundtrip", () => {
		const doc = emptyProfile("work", "desktop");
		doc.app = ["app.json"];
		doc.plugins = ["a", "b"];
		const parsed = parseProfile(serializeProfile(doc));
		expect(parsed.ok).toBe(true);
		if (parsed.ok) expect(parsed.profile).toEqual(doc);
	});

	it("坏 JSON / 缺字段 / 坏 platform 拒绝", () => {
		expect(parseProfile("not json").ok).toBe(false);
		expect(parseProfile("{}").ok).toBe(false);
		expect(parseProfile(JSON.stringify({ name: "x", platform: "tablet" })).ok).toBe(false);
	});

	it("数组字段类型不对时回落空数组（不整份拒绝）", () => {
		const raw = JSON.stringify({ name: "x", platform: "desktop", plugins: [1, "a"] });
		const parsed = parseProfile(raw);
		expect(parsed.ok).toBe(true);
		if (parsed.ok) expect(parsed.profile.plugins).toEqual([]);
	});
});

describe("buildMobileProfile（移动投影）", () => {
	const source = emptyProfile("work", "desktop");
	source.app = ["app.json", "appearance.json", "core-plugins.json", "community-plugins.json"];
	source.plugins = ["cal", "vim", "editor"];
	source.snippets = ["a.css"];
	source.themes = ["Moonstone"];

	it("只留移动允许的 app 文件，剔除桌面专属插件，清空外观类", () => {
		const mobile = buildMobileProfile(source, new Set(["vim"]));
		expect(mobile.platform).toBe("mobile");
		expect(mobile.adaptedFrom).toBe("work");
		expect(mobile.app).toEqual(["core-plugins.json", "community-plugins.json"]);
		expect(mobile.plugins).toEqual(["cal", "editor"]);
		expect(mobile.snippets).toEqual([]);
		expect(mobile.themes).toEqual([]);
	});
});

describe("filterCommunityListForMobile", () => {
	it("剔除桌面专属 id", () => {
		const out = filterCommunityListForMobile('["a","vim","b"]', new Set(["vim"]));
		expect(JSON.parse(out)).toEqual(["a", "b"]);
	});

	it("坏 JSON / 非字符串数组原样返回", () => {
		const bad = "{oops";
		expect(filterCommunityListForMobile(bad, new Set(["x"]))).toBe(bad);
		const mixed = '["a", 1]';
		expect(filterCommunityListForMobile(mixed, new Set(["x"]))).toBe(mixed);
	});
});
