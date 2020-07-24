/**
 * axios 请求api地址
 */
const api = {
  login: 'api/Account/Login', // 登录获取token
  register: 'api/Account/Register', // 注册
  usernameExists: '​api​/Account​/UsernameExists​/', // 检测用户名是否已存在
  addMenu: 'api/Permission/AddMenu', // 添加菜单
  getMenuCascaderData: 'api/Permission/GetCascaderData' // 获取级联菜单选择器的展示数据
}

export { api }
