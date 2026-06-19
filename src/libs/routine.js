import Cache from '../utils/storage'
import keys from '../config/keys'

class Routine {
  constructor() {
    this.scopeUserInfo = 'scope.userInfo'
  }

  /**
   * 是否授权
   */
  isAuth() {
    let that = this
    return new Promise((resolve, reject) => {
      uni.getSetting({
        success(res) {
          if (!res.authSetting[that.scopeUserInfo]) {
            resolve(false)
          } else {
            resolve(true)
          }
        },
        fail() {
          resolve(false)
        }
      })
    })
  }

  /**
   * 小程序：获取用户信息授权请求
   */
  authorize() {
    let that = this
    return new Promise((resolve, reject) => {
      uni.authorize({
        scope: that.scopeUserInfo,
        success() {
          resolve(true)
        },
        fail(res) {
          reject(false)
        }
      })
    })
  }

  /**
   * 获取服务供应商
   */
  getProvider() {
    return new Promise((resolve, reject) => {
      uni.getProvider({
        service: 'oauth', //service	String	服务类型  oauth授权登录 share分享 payment支付 push推送
        success(res) {
          resolve(res.provider)
        },
        fail() {
          resolve(false)
        }
      })
    })
  }

  /**
   * 小程序服务商授权登录
   * @returns
   */
  async getAuthCode() {
    let provider = await this.getProvider()
    return new Promise((resolve, reject) => {
      uni.login({
        provider: provider,
        success(res) {
          if (res.code) {
            // 缓存一个月
            const expireTime = 60 * 60 * 24 * 30
            Cache.setCache(keys.MP_AUTH_STATE, res.code, 60)
          }
          return resolve({
            provider: provider,
            code: res.code
          })
        },
        fail() {
          return reject(null)
        }
      })
    })
  }

  /**
   * 服务端用户登录code
   * @returns
   */
  async getUserCode() {
    const _that = this
    return new Promise((resolve, reject) => {
      _that.isAuth().then((auth) => {
        if (!auth) {
          _that.authorize().then((authRes) => {
            resolve(authRes)
          })
        } else {
          resolve(true)
        }
      })
    }).then((res) => {
      let authCode = {}
      if (res) {
        authCode = _that.getAuthCode()
      }
      return authCode
    })
  }

  /**
   * 获取用户信息
   */
  async getUserProfile() {
    const _that = this
    const userCode = _that.getUserCode()
    const userProfile = new Promise((resolve, reject) => {
      uni.getUserProfile({
        lang: 'zh_CN',
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success(user) {
          resolve(user)
        },
        fail(res) {
          reject(res)
        }
      })
    })
    return Promise.all([userCode, userProfile]).then((res) => {
      let profile = {
        islogin: false
      }
      if (res[0]) {
        profile.code = res[0].code
        profile.provider = res[0].provider
      }
      if (res[1]) {
        profile.user = res[1]
      }
      return profile
    })
  }

  //传一个权限key，则返回true，false判断是否有该权限
  //传一个权限key的数组，返回没有打开的权限列表
  authIsPass(authValue) {
    return new Promise((resolve, reject) => {
      try {
        uni.getSetting({
          success: (res) => {
            const { authSetting } = res
            if (typeof authValue === 'string') {
              if (authSetting[authValue]) {
                resolve(true)
              } else {
                resolve(false)
              }
            } else if (Array.isArray(authValue)) {
              let noPassList = authValue.filter((key) => !authSetting[key])
              if (noPassList.length > 0) {
                resolve(noPassList)
              } else {
                resolve([])
              }
            } else {
              resolve(res)
            }
          },
          fail: (err) => {
            reject(err)
          }
        })
      } catch (err) {
        reject(err)
      }
    })
  }
}

export default new Routine()
