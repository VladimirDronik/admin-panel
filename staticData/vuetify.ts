import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import LightTheme from '@/theme/LightTheme';
import DarkTheme from '@/theme/DarkTheme';

export const config = {
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
};
