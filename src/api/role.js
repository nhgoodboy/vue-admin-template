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
