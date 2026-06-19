import store from '@/store'
import loginApi from '../api/login'
import routine from './routine'
import appstate from './appstate'

/**
 * 刷新token
 */
const refreshTokenFn = function (refreshToken) {
  return loginApi.refreshToken(refreshToken).then((res) => {
    store.dispatch('user/setToken', res.token)
  })
}

/**
 * 小程序登录(小程序授权+登录)
 */
const authMpUserInfo = function () {
  return new Promise((resolve, reject) => {
    routine.getUserProfile().then((user) => {
      loginApi
        .mpLogin(user)
        .then((res) => {
          if (res.data) {
            const _res = res.data
            store.dispatch('user/setToken', {
              ..._res.Authorization
            })
            store.dispatch('user/setUid', Number(_res.uid))
          }
          return resolve(res)
        })
        .catch((err) => {
          return reject(err)
        })
    })
  })
}

/**
 * 小程序登录(已获取小程序授权后)
 */
const mpUserInfo = (userData) => {
  return new Promise((resolve, reject) => {
    loginApi
      .mpLogin(userData)
      .then((res) => {
        if (res.code === 0) {
          const _res = res.data
          return resolve(_res)
        }
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

/**
 * 临时用户登录
 * @returns
 */
const authTmpUserInfo = function () {
  return loginApi
    .h5TmpLogin()
    .then((res) => {
      if (res.data) {
        const _res = res.data
        store.dispatch('user/login', _res)
      }
    })
    .catch((err) => {
      return Promise.reject({
        msg: '临时用户登录异常'
      })
    })
}

/**
 * 自动登录
 * 小程序：openid登录，h5:临时用户登录
 */
const autoLogin = function () {
  if (appstate.checkLogin()) {
    return
  }

  // #ifdef MP
  return authMpUserInfo()
  // #endif

  // #ifdef H5
  return authTmpUserInfo()
  // #endif
}

module.exports = {
  refreshTokenFn,
  mpUserInfo
}
