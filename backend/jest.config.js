/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  testMatch: ["**/*.test.ts"],
  // These suites hit a real MongoDB; give connections room to settle.
  testTimeout: 30000,
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  // Run serially: suites share one database.
  maxWorkers: 1,
};
