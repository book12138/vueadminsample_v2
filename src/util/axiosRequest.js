import axios from 'axios' // 引入 axios

/** http请求的基地址 */
const baseUrl = 'https://localhost:27644/'

/**
 * 创建axios请求实例
 * @param contentType 请求文类型
 * @returns axios 实例对象
 */
function createAxiosInstance (contentType) {
  const http = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    timeout: 10000, // 请求的过期时间
    headers: {
      'Content-Type': contentType === 'formdata' ? 'application/json' : 'application/json', // application/x-www-form-urlencoded
      // 'content-type': "application/json;charset=utf-8",
      Authorization: 'Bearer ' + (sessionStorage.getItem('token') || '') // token
    }
    // transformRequest: [(data) => {
    //   let newData = ''
    //   for (const k in data) {
    //     if (data.hasOwnProperty(k) === true) {
    //       newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
    //     }
    //   }
    //   return newData
    // }]
  })

  return http
}

/**
 * 发起 get 请求
 * @param api 具体的api请求
 * @param params 请求的参数
 * @param succCallBackHandler 请求成功时执行的回调
 * @param failCallBackHandler 请求失败时执行的回调
 */
function _get (api, params, succCallBackHandler, failCallBackHandler = errorInfo => { console.log('+++++++请求失败，失败信息为：' + errorInfo) }) {
  const http = createAxiosInstance('querystring')
  console.log('即将开始发送get请求')
  http.get(api, params)
    .then((response) => {
      if (response.status === 200) succCallBackHandler(response.data)
      else {
        errorRequestStatusHandler(response.status)
        failCallBackHandler(response)
      }
    })
    .catch((error) => {
      failCallBackHandler(error)
      console.log('请求地址为：' + api)
    })
}

/**
 * 发起 post 请求
 * @param api 具体的api请求
 * @param params 请求的参数
 * @param succCallBackHandler 请求成功时执行的回调
 * @param failCallBackHandler 请求失败时执行的回调
 */
function _post (api, params, succCallBackHandler, failCallBackHandler = errorInfo => { console.log('+++++++请求失败，失败信息为：' + errorInfo) }) {
  const http = createAxiosInstance('formdata')
  console.log('即将开始发送post请求')
  http.post(api, params)
    .then((response) => {
      if (response.status === 200) succCallBackHandler(response.data)
      else {
        errorRequestStatusHandler(response.status)
        failCallBackHandler(response)
      }
    })
    .catch((error) => {
      failCallBackHandler(error)
      console.log('请求地址为：' + api)
    })
}

/**
* 发起 put 请求
* @param api 具体的api请求
* @param params 请求的参数
* @param succCallBackHandler 请求成功时执行的回调
* @param failCallBackHandler 请求失败时执行的回调
*/
function _put (api, params, succCallBackHandler, failCallBackHandler = errorInfo => { console.log('+++++++请求失败，失败信息为：' + errorInfo) }) {
  const http = createAxiosInstance('formdata')
  http.put(api, params)
    .then((response) => {
      if (response.status === 200) succCallBackHandler(response.data)
      else {
        errorRequestStatusHandler(response.status)
        failCallBackHandler(response)
      }
    })
    .catch((error) => {
      failCallBackHandler(error)
    })
}

/**
* 发起 delete 请求
* @param api 具体的api请求
* @param params 请求的参数
* @param succCallBackHandler 请求成功时执行的回调
* @param failCallBackHandler 请求失败时执行的回调
*/
function _delete (api, params, succCallBackHandler, failCallBackHandler = errorInfo => { console.log('+++++++请求失败，失败信息为：' + errorInfo) }) {
  const http = createAxiosInstance('querystring')
  http.delete(api, params)
    .then((response) => {
      if (response.status === 200) succCallBackHandler(response.data)
      else {
        errorRequestStatusHandler(response.status)
        failCallBackHandler(response)
      }
    })
    .catch((error) => {
      failCallBackHandler(error)
    })
}

/**
 * 错误请求处理程序
 * @param status 请求结果状态码
 */
function errorRequestStatusHandler (status) {
  switch (parseInt(status)) {
    case 401:
      console.log('401 错误，用户权限不够')

      break

    case 404:
      console.log('404 错误，当前请求地址无效')

      break

    case 500:
      console.log('500 错误，服务器内部出现异常')

      break
    default:
      break
  }
}

export {
  _get,
  _post,
  _put,
  _delete
}
