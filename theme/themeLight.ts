import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

const Noir = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#EAF8F5',
      100: '#D5F2EB',
      200: '#C0EBE0',
      300: '#ABE4D6',
      400: '#96DDCC',
      500: '#82D7C2',
      600: '#6DD0B8',
      700: '#58C9AE',
      800: '#43C2A3',
      900: '#2EBC99',
      950: '#19B58F',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.950}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.900}',
          activeColor: '{primary.800}',
        },
        highlight: {
          background: '{primary.950}',
          focusBackground: '{primary.700}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
      dark: {
        primary: {
          color: '{primary.950}',
          contrastColor: '#000000',
          hoverColor: '{primary.900}',
          activeColor: '{primary.800}',
        },
      }
    },
  },
});

export default Noir;
