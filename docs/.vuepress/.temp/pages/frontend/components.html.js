import comp from "C:/TouchOn/panel/admin-panel/docs/.vuepress/.temp/pages/frontend/components.html.vue"
const data = JSON.parse("{\"path\":\"/frontend/components.html\",\"title\":\"Components\",\"lang\":\"ru-RU\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"UI Components\",\"slug\":\"ui-components\",\"link\":\"#ui-components\",\"children\":[]},{\"level\":2,\"title\":\"Base Components\",\"slug\":\"base-components\",\"link\":\"#base-components\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"frontend/components.md\"}")
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
