import comp from "C:/TouchOn/panel/admin-panel/docs/.vuepress/.temp/pages/index.html.vue"
const data = JSON.parse("{\"path\":\"/\",\"title\":\"Главная\",\"lang\":\"ru-RU\",\"frontmatter\":{\"home\":true,\"title\":\"Главная\",\"heroImage\":\"logo.svg\",\"features\":[{\"title\":\"Components 😮\",\"details\":\"Набор компонентов для создания административной панели, использующий впечатляющие компоненты Vue.\"},{\"title\":\"Готовые функции 😊\",\"details\":\"Готовые функции упрощают работу, избавляя от необходимости повторять один и тот же код, также упрощая взаимодействие с данными сервера.\"},{\"title\":\"Поддержка 😝\",\"details\":\"Создан лучшими разработчиками мира, постоянно обновляется по мере разработки проекта.\"}],\"footer\":\"Created by Nikita Guryanov\"},\"headers\":[{\"level\":2,\"title\":\"Доп Информация\",\"slug\":\"доп-информация\",\"link\":\"#доп-информация\",\"children\":[]}],\"git\":{\"updatedTime\":1732393185000,\"contributors\":[{\"name\":\"Nikita Guryanov\",\"email\":\"nikgur177@gmail.com\",\"commits\":3,\"url\":\"https://github.com/Nikita Guryanov\"},{\"name\":\"Никита Гурьянов\",\"email\":\"nikgur177@gmail.com\",\"commits\":1,\"url\":\"https://github.com/Никита Гурьянов\"}]},\"filePathRelative\":\"README.md\"}")
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
