import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/user/userList',
    method: 'get',
    params: query
  })
}

export function deleteUser(id) {
  return request({
    url: '/admin/user/deleteUser',
    method: 'post',
    params: {
      id: id
    }
  })
}

export function createUser(form) {
  return request({
    url: '/admin/user/createUser',
    method: 'post',
    data: form
  })
}
