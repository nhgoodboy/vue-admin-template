import request from '@/utils/request'

export function getDeptNameList() {
  return request({
    url: '/admin/dept/deptNameList',
    method: 'get'
  })
}

export function fetchList(query) {
  return request({
    url: '/admin/dept/list',
    method: 'get',
    params: query
  })
}

export function deleteDept(id) {
  return request({
    url: '/admin/dept/delete',
    method: 'post',
    params: {
      id: id
    }
  })
}

export function createDept(form) {
  return request({
    url: '/admin/dept/create',
    method: 'post',
    data: form
  })
}

export function modifyDept(form) {
  return request({
    url: '/admin/dept/modify',
    method: 'post',
    data: form
  })
}
