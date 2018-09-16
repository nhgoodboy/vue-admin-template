import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/admin/user/userList',
    method: 'get',
    params: query
  })
}
