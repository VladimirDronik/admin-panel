export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/frontend.html", { loader: () => import(/* webpackChunkName: "frontend.html" */"C:/TouchOn/panel/admin-panel/docs/.vuepress/.temp/pages/frontend.html.js"), meta: {"title":"Frontend"} }],
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"C:/TouchOn/panel/admin-panel/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":"Главная"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"C:/TouchOn/panel/admin-panel/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateRoutes) {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
  }
  if (__VUE_HMR_RUNTIME__.updateRedirects) {
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ routes, redirects }) => {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  })
}
