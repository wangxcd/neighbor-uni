import cache from '@/utils/storage'
import keys from '@/config/keys'

const cacheAutoLogin = cache.getCache(keys.IS_AUTO_LOGIN)
const cacheToken = cache.getCache(keys.TOKEN_KEY)
const cacheUserInfo = cache.getCache(keys.USER_INFO)
const cacheUid = cache.getCache(keys.UID)
const cacheLiveComms = cache.getCache(keys.LIVE_COMMS)

const state = {
  isAutoLogin: cacheAutoLogin || 'Y',
  token: cacheToken || {},
  userInfo: cacheUserInfo || null,
  uid: cacheUid || null,
  liveComms: cacheLiveComms || [] // 常居小区数组
}

const mutations = {
  SET_TOKEN(state, tokenVal) {
    if (tokenVal) {
      state.token = tokenVal
      state.isAutoLogin = 'Y'
      cache.setCache(keys.TOKEN_KEY, tokenVal)
      cache.setCache(keys.IS_AUTO_LOGIN, 'Y')
    } else {
      cache.setCache(keys.TOKEN_KEY, {})
    }
  },
  SET_UID(state, uid) {
    state.uid = uid
    cache.setCache(keys.UID, uid)
  },
  SET_USER(state, userInfo) {
    if (userInfo) {
      state.userInfo = userInfo
      cache.setCache(keys.USER_INFO, userInfo)
      if (userInfo.uid) {
        state.uid = Number(userInfo.uid)
        cache.setCache(keys.UID, userInfo.uid)
      }
    }
  },
  UPDATE_LOGIN(state, token) {
    state.token = token
  },
  LOGINOUT(state, isAutoLogin) {
    state.token = undefined
    state.uid = undefined
    state.userInfo = undefined
    state.liveComms = []
    state.isAutoLogin = isAutoLogin
    cache.clearCache(keys.TOKEN_KEY)
    cache.clearCache(keys.UID)
    cache.clearCache(keys.USER_INFO)
    cache.clearCache(keys.LIVE_COMMS)
    cache.setCache(keys.IS_AUTO_LOGIN, isAutoLogin)
  },
  UPDATE_USERINFO(state, userInfo) {
    state.userInfo = userInfo
    cache.setCache(keys.USER_INFO, userInfo)
  },
  SET_LIVE_COMMS(state, userLiveComms) {
    if (userLiveComms) {
      state.liveComms = userLiveComms
      cache.setCache(keys.LIVE_COMMS, userLiveComms)
    }
  }
}

const actions = {
  setToken({ commit }, token) {
    commit('SET_TOKEN', token)
  },
  setUser({ commit }, user) {
    commit('SET_USER', user)
  },
  setUid({ commit }, uid) {
    commit('SET_UID', uid)
  },

  /**
   * 根据用户名登录
   * @param {*} loginRes
   * @returns
   */
  login({ commit }, loginRes) {
    if (loginRes && loginRes.Authorization) {
      commit('SET_TOKEN', loginRes.Authorization)
      if (loginRes.userInfo) {
        let userInfo = { ...loginRes.userInfo }
        userInfo.isTmpUser = loginRes.isTmpUser ? loginRes.isTmpUser : false
        commit('SET_USER', userInfo)
      }
    }
  },

  // 得到当前用户
  getUserInfo({ commit }) {
    return new Promise((resolve, reject) => {
      if (state.token.access_token === '') {
        reject(new Error('token is undefined!'))
      } else {
        getUserInfo().then((res) => {
          commit('UPDATE_USERINFO', res.data)
          resolve(res.data)
        })
      }
    })
  },

  // 登出系统
  loginOut({ commit }) {
    return new Promise((resolve, reject) => {
      commit('LOGINOUT', 'Y')
    })
  },

  // 主动退出登录
  actLoginOut({ commit }) {
    return new Promise((resolve, reject) => {
      commit('LOGINOUT', 'N')
    })
  },

  undaUserInfo({ commit }, userInfo) {
    commit('UPDATE_USERINFO', userInfo)
  },

  undaLogin({ commit }, token) {
    commit('UPDATE_LOGIN', token)
  },

  setLiveComms({ commit }, userLiveComms) {
    commit('SET_LIVE_COMMS', userLiveComms)
  }
}

const getters = {
  isAutoLogin: (state) => state.isAutoLogin === 'Y',
  token: (state) => state.token,
  userInfo: (state) => state.userInfo,
  uid: (state) => state.uid,
  isLogin: (state) => !!(state.token && state.token.accessToken),
  userliveComms: (state) => state.liveComms
}

export default {
  state,
  mutations,
  actions,
  getters
}
