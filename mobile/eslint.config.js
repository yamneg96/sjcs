// https://docs.expo.dev/guides/using-eslint/
const expoConfig = require("eslint-config-expo/flat");
const reactNative = require("eslint-plugin-react-native");
const { defineConfig, globalIgnores } = require("eslint/config");

module.exports = defineConfig([
  globalIgnores(["dist", ".expo", "node_modules"]),
  ...expoConfig,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-native": reactNative },
    rules: {
      // High-signal, low-noise RN rules — the app intentionally uses inline
      // styles + NativeWind, so no-inline-styles/no-color-literals stay off.
      "react-native/no-unused-styles": "warn",
      "react-native/no-single-element-style-arrays": "warn",
    },
  },
]);
