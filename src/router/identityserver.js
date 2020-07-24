import Oidc from 'oidc-client'

export const config = {
  authority: 'http://localhost:5000',
  client_id: 'spaCore',
  redirect_uri: 'http://localhost:8888/#/callback?signin-oidc&',
  response_type: 'id_token token',
  scope: 'openid profile api1',
  post_logout_redirect_uri: 'http://localhost:8888/#/'
}

/**
 * 跳转至授权认证中心登录
 */
export const singin = () => {
  var mgr = new Oidc.UserManager(config)
  mgr.signinRedirect()
}
