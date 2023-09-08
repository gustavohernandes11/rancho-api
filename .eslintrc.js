module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: "eslint:recommended",

	overrides: [
		{
			files: ["src/*.js", "src/*.ts"],
			rules: {
				quotes: ["error", "single"],
			},
		},
	],
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	ignorePatterns: ".eslintrc.js",
	rules: {
		"@typescript-eslint/no-unused-vars": "off",
	},
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
};
