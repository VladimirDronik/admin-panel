import comp from "C:/TouchOn/panel/admin-panel/docs/.vuepress/.temp/pages/frontend/helpers.html.vue"
const data = JSON.parse("{\"path\":\"/frontend/helpers.html\",\"title\":\"Helpers Functions\",\"lang\":\"ru-RU\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"Скоро\",\"slug\":\"скоро\",\"link\":\"#скоро\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"frontend/helpers.md\"}")
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
