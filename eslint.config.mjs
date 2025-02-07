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
    "@vue/eslint-config-airbnb",
    "plugin:tailwindcss/recommended",
    "plugin:@intlify/vue-i18n/recommended",
    "@nuxt/eslint-config",
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
      "**.output/",
      "**.json",
      "**.mjs",
    ]
  },
  {
    rules: {
      "vue/valid-v-for": "off",
      "@typescript-eslint/no-explicit-any": 'off',
      "@intlify/vue-i18n/no-missing-keys": "off",

      camelcase: 'off',
      'no-underscore-dangle': 'off',
      'no-shadow': 'off',
      'no-console': 'off',
      'no-continue': 'off',
      'vue/max-len': 'off',
      'valid-typeof': 'off',
      'dot-notation': 'off',
      'guard-for-in': 'off',
      'linebreak-style': 'off',
      'no-multiple-empty-lines': ['error', {
        max: 1,
      }],
      "vue/max-attributes-per-line": ["warn", {
        "singleline": {
          "max": 1
        },      
        "multiline": {
          "max": 1
        }
      }],
      'no-spaced-func': 'off',
      'no-return-assign': 'off',
      'func-call-spacing': 'off',
      'import/extensions': 'off',
      'consistent-return': 'off',
      'prefer-object-spread': 'off',
      'no-restricted-syntax': 'off',
      'import/no-unresolved': 'off',
      'no-use-before-define': 'off',
      'vue/require-default-prop': 'off',
      'import/prefer-default-export': 'off',
      'vue/multi-word-component-names': 'off',
      'tailwindcss/no-custom-classname': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'import/no-extraneous-dependencies': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@intlify/vue-i18n/no-dynamic-keys': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'vuejs-accessibility/anchor-has-content': 'off',
      'vuejs-accessibility/form-control-has-label': 'off',

      "vue/attributes-order": ["warn", {
        "alphabetical": true
      }],

      "@intlify/vue-i18n/no-raw-text": ["warn", {
          ignorePattern: "^[-#:()&%x,+]+$",
          ignoreText: ["", "*", ".", "...", '°'],
      }],

      "@intlify/vue-i18n/no-unused-keys": ["error", {
          extensions: [".js", ".vue"],
      }],
    }
  }
];
