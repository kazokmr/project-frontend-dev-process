import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["<rootDir>/src/**/__tests__/**/*.test.[tj]s?(x)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(css|styl|less|sass|scss)$": "<rootDir>/.jest/__mocks__/styleMock.ts",
    "\\.mdx$": "<rootDir>/.jest/__mocks__/mdxMock.ts",
  },
};
export default config;
