// import { defineConfig } from 'vitest/config';
// import vue from '@vitejs/plugin-vue';

// export default defineConfig({
//   plugins: [vue()],
//   test: {
//     globals: true,
//     environment: 'happy-dom',
//     server: {
//       deps: {
//         inline: ['vuetify'],
//       },
//     },
//   },
//   resolve: {
//     alias: {
//       '@': process.cwd(),
//       '~': process.cwd(),
//     },
//   },
// });

import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    globals: true,
    environment: 'nuxt',
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
  },
  resolve: {
    alias: {
      '@': process.cwd(),
      '~': process.cwd(),
    },
  },
});
