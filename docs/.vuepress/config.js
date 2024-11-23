import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineUserConfig({
  lang: 'ru-RU',

  head: [
    ['link', { rel: "icon", sizes: "32x32", href: "logo-dark.svg"}],
  ],

  title: 'TouchOn ❤️',
  description: 'Документация для разработчиков📄',

  theme: defaultTheme({
    navbar: [
      '/',
      {
        text: 'Frontend',
        link: '/frontend/intro'
      },
    ],
    sidebar: [
      '/frontend/intro',
      '/frontend/components',
      '/frontend/composables',
      '/frontend/helpers',
      '/frontend/code-style',
    ],
  }),

  bundler: viteBundler({
    viteOptions: {
      css: {
        postcss: {
          plugins: [
            autoprefixer(),
            tailwindcss()
          ]
        }
      }
    }
  }),
  
})
