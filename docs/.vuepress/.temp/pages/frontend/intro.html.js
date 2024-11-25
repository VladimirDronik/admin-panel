import comp from "C:/TouchOn/panel/admin-panel/docs/.vuepress/.temp/pages/frontend/intro.html.vue"
const data = JSON.parse("{\"path\":\"/frontend/intro.html\",\"title\":\"Introduction\",\"lang\":\"ru-RU\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"Скрипты проекта\",\"slug\":\"скрипты-проекта\",\"link\":\"#скрипты-проекта\",\"children\":[]},{\"level\":2,\"title\":\"Полезные ссылки\",\"slug\":\"полезные-ссылки\",\"link\":\"#полезные-ссылки\",\"children\":[]},{\"level\":2,\"title\":\"Стек\",\"slug\":\"стек\",\"link\":\"#стек\",\"children\":[]},{\"level\":2,\"title\":\"Конфигурация\",\"slug\":\"конфигурация\",\"link\":\"#конфигурация\",\"children\":[]},{\"level\":2,\"title\":\"Icons\",\"slug\":\"icons\",\"link\":\"#icons\",\"children\":[]}],\"git\":{\"updatedTime\":1732408150000,\"contributors\":[{\"name\":\"Nikita Guryanov\",\"email\":\"nikgur177@gmail.com\",\"commits\":8,\"url\":\"https://github.com/Nikita Guryanov\"}]},\"filePathRelative\":\"frontend/intro.md\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
