import comp from "C:/TouchOn/panel/admin-panel/docs/.vuepress/.temp/pages/frontend/code-style.html.vue"
const data = JSON.parse("{\"path\":\"/frontend/code-style.html\",\"title\":\"Code Style\",\"lang\":\"ru-RU\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"Общие правила\",\"slug\":\"общие-правила\",\"link\":\"#общие-правила\",\"children\":[]},{\"level\":2,\"title\":\"Code Style Проекта\",\"slug\":\"code-style-проекта\",\"link\":\"#code-style-проекта\",\"children\":[]}],\"git\":{\"updatedTime\":1732405953000,\"contributors\":[{\"name\":\"Nikita Guryanov\",\"email\":\"nikgur177@gmail.com\",\"commits\":5,\"url\":\"https://github.com/Nikita Guryanov\"}]},\"filePathRelative\":\"frontend/code-style.md\"}")
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
