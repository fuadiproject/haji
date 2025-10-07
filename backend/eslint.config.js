import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      // Catch undefined variables
      "no-undef": "error",

      // Catch unused variables
      "no-unused-vars": "warn",

      // Require consistent return
      "consistent-return": "warn",

      // Prefer const/let over var
      "no-var": "error",
      "prefer-const": "warn",

      // Catch potential null/undefined issues
      "no-unreachable": "error",
      "no-constant-condition": "warn",
    },
  },
  {
    files: ["**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
