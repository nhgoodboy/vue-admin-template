import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    avatar: '',
    account: '',
    name: '',
    sex: '',
    role: '',
    dept: '',
    email: '',
    phone: '',
    birthday: '',
    createTime: '',
    menus: null
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_SEX: (state, sex) => {
      state.sex = sex
    },
    SET_ROLE: (state, role) => {
      state.role = role
    },
    SET_DEPT: (state, dept) => {
      state.dept = dept
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_BIRTHDAY: (state, birthday) => {
      state.birthday = birthday
    },
    SET_CREATETIME: (state, createTime) => {
      state.createTime = createTime
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          // if (data.role && data.role.length > 0) { // 验证返回的roles是否是一个非空数组
          //   commit('SET_ROLE', data.role)
          // } else {
          //   reject('getInfo: roles must be a non-null array !')
          // }
          commit('SET_AVATAR', process.env.BASE_API + data.avatar)
          commit('SET_ACCOUNT', data.account)
          commit('SET_NAME', data.name)
          commit('SET_SEX', data.sex)
          commit('SET_ROLE', data.role)
          commit('SET_DEPT', data.dept)
          commit('SET_EMAIL', data.email)
          commit('SET_PHONE', data.phone)
          commit('SET_BIRTHDAY', data.birthday)
          commit('SET_CREATETIME', data.createTime)
          console.log('set:', JSON.stringify(data.menus))
          const menusSet = new Set(data.menus)
          commit('SET_MENUS', menusSet)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLE', '')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
