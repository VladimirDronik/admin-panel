import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import { config } from '@/staticData/vuetify';
import '@/scss/style.scss';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify(config);
  nuxtApp.vueApp.use(vuetify);
});
