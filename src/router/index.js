import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './routes'
import { ordinaryInterceptor } from './routingGuard'

Vue.use(VueRouter)

/**
 * vue router 实例
 */
const router = new VueRouter({
  routes
})

/**
 *在跳转之前
 */
router.beforeEach((to, from, next) => ordinaryInterceptor(to, from, next)) /* 使用路由拦截器 */

export default router
