import comp from "C:/TouchOn/panel/admin-panel/docs/.vuepress/.temp/pages/frontend/composables.html.vue"
const data = JSON.parse("{\"path\":\"/frontend/composables.html\",\"title\":\"Composables\",\"lang\":\"ru-RU\",\"frontmatter\":{},\"headers\":[{\"level\":2,\"title\":\"Main\",\"slug\":\"main\",\"link\":\"#main\",\"children\":[{\"level\":3,\"title\":\"updateData\",\"slug\":\"updatedata\",\"link\":\"#updatedata\",\"children\":[]}]},{\"level\":2,\"title\":\"Api\",\"slug\":\"api\",\"link\":\"#api\",\"children\":[{\"level\":3,\"title\":\"api\",\"slug\":\"api-1\",\"link\":\"#api-1\",\"children\":[]}]}],\"git\":{\"updatedTime\":1732401463000,\"contributors\":[{\"name\":\"Nikita Guryanov\",\"email\":\"nikgur177@gmail.com\",\"commits\":2,\"url\":\"https://github.com/Nikita Guryanov\"}]},\"filePathRelative\":\"frontend/composables.md\"}")
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
