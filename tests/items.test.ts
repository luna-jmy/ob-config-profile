import { describe, expect, it } from "vitest";
import { fingerprint } from "../src/store/fingerprint";
import {
	appFileLabel,
	isCarryablePluginFile,
	isKnownAppFile,
	isMobileAllowedAppFile,
	SELF_PLUGIN_ID,
} from "../src/store/items";

describe("items 排除规则（SPEC §0.6 / §9.3）", () => {
	it("安装产物不带走，其余插件文件带走", () => {
		for (const artifact of ["main.js", "styles.css", "manifest.json"]) {
			expect(isCarryablePluginFile(artifact)).toBe(false);
		}
		expect(isCarryablePluginFile("data.json")).toBe(true);
	});

	it("自身插件 id 恒为 config-profile", () => {
		expect(SELF_PLUGIN_ID).toBe("config-profile");
	});
});

describe("app 文件清单", () => {
	it("workspace.json 不在可同步清单", () => {
		expect(isKnownAppFile("workspace.json")).toBe(false);
		expect(isKnownAppFile("app.json")).toBe(true);
	});

	it("移动端只允许 core / community 两个文件", () => {
		expect(isMobileAllowedAppFile("core-plugins.json")).toBe(true);
		expect(isMobileAllowedAppFile("community-plugins.json")).toBe(true);
		expect(isMobileAllowedAppFile("app.json")).toBe(false);
	});

	it("未知文件回落文件名本身", () => {
		expect(appFileLabel("whatever.json")).toBe("whatever.json");
	});
});

describe("fingerprint（跳过写入用）", () => {
	it("同输入同输出、不同输入不同输出", () => {
		expect(fingerprint("abc")).toBe(fingerprint("abc"));
		expect(fingerprint("abc")).not.toBe(fingerprint("abd"));
	});
});
