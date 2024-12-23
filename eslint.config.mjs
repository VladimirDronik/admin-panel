import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,ts,vue}"]
  },
  {
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...compat.extends(
    "@nuxt/eslint-config",
    "plugin:tailwindcss/recommended",
    "plugin:@intlify/vue-i18n/recommended",
  ),
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    }
  },
  {
    ignores: [
      "**docs/",
      "**.nuxt/",
      "**.json",
      "**.mjs",
    ]
  },
  {
    rules: {
      "vue/valid-v-for": "off",
      "tailwindcss/no-custom-classname": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": 'off',
      "@intlify/vue-i18n/no-missing-keys": "off", // need update

      "vue/attributes-order": ["warn", {
        "alphabetical": true
      }],

      "@intlify/vue-i18n/no-raw-text": ["warn", {
          ignorePattern: "^[-#:()&%x,+]+$",
          ignoreText: ["", "*", ".", "..."],
      }],

      "@intlify/vue-i18n/no-unused-keys": ["error", {
          extensions: [".js", ".vue"],
      }],
    }
  }
];