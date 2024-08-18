import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@/scss/style.scss';
import LightTheme from '@/theme/LightTheme';
import DarkTheme from '@/theme/DarkTheme';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'LightTheme',
      themes: {
        LightTheme,
        DarkTheme,
      },
    },
    defaults: {
      VCard: {
        rounded: 'md',
      },
      VTextField: {
        variant: 'outlined',
        density: 'comfortable',
        color: 'primary',
      },
      VTextarea: {
        variant: 'outlined',
        density: 'comfortable',
        color: 'primary',
      },
      VSelect: {
        variant: 'outlined',
        density: 'comfortable',
        color: 'primary',
      },
      VListItem: {
        minHeight: '45px',
      },
      VTooltip: {
        location: 'top',
      },
    },
  });
  nuxtApp.vueApp.use(vuetify);
});
