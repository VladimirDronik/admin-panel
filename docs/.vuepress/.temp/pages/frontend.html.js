import comp from "C:/TouchOn/panel/admin-panel/docs/.vuepress/.temp/pages/frontend.html.vue"
const data = JSON.parse("{\"path\":\"/frontend.html\",\"title\":\"Frontend\",\"lang\":\"ru-RU\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"Components\",\"slug\":\"components\",\"link\":\"#components\",\"children\":[{\"level\":3,\"title\":\"UI Components\",\"slug\":\"ui-components\",\"link\":\"#ui-components\",\"children\":[]},{\"level\":3,\"title\":\"Base Components\",\"slug\":\"base-components\",\"link\":\"#base-components\",\"children\":[]}]}],\"git\":{},\"filePathRelative\":\"frontend.md\"}")
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
