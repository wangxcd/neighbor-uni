import request from '@/utils/request'
// import request from "@/utils/http"

export default {
  /**
   * 小程序用户登录
   * @param data object 小程序用户登录信息
   */
  mpLogin(data) {
    const options = {
      data: data
    }
    return request.post('/vod-protal/wechat/mp/login/auth', options, { noAuth: true })
  },

  /**
   * h5虚拟用户登录
   * @returns
   */
  h5TmpLogin() {
    return request.get('/vod-protal/user/virlogin', {}, { noAuth: true, noVerify: true })
  },

  /**
   * h5用户名密码登录
   * @returns
   */
  h5Login() { },

  /**
   * 刷新token
   */
  refreshToken(refreshToken) {
    const url = `/vod-protal/token/refresh`
    const option = {
      header: {
        refreshToken: refreshToken
      }
    }
    return request.get(url, option, { noAuth: true, noVerify: true })
  }
}
