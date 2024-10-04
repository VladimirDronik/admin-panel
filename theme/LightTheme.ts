import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const LightTheme: ThemeTypes = {
  name: 'PurpleTheme',
  dark: false,
  variables: {
    'border-color': '#eeeeee',
    'carousel-control-size': 10,
  },
  colors: {
    primary: '#19B58F',
    secondary: '#8ED078',
    info: '#FF634E',
    success: '#1EDAAB',
    warning: '#FFAE1F',
    error: '#FF634E',
    muted: '#5a6a85',
    lightprimary: '#D1F0E9',
    lightsecondary: '#EDFFE7',
    lightsuccess: '#E6FFFA',
    lighterror: '#FBF2EF',
    lightwarning: '#FEF5E5',
    textPrimary: '#2A3547',
    textSecondary: '#2A3547',
    borderColor: '#e5eaef',
    inputBorder: '#000',
    containerBg: '#ffffff',
    hoverColor: '#f6f9fc',
    surface: '#fff',
    'on-surface-variant': '#fff',
    grey100: '#F2F6FA',
    grey200: '#EAEFF4',
  },
};
export default LightTheme;
