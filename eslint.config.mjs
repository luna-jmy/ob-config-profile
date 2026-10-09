import obsidianmd from "eslint-plugin-obsidianmd";

/**
 * 官方 obsidianmd ESLint 预设（零 error 方可合并）。
 *
 * 兼容性说明（与 ob-quick-journal 同款解法）：eslint-plugin-obsidianmd 的
 * configs.recommended 在配置对象里使用了 `extends` 键，ESLint 9 会直接报错；
 * 用 inlineExtends() 把 `extends` 声明式展开为扁平配置，规则集本身不做增删。
 */
function inlineExtends(items) {
	const out = [];
	for (const item of items) {
		if (item && typeof item === "object" && "extends" in item) {
			const { extends: ext, ...rest } = item;
			for (const e of ext) {
				if (Array.isArray(e)) {
					out.push(...inlineExtends(e));
				} else {
					out.push(e);
				}
			}
			if (Object.keys(rest).length > 0) {
				out.push(rest);
			}
		} else {
			out.push(item);
		}
	}
	return out;
}

export default [
	{
		ignores: ["node_modules/**", "main.js", "coverage/**", "esbuild.config.mjs"],
	},
	...inlineExtends([...obsidianmd.configs.recommended]),
	{
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	/*
	 * 既定取舍（ob-tdk-general AGENTS.md §4.8）：minAppVersion 1.8.7 下设置页只能实现
	 * display()，1.13 起它被标记弃用——降为 warn 接受，不当作待修问题；改用声明式设置
	 * API 的前提是把 minAppVersion 提到 1.13，那是产品决定。
	 */
	{
		files: ["src/settings.ts"],
		rules: {
			"@typescript-eslint/no-deprecated": "warn",
			// sentence-case 对路径占位符（如 setPlaceholder("SettingProfiles")）误报；
			// 本仓 UI 文案主体是中文 t() 键，该规则对中文不适用——整文件关闭可接受。
			"obsidianmd/ui/sentence-case": "off",
		},
	},
	/*
	 * 既定例外（通用约束「内部 API 收口」）：config-adapter 是访问宿主内部面的唯一文件
	 * （DataAdapter 读写 .obsidian、Platform 探测、后续 app:reload）。锁文件/配置 JSON 的
	 * 动态结构不可静态知，no-unsafe 系列对它没有意义。例外写进配置（可 review、可删除），
	 * 不在行内绕过。对外返回值仍一律具体类型，不外漏 any。
	 */
	{
		files: ["src/services/config-adapter.ts"],
		rules: {
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/no-unsafe-return": "off",
		},
	},
];
