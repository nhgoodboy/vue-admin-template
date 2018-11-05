import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/user/list',
    method: 'get',
    params: query
  })
}

export function deleteUser(id) {
  return request({
    url: '/admin/user/delete',
    method: 'post',
    params: {
      id: id
    }
  })
}

export function createUser(form) {
  return request({
    url: '/admin/user/create',
    method: 'post',
    data: form
  })
}

export function modifyUser(form) {
  return request({
    url: '/admin/user/modify',
    method: 'post',
    data: form
  })
}

export function changePwd(form) {
  return request({
    url: '/admin/user/changePwd',
    method: 'post',
    params: {
      id: form.id,
      newPassword: form.newPassword
    }
  })
}

