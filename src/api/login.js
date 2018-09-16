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

export function getInfo(token) {
  return request({
    url: '/admin/user/userInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/doLogout',
    method: 'get'
  })
}
