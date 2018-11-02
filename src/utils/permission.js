import store from '@/store'

/**
 * @param {String} code
 * @returns {Boolean}
 */
export default function checkPermission(code) {
  const permissions = store.getters && store.getters.permissions
  if (permissions && permissions.has(code)) {
    return true
  }
  return false
}
