import request from '@/utils/request'

export function getDeptNameList() {
  return request({
    url: '/admin/dept/deptNameList',
    method: 'get'
  })
}
