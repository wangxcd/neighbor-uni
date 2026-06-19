import config from '@/config/config'
import util from './util'
import uniUtil from './uniUtil'
import store from '../store'
import appstate from '@/libs/appstate'

/**
 * 发送请求
 */
const baseRequest = (
  url,
  method,
  options,
  {
    pType = 'com', // com | isu
    noAuth = false,
    noVerify = false
  }
) => {
  let header = {
    'Content-Type': options.contentType || config.CONTENT_TYPE_JSON
  }
  let reqUrl = url
  console.debug('req url:' + reqUrl)
  const token = store.getters.token
  const locIsuPreUrl = store.getters.locIsuPreUrl

  if (!noAuth) {
    // 需要认证
    const chkRes = appstate.checkLogin()
    if (!chkRes) {
      appstate.toLogin()
    }
  }

  if (token && token.accessToken) {
    header[config.TOKENNAME] = token.accessToken
  }

  header['jasmine-Flag'] = 'nghbor'

  if (options.header) {
    header = Object.assign(header, options.header)
  }

  if (options.params) {
    const paramSerialize = util.serialize(options.params)
    reqUrl += '?' + paramSerialize
  }

  // ifdef MP
  reqUrl = util.removePrefix(reqUrl, '/vod-protal/')
  if (pType === 'com') {
    reqUrl = config.HTTP_REQUEST_URL + '/api/pcom/' + reqUrl
  } else if (pType === 'isu') {
    reqUrl = locIsuPreUrl + reqUrl
  }
  // endif

  return new Promise((resolve, reject) => {
    uni.request({
      url: reqUrl,
      method: method || 'GET',
      header: header,
      dataType: 'json',
      sslVerify: false,
      timeout: 1000 * 60 * 10,  // 开发阶段超时设长一些方便调试
      data: options.data || {},
      success: (res) => {
        if (res.statusCode === 200) {
          const retData = res.data
          if (retData.code === 0) {
            if (retData.msg) {
              uni.showToast({
                title: retData.msg || '',
                duration: 1200,
                icon: 'none'
              })
            }

            if (noVerify) {
              // 无需认证直接返回
              resolve(retData)
            } else {
              // 认证逻辑
              resolve(retData)
            }
          } else if (retData.code === 401 || retData.code === 403) {
            // 未登录
            store.dispatch('user/loginOut')
            // appstate.toLogin()
          } else if (retData.code === 402) {
            // 需刷新token后重新请求
            refreshToken(token.refreshToken).then((_res2) => {
              if (_res2.code === 0 && _res2.data) {
                store.dispatch('user/setToken', _res2.data)
                return baseRequest(url, method, options, { pType: pType, noAuth: noAuth, noVerify: noVerify })
              } else {
                store.dispatch('user/loginOut')
              }
            })
          } else {
            // reject(retData.msg || '系统错误')
            uniUtil.error(retData.msg || '系统错误')
          }
        } else if (res.statusCode === 400) {
          // 后端处理异常时，返回状态码是400
          uniUtil.error(res.msg || '请求参数错误')
          uni.hideLoading()
        } else if (res.statusCode === 500 || res.statusCode === 504) {
          // 后端处理异常时，返回状态码是500
          const retData = res.data
          if (retData.code >= 200 && retData.code < 400) {
            uniUtil.error(retData.msg, 3000)
            reject(retData.msg)
          } else if (retData.code === 401) {
            // 用户账户不存在
            uniUtil.error(retData.msg || '系统错误')
            store.dispatch('user/loginOut')
          } else {
            // reject(retData.msg || '系统错误')
            uniUtil.error(retData.msg || '系统错误')
            console.error(retData.msg || '系统错误')
          }
          uni.hideLoading()
        }
      },
      fail: (msg) => {
        // reject('请求失败');
        if (msg.errMsg) {
          const errMsg = msg.errMsg
          if (errMsg === 'request:fail timeout') {
            uniUtil.error('请求服务响应超时')
          } else {
            uniUtil.error(errMsg)
          }
        } else {
          uniUtil.error('请求失败')
        }
        uni.hideLoading()
      }
    })
  })
}

