export const siteData = JSON.parse("{\"base\":\"/\",\"lang\":\"ru-RU\",\"title\":\"TouchOn ❤️\",\"description\":\"Документация для разработчиков📄\",\"head\":[[\"link\",{\"rel\":\"icon\",\"sizes\":\"32x32\",\"href\":\"logo-dark.svg\"}]],\"locales\":{}}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSiteData) {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ siteData }) => {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  })
}
