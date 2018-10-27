import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(menus, route) {
  if (route.meta && route.meta.code) {
    console.log('6:' + JSON.stringify(menus instanceof Set) + ' 7:' + JSON.stringify(route))
    return new Set(menus).has(route.meta.code)
  } else {
    console.log('what...')
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, menus) {
  console.log('2:' + JSON.stringify(asyncRouterMap) + ' 3:' + JSON.stringify(menus))
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(menus, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, menus)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      console.log('4:' + JSON.stringify(state) + ' 5:' + JSON.stringify(routers))
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { menus } = data
        // if (role.indexOf('超级管理员') >= 0) {
        //   accessedRouters = asyncRouterMap
        // } else {
        //   accessedRouters = filterAsyncRouter(asyncRouterMap, role)
        // }
        const accessedRouters = filterAsyncRouter(asyncRouterMap, menus)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
