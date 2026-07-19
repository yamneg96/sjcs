/**
 * Mobile unit tests. Scoped to pure logic (SRS scheduling, parsers) — screens
 * and native modules need a device/dev-build and belong in E2E, not here.
 */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/modules/**/*.test.ts"],
  transform: {
    "^.+\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
  },
};
