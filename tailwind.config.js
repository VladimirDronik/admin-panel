/** @type {import('tailwindcss').Config} */

import tailwindPrimeVue from 'tailwindcss-primeui';

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  prefix: 'tw-',
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Manrope', 'sans-serif'],
      display: ['Manrope', 'sans-serif'],
      body: ['Manrope', 'sans-serif'],
    },
    fontSize: {
      xs: '0.625rem',
      sm: '0.75rem',
      base: '0.875rem',
      lg: '1rem',
      xl: '1.125rem',
      '2xl': '1.375rem',
      '3xl': '1.75rem',
    }
  },
  plugins: [tailwindPrimeVue],
};
