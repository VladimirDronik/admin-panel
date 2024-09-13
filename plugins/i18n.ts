import { createI18n } from 'vue-i18n';
import messages from '@/locales/messages';

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'ru',
    messages,
  });

  vueApp.use(i18n);
});
