import request from '@/utils/request'

export function getRoleNameList() {
  return request({
    url: '/admin/role/roleNameList',
    method: 'get'
  })
}

export function fetchList(query) {
  return request({
    url: '/admin/role/list',
    method: 'get',
    params: query
  })
}

export function deleteRole(id) {
  return request({
    url: '/admin/role/delete',
    method: 'post',
    params: {
      id: id
    }
  })
}

export function createRole(form) {
  return request({
    url: '/admin/role/create',
    method: 'post',
    data: form
  })
}

export function modifyRole(form) {
  return request({
    url: '/admin/role/modify',
    method: 'post',
    data: form
  })
}

export function getMenusTree(roleId) {
  return request({
    url: `/admin/role/menusTree/${roleId}`,
    method: 'get'
  })
}
