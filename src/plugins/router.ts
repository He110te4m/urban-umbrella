import { createRouter, createWebHashHistory } from 'vue-router'
import routes from '~pages'

export const init: AppPlugin['init'] = ({ app }) => {
  app.use(getRouter())
}

function getRouter() {
  // 添加默认首页，可以自动跳转路由
  if (routes.length) {
    routes.reverse().unshift({
      path: '/',
      redirect: routes[0].path,
    })
  }

  if (import.meta.env.DEV) {
    window.console.log('routes: ', routes)
  }

  return createRouter({
    history: createWebHashHistory(),
    routes,
  })
}
