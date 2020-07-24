/**
 * axios 请求api地址
 */
const api = {
  login: '/api/Account/Login', // 登录获取token
  register: '/api/Account/Register', // 注册
  usernameExists: '​/api​/Account​/UsernameExists​/', // 检测用户名是否已存在
  addMenu: '/api/Permission/addMenu' // 添加菜单
}

export { api }
