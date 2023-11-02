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
	collectCoverage: false,
	transformIgnorePatterns: ["\\\\node_modules\\\\"],
	preset: "@shelf/jest-mongodb",

	moduleNameMapper: {
		"@/(.*)": "<rootDir>/src/$1",
		"@domain/(.*)": "<rootDir>/src/domain/$1",
		"@data/(.*)": "<rootDir>/src/data/$1",
		"@infra/(.*)": "<rootDir>/src/infra/$1",
		"@presentation/(.*)": "<rootDir>/src/presentation/$1",
		"@main/(.*)": "<rootDir>/src/main/$1",
		"@validation/(.*)": "<rootDir>/src/validation/$1",
	},
};

export default config;
