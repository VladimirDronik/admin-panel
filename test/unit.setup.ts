import { createI18n } from 'vue-i18n';
import { createVuetify } from 'vuetify';
import { config } from '@/staticData/vuetify';
import messages from '@/locales/messages';

export const plugins = (language: string = 'en', plugins: any[] = []) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: language,
    messages,
  });
  const vuetify = createVuetify(config);

  return [i18n, vuetify, ...plugins];
};
