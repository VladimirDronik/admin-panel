import comp from "C:/TouchOn/panel/admin-panel/docs/.vuepress/.temp/pages/frontend/composables.html.vue"
const data = JSON.parse("{\"path\":\"/frontend/composables.html\",\"title\":\"Composables and Helpers\",\"lang\":\"ru-RU\",\"frontmatter\":{},\"headers\":[],\"git\":{},\"filePathRelative\":\"frontend/composables.md\"}")
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
