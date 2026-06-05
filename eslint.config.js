import eslint from "@eslint/js";
import globals from "globals";

export default [
  eslint.configs.recommended,
  {
    ignores: [
      "themes/**",
      "releases/**",
      "site/**",
      "preview/**",
      "node_modules/**",
      "web/src/**",
      "web/*.ts",
      "web/tsconfig*.json",
    ],
  },
  {
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];
