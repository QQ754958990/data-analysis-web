import Axios from 'axios'

const axios_http = Axios.create({
  baseURL: 'http://192.168.50.129:3000/api',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }/*,
  // 这里对参数进行encode转码
  transformRequest: [function (data) {
    let newData = '';
    for (let k in data) {
      if (data.hasOwnProperty(k) === true) { // 浅查找
        newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
      }
    }
    return newData;
  }]*/
})

// 添加响应拦截器
axios_http.interceptors.request.use(function (request) {
  //全部转换为post方法
  if (request.method === 'get') {
    request.method = 'post'
    request.data = request.params
  }

  request.params = {token: localStorage.token}

  return request
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios_http.interceptors.response.use(function (response) {
  // 对响应数据做点什么

  return response
}, function (error) {
  // 对响应错误做点什么
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // 这里写清除token的代码
       location.href =  '#/login'
    }
  }
  return Promise.reject(error.response.data)
})

export default {
  install (Vue) {
    Vue.prototype.$http = axios_http
  }
}
