module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: "eslint:recommended",

	overrides: [
		{
			files: ["src/**"],
			rules: {
				quotes: ["error", "double"],
			},
		},
	],
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	ignorePatterns: ".eslintrc.js",
	rules: {
		"@typescript-eslint/no-unused-vars": "off",
		"@typescript-eslint/no-explicit-any": "off"
	},
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
};
