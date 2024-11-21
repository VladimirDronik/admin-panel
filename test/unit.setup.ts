import { createI18n } from 'vue-i18n';
import VueTablerIcons from 'vue-tabler-icons';
import messages from '@/locales/messages';

export const plugins = (language: string = 'en', plugins: any[] = []) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: language,
    messages,
  });

  return [i18n, ...plugins];
};

export const components = {
  VueTablerIcons,
};
