import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/doLogin',
    method: 'get',
    params: {
      username,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/admin/user/userInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/doLogout',
    method: 'get'
  })
}
