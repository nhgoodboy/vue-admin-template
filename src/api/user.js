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

export function getRolesList() {
  return request({
    url: '/admin/role/roleList',
    method: 'get'
  })
}

export function getDeptsList() {
  return request({
    url: '/admin/dept/deptList',
    method: 'get'
  })
}
