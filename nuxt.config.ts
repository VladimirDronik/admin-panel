import { searchForWorkspaceRoot } from 'vite';
import Noir from './theme/themeLight';
import { Components } from './utils/components';

export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

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
    server: {
      fs: {
        allow: [
          searchForWorkspaceRoot(process.cwd()),
          '/path/to/custom/allow',
        ],
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },

  ssr: false,

  routeRules: {
    '/': {
      redirect: '/auth/login',
    },
  },

  modules: [
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
    autoImport: false,
    components: {
      include: Components,
    },
    options: {
      theme: {
        preset: Noir,
        options: {
          prefix: 'p',
          darkModeSelector: '.p-dark',
          cssLayer: {
            name: 'primevue',
            order: 'tailwind-base, primevue, tailwind-utilities',
          },
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