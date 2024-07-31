module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
    'plugin:tailwindcss/recommended',
    'plugin:@intlify/vue-i18n/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-shadow': 'off',
    'no-console': 'off',
    'no-continue': 'off',
    'vue/max-len': 'off',
    'valid-typeof': 'off',
    'dot-notation': 'off',
    'guard-for-in': 'off',
    'linebreak-style': 'off',
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
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'vuejs-accessibility/anchor-has-content': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    '@intlify/vue-i18n/no-raw-text': ['warn', {
      ignorePattern: '^[-#:()&%x,+]+$',
      ignoreText: ['', '*', '.'],
    }],
    '@intlify/vue-i18n/no-unused-keys': [
      'error',
      {
        extensions: [
          '.js',
          '.vue',
        ],
      },
    ],
  },
  settings: {
    'vue-i18n': {
      localeDir: './utils/locales/*.{json,json5,yaml,yml}',
      messageSyntaxVersion: '^9.0.0',
    },
  },
};
