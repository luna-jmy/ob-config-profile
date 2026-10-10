import { describe, expect, it } from "vitest";
import { decideStartupRole } from "../src/store/role";

describe("decideStartupRole（SPEC §3.1：角色是本地偏好，无 lock）", () => {
	it("ask → 弹首次选择", () => {
		expect(decideStartupRole("ask")).toEqual({ kind: "ask" });
	});

	it("选过就静默进入角色，不再探测 / 弹窗", () => {
		expect(decideStartupRole("sync")).toEqual({ kind: "role", role: "sync" });
		expect(decideStartupRole("apply")).toEqual({ kind: "role", role: "apply" });
	});
});
