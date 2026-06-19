import config from '@/config/config'
import util from '@/utils/util'
import uniUtil from '@/utils/uniUtil'
import store from '@/store'
import routine from '@/libs/routine'
import { getLocalAreByLatng } from '@/api/locCity'

// 引入SDK核心类，js文件根据自己业务，位置可自行放置
// let QQMapWX = require('./qqmap/qqmap-wx-jssdk')
// 实例化API核心类
/*
const qqmapsdk = new QQMapWX({
  key: config.account.mapKey
})
  */

const setPosLocatAuth = () => {
  return $L.setLocationAuth()
}

/**
 * 获取当前地理位置的经纬度
 * @returns
 */
const getLocatItude = () => {
  return new Promise((resolve, reject) => {
    $L.getLocation()
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        console.log(err)
        reject(err)
      })
  })
}

/**
 * 调用腾讯api获取经纬度对应的地理位置信息
 * 说明：此微信接口wx.getLocation需申请且存在日限额,比较麻烦，所以要尽可能少使用
 * @param {*} lociTude
 */
const getLatudeArea = (lociTude) => {
  return new Promise((resolve, reject) => {
    const lanlng = {
      latitude1: lociTude.latitude,
      longitude1: lociTude.longitude
    }

    getLocalAreByLatng(lanlng).then((res) => {
      if (res.code === 0) {
        const _res = res.data
        if (_res) {
          let locDist = {
            adCode: _res.ad.distCode,
            district: _res.ad.distName,
            city: _res.city.distName,
            cityCode: _res.city.distCode,
            cityIsOpen: _res.city.isOpen, // 城市服务是否已开通
            province: _res.province.distName,
            provinceCode: _res.province.distName,
            nation: _res.nation.distName,
            nationCode: _res.nation.distCode
          }
          uni.hideLoading()
          resolve(locDist)
        }
      }
    })
  })
}

// 获取地理位置;
const $L = {
  isOpenSetting: false,

  setLocationAuth() {
    const _that = this
    return new Promise(async (resolve, reject) => {
      const { locationEnabled } = uni.getSystemSetting()
      if (!locationEnabled) {
        uniUtil.tips({
          title: '该功能需要手机定位，请打开手机定位后重新进入！',
          endtime: 5000
        })
        resolve(false)
      }

      // 判断用户是否获取定位权限
      //authIsPass方法就是上面步骤2的方法
      routine.authIsPass('scope.userLocation').then((res) => {
        if (!res) {
          uni.authorize({
            scope: 'scope.userLocation',
            fail: (res) => {
              uni.showModal({
                title: '使用该功能必须允许位置服务，是否重新授权？',
                showCancel: false,
                success: ({ confirm }) => {
                  if (confirm) {
                    uni.openSetting({
                      success() {
                        console.log('开启权限成功')
                        _that.setLocationAuth()
                      },
                      fail() {
                        console.log('开启权限失败')
                        reject('开启权限失败')
                      }
                    })
                  }
                }
              })
            },
            success: () => {
              resolve(true)
            }
          })
        } else {
          resolve(true)
        }
      })
    })
  },

  getLocation() {
    // #ifdef MP-WEIXIN || MP-TOUTIAO || MP-QQ
    /* return this.getSetting().then((status) => {
      if (status === 2) {
        return this.openSetting()
      } else {
        return this.doGetLocation()
      }
    }) */
    return this.doGetLocation()
    // #endif
  },

  doGetLocation() {
    return new Promise((resolve, reject) => {
      uni.getLocation({
        type: 'wgs84',
        success: function (res) {
          const lociTude = {
            latitude: res.latitude,
            longitude: res.longitude
          }
          resolve(lociTude)
        },
        fail: function (err) {
          console.log(JSON.stringify(err))
          uniUtil.error(JSON.stringify(err))
          reject(err)
        },
        complete: (e) => {
          console.log(e)
        }
      })
      /*
      uni.startLocationUpdate({
        type: 'gcj02',
        success: (r) => {
          uni.onLocationChange((res) => {
            const lociTude = {
              latitude: res.latitude,
              longitude: res.longitude
            }

            uni.stopLocationUpdate({
              success: () => {
                console.log('停止位置更新')
              }
            })
            resolve(lociTude)
          })

          uni.onLocationChangeError((res) => {
            uniUtil.error(JSON.stringify(res))

            if (res.errCode === 1) {
              console.log('位置服务未开启')
              // 引导用户去设置中开启位置服务
            } else if (res.errCode === 2) {
              console.log('用户拒绝授权获取位置')
              // 引导用户去设置中修改权限
            } else if (res.errCode === 3) {
              console.log('定位超时')
              // 重新请求位置服务
            } else if (res.errCode === 4) {
              console.log('网络问题')
              // 提示用户检查网络连接
            } else if (res.errCode === 5) {
              console.log('获取位置信息的操作被禁用')
              // 引导用户去设置中开启相关服务
            }
            reject(res)
          })
        },
        fail: (err) => {
          uniUtil.error(JSON.stringify(err))

          // #ifdef MP-BAIDU
          if (err.errCode === 202 || err.errCode === 10003) {
            // 202模拟器 10003真机 user deny
            this.openSetting()
          }
          // #endif
          // #ifndef MP-BAIDU
          if (err.errMsg.indexOf('auth deny') >= 0) {
            uni.showToast({
              title: '访问位置被拒绝'
            })
          } else {
            uni.showToast({
              title: err.errMsg
            })
          }
          // #endif
          reject(err)
        },
        complete: (e) => {
          console.log(e)
        }
      }) */
    })
  },
  getSetting: function () {
    return new Promise((resolve, reject) => {
      uni.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userLocation'] === undefined) {
            resolve(0)
          }
          if (res.authSetting['scope.userLocation']) {
            resolve(1)
          } else {
            resolve(2)
          }
        },
        fail: (err) => {
          console.log(err)
          reject(err)
        }
      })
    })
  },
  openSetting: function () {
    uni.openSetting({
      success: (res) => {
        if (res.authSetting && res.authSetting['scope.userLocation']) {
          this.doGetLocation()
        }
        if (!res.authSetting['scope.userLocation']) {
          uni.openSetting({
            success: (res) => {
              console.log(res.authSetting)
            }
          })
        } else {
          console.log('用户已授权位置信息')
        }

        if (res.authSetting && res.authSetting['scope.userLocation']) {
          this.doGetLocation()
        }
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },
  async checkPermission() {
    let status = permision.isIOS ? await permision.requestIOS('location') : await permision.requestAndroid('android.permission.ACCESS_FINE_LOCATION')

    if (status === null || status === 1) {
      status = 1
    } else if (status === 2) {
      uni.showModal({
        content: '系统定位已关闭',
        confirmText: '确定',
        showCancel: false,
        success: function (res) { }
      })
    } else if (status.code) {
      uni.showModal({
        content: status.message
      })
    } else {
      uni.showModal({
        content: '需要定位权限',
        confirmText: '设置',
        success: function (res) {
          if (res.confirm) {
            permision.gotoAppSetting()
          }
        }
      })
    }
    return status
  }
}

module.exports = {
  setPosLocatAuth,
  getLocatItude,
  getLatudeArea
}
