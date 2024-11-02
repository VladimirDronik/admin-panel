/** @type {import('tailwindcss').Config} */
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
  },
  plugins: [['tailwindcss-primeui']],
};
