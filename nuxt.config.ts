import { searchForWorkspaceRoot } from 'vite';
import Noir from './theme/themeLight';
import { Components } from './utils/components';

export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
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
    '@vueuse/nuxt',
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
      pt: {
        steppanel: {
          root: {
            style: {
              background: 'none',
            },
          },
        },
        TabPanels: {
          root: {
            style: {
              background: 'none',
            },
          },
        },
        tabList: {
          tabList: {
            style: {
              background: 'none',
            },
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
