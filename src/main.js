import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'
import ElementUI from 'element-ui'
import Axios from 'axios'
import VueAxios from 'vue-axios'
import '@/global/globalCss.less'
import 'element-ui/lib/theme-chalk/index.css'
import '@/font/ali-font.less'
import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueAxios, Axios)

Vue.prototype.$store = store

/**
 * 向后回退
 */
Vue.prototype.back = function () {
  if (window.history.length > 1) {
    this.$router.back()
  } else {
    this.$router.push('/')
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
