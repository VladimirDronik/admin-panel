import { createI18n } from 'vue-i18n';
import VueTablerIcons from 'vue-tabler-icons';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
// Data Locales
import messages from '@/locales/messages';
// Styles
import 'vue3-perfect-scrollbar/style.css';
import '@/scss/style.scss';

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'ru',
    messages,
  });

  nuxtApp.vueApp.use(i18n);
  nuxtApp.vueApp.use(PerfectScrollbarPlugin);
  nuxtApp.vueApp.use(VueTablerIcons);
});
