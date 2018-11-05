import request from '@/utils/request'

export function editUserInfo(form) {
  return request({
    url: '/admin/userInfo/editUserInfo',
    method: 'post',
    data: form
  })
}

export function changeAvatar(userHeadId) { // REST风格
  return request({
    url: `/admin/userInfo/changeAvatar/${userHeadId}`, // 字符串带参数写法
    method: 'put'
  })
}

export function getInfo() {
  return request({
    url: '/admin/userInfo/userInfo',
    method: 'get'
  })
}
