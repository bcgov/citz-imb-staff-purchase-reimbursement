/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverage: false,
  coverageDirectory: "./tests/coverage",
  rootDir: "./",
  testTimeout: 10000,
  setupFiles: ["dotenv/config"],
  coverageReporters: [
    [
      "lcov",
      {
        projectRoot: ".."
      }
    ]
  ],
};
