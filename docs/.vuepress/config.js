import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  lang: 'ru-RU',

  title: 'TouchOn ❤️',
  description: 'Документация 📄',

  theme: defaultTheme({
    navbar: ['/', '/frontend'],
  }),

  bundler: viteBundler(),
})
