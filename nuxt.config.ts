import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import { searchForWorkspaceRoot } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import Noir from './utils/themePrimeVue';

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      backendApi: '',
      mqttPort: '',
      translatorPort: '',
      objectManagetPort: '',
      actionRouterPort: '',
      websocketsPort: '',
      cctvPort: '',
    },
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    plugins: [
      nodePolyfills(),
    ],
    server: {
      fs: {
        allow: [
          // search up for workspace root
          searchForWorkspaceRoot(process.cwd()),
          // your custom rules
          '/path/to/custom/allow',
        ],
      },
    },
  },

  ssr: false,

  devtools: {
    enabled: true,
  },

  routeRules: {
    '/': {
      redirect: '/auth/login',
    },
  },

  build: {
    transpile: ['vuetify'],
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config?.plugins?.push(vuetify({ autoImport: true }));
      });
    },
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    '@primevue/nuxt-module',
    '@nuxt/test-utils/module',
  ],

  googleFonts: {
    download: true,
    families: {
      Manrope: true,
    },
  },

  pinia: {
    storesDirs: ['./stores/**', './custom-folder/stores/**'],
  },

  primevue: {
    options: {
      theme: {
        preset: Noir,
        options: {
          prefix: 'p',
          darkModeSelector: '.p-dark',
          cssLayer: false,
        },
      },
    },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: '2024-07-29',
});
