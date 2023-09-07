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
	ignorePatterns: ".eslintrc.js",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
};
