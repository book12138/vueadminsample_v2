import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import BackStageMenu from '@/views/backstage/Menu.vue'

/**
 * 路由
 */
export const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/home',
    name: '首页',
    component: Home
  },
  {
    path: '/login',
    name: '登录',
    component: Login
  },
  {
    path: '/backstage/menu',
    name: '接口管理',
    component: BackStageMenu
  }
]