/**
 * 刷新token
 */
const refreshToken = function (refreshToken) {
  const url = `/vod-protal/token/refresh`
  const option = {
    header: {
      refreshToken: refreshToken
    }
  }
  return baseRequest(url, 'get', option, { noAuth: true, noVerify: true })
}

const request = {}
const methods = ['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect']

methods.forEach((method) => {
  request[method] = (url, options, opt) => baseRequest(url, method, options, opt || {})
})

const $upload = {
  /**
   * 上传单个文件
   * desc: 微信小程序只支持单文件上传，传多个文件需要反复调用本API
   * @param {*} file
   * @param {*} formData
   */
  fileUpload(
    file,
    formData,
    {
      pType = 'isu' // com | isu
    }
  ) {
    const token = store.getters.token
    const locIsuPreUrl = store.getters.locIsuPreUrl

    // ifdef MP
    let reqUrl = locIsuPreUrl + 'fos/upload'
    if (pType === 'com') {
      reqUrl = config.HTTP_REQUEST_URL + '/api/pcom/fos/upload'
    }
    // endif

    return new Promise((resolve, reject) => {
      if (file) {
        let header = {}
        header[config.TOKENNAME] = token.accessToken
        header['jasmine-Flag'] = 'nghbor'

        uni.uploadFile({
          url: reqUrl,
          filePath: file.path,
          name: 'file',
          header: header,
          formData: formData, // 请求中其他额外的form data
          success: function (res) {
            let _res = typeof res.data === 'object' ? res.data : JSON.parse(res.data)
            if (_res.code === 0 && _res.data.columns) {
              resolve(_res.data.columns)
            } else if (_res.code === 401 || _res.code === 403) {
              // 未登录
              store.dispatch('user/loginOut')
              appstate.toLogin()
            } else {
              reject()
            }
          },
          fail: function (err) {
            reject()
          }
        })
      }
    })
  },

  /**
   * 递归上传文件
   * @param {*} files
   * @param {*} formData
   * @param {*} pType
   * @param {*} idx
   * @param {*} sucess
   * @param {*} fail
   * @param {*} fUrlMap
   * @returns
   */
  recurFileUp(files, formData, pType, idx, sucessCount, failCount, fUrlMap) {
    const _that = this
    return new Promise((resolve, reject) => {
      wx.showLoading({
        title: `正在上传第${idx + 1}个文件...`
      })
      _that
        .fileUpload(files[idx], formData, { pType: pType })
        .then((res) => {
          sucessCount++
          // resolve(res.url)
          resolve(res)
        })
        .catch(() => {
          resolve()
          failCount++
        })
    }).then((res) => {
      if (res) {
        fUrlMap[files[idx].key] = res
      }
      idx++
      wx.hideLoading()
      if (idx < files.length) {
        return _that.recurFileUp(files, formData, pType, idx, sucessCount, failCount, fUrlMap)
      } else {
        return fUrlMap
      }
    })
  },

  /**
   * 批量上传文件
   * @param {*} param
   *  param: {
   *     files: [], // 文件对象数组,对象中path为文件本地地址
   *     formData: {},
   *     upIdx: 0,  //
   *
   *  }
   */
  fileBatchUpload(
    files,
    formData,
    {
      pType = 'isu' // com | isu
    }
  ) {
    const _that = this
    const chkRes = appstate.checkLogin()
    if (!chkRes) {
      appstate.toLogin()
    }

    return new Promise((resolve, reject) => {
      let idx = 0 //当前上传的哪张图片
      let sucessCount = 0 //上传成功的个数
      let failCount = 0 //上传失败的个数
      if (files && Array.isArray(files) && files.length > 0) {
        let urlMap = {}
        _that.recurFileUp(files, formData, pType, idx, sucessCount, failCount, urlMap).then((fUrlMap) => {
          files.forEach((fEl) => {
            if (fUrlMap && fUrlMap[fEl.key]) {
              const upData = fUrlMap[fEl.key]
              fEl.fid = upData.fid
              fEl.url = upData.url
            }
          })
          resolve(files)
        })
      } else {
        reject()
      }
    })
  }
}

request.upload = $upload

export default request
