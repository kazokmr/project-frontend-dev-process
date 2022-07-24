import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  // verbose: true,
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.ts"
  ],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.test.[tj]s?(x)"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/.jest/style.ts"
  }
};
export default config;