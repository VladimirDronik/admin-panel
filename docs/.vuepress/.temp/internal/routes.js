export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"/Users/nikitaguranov/Desktop/admin-panel/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":"Главная"} }],
  ["/frontend/code-style.html", { loader: () => import(/* webpackChunkName: "frontend_code-style.html" */"/Users/nikitaguranov/Desktop/admin-panel/docs/.vuepress/.temp/pages/frontend/code-style.html.js"), meta: {"title":"Code Style"} }],
  ["/frontend/components.html", { loader: () => import(/* webpackChunkName: "frontend_components.html" */"/Users/nikitaguranov/Desktop/admin-panel/docs/.vuepress/.temp/pages/frontend/components.html.js"), meta: {"title":"Components"} }],
  ["/frontend/composables.html", { loader: () => import(/* webpackChunkName: "frontend_composables.html" */"/Users/nikitaguranov/Desktop/admin-panel/docs/.vuepress/.temp/pages/frontend/composables.html.js"), meta: {"title":"Composables"} }],
  ["/frontend/helpers.html", { loader: () => import(/* webpackChunkName: "frontend_helpers.html" */"/Users/nikitaguranov/Desktop/admin-panel/docs/.vuepress/.temp/pages/frontend/helpers.html.js"), meta: {"title":"Helpers Functions"} }],
  ["/frontend/intro.html", { loader: () => import(/* webpackChunkName: "frontend_intro.html" */"/Users/nikitaguranov/Desktop/admin-panel/docs/.vuepress/.temp/pages/frontend/intro.html.js"), meta: {"title":"Introduction"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"/Users/nikitaguranov/Desktop/admin-panel/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
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
