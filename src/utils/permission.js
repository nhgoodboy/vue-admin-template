import store from '@/store'

/**
 * @param {String} code
 * @returns {Boolean}
 */
export default function checkPermission(code) {
  const menus = store.getters && store.getters.menus
  if (menus && menus.has(code)) {
    return true
  }
  return false
}
