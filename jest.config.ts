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
	collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/src/main/**"],
};

export default config;
