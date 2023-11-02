import type { Config } from "jest";

const config: Config = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  setupFiles: ["./jest.polyfills.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/__tests__/**/*.test.[tj]s?(x)"],
  coveragePathIgnorePatterns: [
    ".+\\.stories\\..+",
    "<rootDir>/.storybook/",
    "<rootDir>/src/mocks/",
    "<rootDir>/src/__tests__/",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleNameMapper: {
    "\\.(css|styl|less|sass|scss)$": "<rootDir>/.jest/__mocks__/styleMock.ts",
    "\\.mdx$": "<rootDir>/.jest/__mocks__/mdxMock.ts",
  },
};
export default config;
