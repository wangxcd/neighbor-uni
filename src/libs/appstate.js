import Cache from '@/utils/storage'
import keys from '@/config/keys'

import { debounce, isWeixin, isRemoteUrl, startWith } from '@/utils/util'
import store from '@/store'
import uniUtil from '@/utils/uniUtil'
import weixin from './weixin'

class AppState {
  constructor() { }

  /**
   * 用户登录状态
   * @returns
   */
  checkLogin = function () {
    const token = store.getters.token
    const uid = store.getters.uid
    const locComPreUrl = store.getters['app/locComPreUrl']
    if (uid && token && token.accessToken) {
      store.dispatch('user/undaLogin', token)
      const userInfo = store.getters.userInfo
      if (userInfo) {
        const avatarUrl = userInfo.avatarUrl
        if (!isRemoteUrl(avatarUrl) && startWith(avatarUrl, 'f/')) {
          userInfo.avatarUrl = locComPreUrl + avatarUrl
        }
        store.dispatch('user/undaUserInfo', userInfo)
      }
      return true
    } else {
      store.dispatch('user/loginOut')
      return false
    }
  }

  /**
   * 手动登录：登录页面登录
   */
  manualLogin = function (pathLogin) {
    store.dispatch('user/loginOut')

    let path = uniUtil.prePage()
    Cache.setCache(keys.BACK_URL, path)
    let loginBackPath = Cache.getCache(keys.BACK_URL)

    // #ifdef H5
    path = location.pathname + location.search
    // #endif

    if (!pathLogin) {
      pathLogin = '/pagesUser/users/login/index'
    }

    // #ifdef H5
    if (isWeixin()) {
      let urlData = path
      if (urlData.indexOf('?') !== -1) {
        urlData += '&go_longin=1'
      } else {
        urlData += '?go_longin=1'
      }
      if (!Cache.hasCache('snsapiKey')) {
        weixin.oAuth('snsapi_base', urlData)
      } else {
        if (['pages/home/my/index'].indexOf(loginBackPath) !== -1) {
          uni.navigateTo({
            url: '/pagesUser/login/wechat'
          })
        }
      }
    } else {
      if (['pages/home/my/index'].indexOf(loginBackPath) !== -1) {
        uni.navigateTo({
          url: '/pagesUser/login/index'
        })
      }
    }
    // #endif

    // if (['pages/home/my/index'].indexOf(loginBackPath) !== -1) {
    // #ifdef MP
    uni.navigateTo({
      url: '/pagesUser/login/wechat'
    })
    // #endif
    //}
  }

  toLogin = function () {
    debounce(this.manualLogin(), 800)
    // return authTmpUserInfo()
  }
}

export default new AppState()
