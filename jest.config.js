module.exports = {
  verbose: true,
  roots: [
    "<rootDir>/src"
  ],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
};
