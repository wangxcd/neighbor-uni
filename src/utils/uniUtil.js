import { router } from '@/router/router.js'

const nav = (url, delay = 0) => {
  console.log(url)
  setTimeout(() => {
    uni.navigateTo({
      url,
      fail() {
        console.log('跳转失败-nav')
      }
    })
  }, delay)
}

const redirect = (url, delay = 0) => {
  setTimeout(() => {
    uni.redirectTo({
      url: url,
      fail: (e) => {
        console.error('跳转失败-redirect', e)
      }
    })
  }, delay)
}

const back = (delta, delay = 0) => {
  setTimeout(() => {
    uni.navigateBack({
      delta: delta,
      fail: (e) => {
        console.error('跳转失败-back', e)
      }
    })
  }, delay)
}

const prePage = () => {
  let pages = getCurrentPages()
  let prePage = pages[pages.length - 1]
  return prePage.route
}

/**
 * opt  object | string
 * to_url object | string
 * 例:
 * this.Tips('/pages/test/test'); 跳转不提示
 * this.Tips({title:'提示'},'/pages/test/test'); 提示并跳转
 * this.Tips({title:'提示'},{tab:1,url:'/pages/index/index'}); 提示并跳转值table上
 * tab=1 一定时间后跳转至 table上
 * tab=2 一定时间后跳转至非 table上
 * tab=3 一定时间后返回上页面
 * tab=4 关闭所有页面跳转至非table上
 * tab=5 关闭当前页面跳转至table上
 */
const tips = (opt, to_url) => {
  if (typeof opt == 'string') {
    to_url = opt
    opt = {}
  }
  let title = opt.title || '',
    icon = opt.icon || 'none',
    endtime = opt.endtime || 2000,
    success = opt.success
  if (title)
    uni.showToast({
      title: title,
      icon: icon,
      duration: endtime,
      success
    })
  if (to_url != undefined) {
    if (typeof to_url == 'object') {
      let tab = to_url.tab || 1
      const url = to_url.url || '' // 要跳转的页面url
      const delta = to_url.delta || 1 // 返回的页面数
      switch (tab) {
        case 1:
          //一定时间后跳转至 table
          setTimeout(function () {
            uni.switchTab({
              url: url
            })
          }, endtime)
          break
        case 2:
          //跳转至非table页面
          setTimeout(function () {
            uni.navigateTo({
              url: url
            })
          }, endtime)
          break
        case 3:
          //返回上页面
          setTimeout(function () {
            // #ifndef H5
            let canNavBack = getCurrentPages()
            if (canNavBack && canNavBack.length > 1) {
              uni.navigateBack({
                delta: delta
              })
            } else {
              router.back(delta)
            }
            // #endif
            // #ifdef H5
            history.back()
            // #endif
          }, endtime)
          break
        case 4:
          //关闭当前所有页面跳转至非table页面
          setTimeout(function () {
            uni.reLaunch({
              url: url
            })
          }, endtime)
          break
        case 5:
          //关闭当前页面跳转至非table页面
          setTimeout(function () {
            uni.redirectTo({
              url: url
            })
          }, endtime)
          break
      }
    } else if (typeof to_url == 'function') {
      setTimeout(function () {
        to_url && to_url()
      }, endtime)
    } else {
      //没有提示时跳转不延迟
      setTimeout(
        function () {
          uni.navigateTo({
            url: to_url
          })
        },
        title ? endtime : 0
      )
    }
  }
}

const success = (msg = '成功！', duration = 1200) => {
  uni.showToast({
    title: msg,
    duration: duration,
    icon: 'success',
    fail() {
      console.log('消息提示失败-success')
    }
  })
}
const error = (msg = '失败！', duration = 2000) => {
  uni.showToast({
    title: msg,
    duration: duration,
    icon: 'none',
    fail() {
      console.log('消息提示失败-error')
    }
  })
}

const copy = (e) => {
  uni.setClipboardData({
    data: e
  })
}

const callTel = (tel) => {
  uni.makePhoneCall({
    phoneNumber: tel
  })
}

const getDistance = (lat1, lng1, lat2, lng2) => {
  var radLat1 = (lat1 * Math.PI) / 180.0
  var radLat2 = (lat2 * Math.PI) / 180.0
  var a = radLat1 - radLat2
  var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
  s = s * 6378.137 // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000 // 调用 return的距离单位为km
  return s.toFixed(2)
}

const chooseLocation = () => {
  return new Promise((resolve, reject) => {
    uni.chooseLocation({
      success: async (res) => {
        let resolve_data = {}
        // console.log('选择的位置',res)
        let location = await http('get', 'location/latlng_to_addr', { latitude: res.latitude, longitude: res.longitude })
        if (location && location.code == 1) {
          resolve_data = location
        } else {
          console.error('chooseLocation-失败：', location)
        }
        resolve(resolve_data)
      },
      fail() {
        error('选择位置失败:' + e.errMsg, 2000)
        reject(e)
      }
    })
  })
}

const testReq = (method = 'get', url, params) => {
  return new Promise((resolve, reject) => {
    params = !params ? {} : params
    uni.request({
      url: url,
      data: params.data,
      method: method,
      timeout: 30000,
      sslVerify: false,
      header: {},
      success: (response) => {
        const data = response.data
        resolve(data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 方法调用转为promise方式
 * @param {*} fn
 * @param {*} config
 * @returns
 */
const toPromise = (fn, config = {}) => {
  return new Promise((resolve, reject) => {
    fn({
      ...config,
      success(res) {
        resolve(res)
      },
      fail(err) {
        reject(err)
      },
      complete(err) {
        reject(err)
      },
      cancel(err) {
        reject(err)
      }
    })
  })
}

const wxPay = (msg, cb) => {
  return new Promise((resolve, reject) => {
    resolve()
    /* wx.requestPayment({
        timeStamp: msg.timestamp,
        nonceStr: msg.nonceStr,
        package: msg.package,
        signType: 'MD5',
        paySign: msg.paySign,
        success (res) {
          wx.showToast({
            title: '支付成功',
          })
          resolve(res)
        },
        fail (res) {
          wx.showToast({
            title: '支付失败',
            icon: 'none'
          })
          reject(res)
        }
      }) */
  })
}

export default {
  success,
  error,
  prePage,
  redirect,
  nav,
  back,
  tips,
  copy,
  callTel,
  getDistance,
  chooseLocation,
  testReq,
  toPromise
}
