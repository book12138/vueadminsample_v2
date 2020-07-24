export default {
  namespaced: true,
  state: {
    token: sessionStorage.getItem('token') || '', // token
    routeRedirectTarget: sessionStorage.getItem('routeRedirectTarget') || '' // 路由跳转目标（这是路由守卫在发现匿名用户的时候会用到的）
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      sessionStorage.setItem('token', token)
    },
    setrouteRedirectTarget (state, routeRedirectTarget) {
      state.routeRedirectTarget = routeRedirectTarget
      sessionStorage.setItem('routeRedirectTarget', routeRedirectTarget)
    }
  },
  actions: {
    setToken: (commit, token) => { commit('setToken', token) },
    setrouteRedirectTarget: (commit, routeRedirectTarget) => commit('setrouteRedirectTarget', routeRedirectTarget)
  },
  getters: {
    token: (state) => state.token,
    routeRedirectTarget: (state) => state.routeRedirectTarget
  }
}
