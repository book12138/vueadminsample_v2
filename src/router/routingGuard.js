import { singin } from './identityserver'
import store from '@/store'

/**
 * 普通拦截器
 * @param to 要到那里去
 * @param from 从哪里来
 * @param next 执行下一步
 */
function ordinaryInterceptor (to, from, next) {
  if (to.fullPath === '/login') { next() }

  /* 检查用户是否登录 */
  if (store.getters['global/token'] !== '') { /* 已登录 */
    next()
  } else {
    store.commit('global/setrouteRedirectTarget', to.fullPath)
    /* 跳转至登录页面 */
    next({
      path: '/login'
    })
  }
}

/**
 * identity server 拦截器
 * @param to 要到那里去
 * @param from 从哪里来
 * @param next 执行下一步
 */
function identityServerInterceptor (to, from, next) {
  if (to.fullPath === '/login') { next() }

  /* 检查用户是否登录 */
  if (store.getters['global/token'] !== '') {
    /* 已经获得了认证 */
    next()
  } else {
    store.commit('global/setrouteRedirectTarget', to.fullPath)
    /* 执行identity server业务逻辑 */
    singin()
  }
}

export { ordinaryInterceptor, identityServerInterceptor }
