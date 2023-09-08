/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
	roots: ["<rootDir>/src"],
	testMatch: [
		"**/__tests__/**/*.+(ts|tsx|js)",
		"**/?(*.)+(spec|test).+(ts|tsx|js)",
	],
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
	},
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: "coverage",
	coveragePathIgnorePatterns: ["\\\\node_modules\\\\"],
	coverageProvider: "v8",
	transformIgnorePatterns: ["\\\\node_modules\\\\"],
};

export default config;
