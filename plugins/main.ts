import { createI18n } from 'vue-i18n';
import GridLayout from 'vue-grid-layout3';
import VueTablerIcons from 'vue-tabler-icons';
// Data Locales
import messages from '@/locales/messages';
// Styles
import '@/scss/style.scss';

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'ru',
    messages,
  });

  nuxtApp.vueApp.use(i18n);
  nuxtApp.vueApp.use(VueTablerIcons);
  nuxtApp.vueApp.use(GridLayout);
});
