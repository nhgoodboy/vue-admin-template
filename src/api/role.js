import request from '@/utils/request'

export function getRoleNameList() {
  return request({
    url: '/admin/role/roleNameList',
    method: 'get'
  })
}
