import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

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
    '@nuxt/test-utils/module',
  ],

  nitro: {
    serveStatic: true,
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: '2024-07-29',
});
