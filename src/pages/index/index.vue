<!--
* @Description: 过渡页，用于加载初始数据
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-08 07:30:48
* @LastEditors: wangxc
* @LastEditTime: 2024-04-08 07:30:48
-->
<template>
  <view class="content">
    <image class="logo" src="/static/logo250527.png"></image>
    <view class="mark">
      <view class="title">{{ appCnName }}</view>
      <view class="desc">{{ desc }}</view>
    </view>
    <u-modal :show="locationObj.confirmShow" :closeOnClickOverlay="locationObj.closeOnClickOverlay" @confirm="posConfirmOk">
      <view class="slot-content" :style="{ 'font-size': locationObj.fontSize ? locationObj.fontSize : '33rpx' }">
        <view>
          <text>该功能需要手机定位，请打开手机位置服务后重新进入</text>
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

import { setPosLocatAuth, getLocatItude, getLatudeArea } from '@/libs/location'
import { getLocalArea, calcLatudDistince } from '@/api/locCity'
import { getUserLiveComm } from '@/api/userComm'

export default {
  name: 'index',
  components: {},
  data() {
    return {
      appCnName: this.$config.appCnName,
      desc: '你身边的生活帮手，让左邻右舍给你的日常生活助力加油！',

      locationObj: {
        confirmShow: false,
        fontSize: '33rpx',
        closeOnClickOverlay: true
      },

      refershInterval: null // 刷新间隔，防止页面卡住
    }
  },
  onLoad(e) {
    console.log('index load')
  },
  onPullDownRefresh() {
    const _that = this
    _that.initPage()
    setTimeout(() => {
      // 停止下拉刷新
      uni.stopPullDownRefresh()
    }, 1000)
  },
  /**
   * 用户点击右上角分享
   */
  // #ifdef MP
  onShareAppMessage: function () {
    return {
      title: this.configApi.title,
      imageUrl: this.configApi.img,
      desc: this.configApi.synopsis,
      path: '/pages/index/index'
    }
  },
  // #endif
  onShareTimeline() {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: '你居吾邻&社圈微生活'
        })
      }, 2000)
    })
    return {
      title: '你居吾邻&社圈微生活',
      query: '/pages/index/index?id=123',
      promise
    }
  },

  onReady(e) {
    const _that = this
  },
  onShow: function () {
    const _that = this
    _that.mapInitPage()
    //_that.noMapInitPage()

    if (!this.localComm) {
      // 跳转到住宅区/社区选择页
    }
  },
  computed: {
    ...mapGetters({
      lociTude: 'app/lociTude',
      localArea: 'app/localArea',
      localComm: 'app/localComm',
      userInfo: 'user/userInfo',
      uid: 'user/uid',
      isLogin: 'user/isLogin',
      locComPreUrl: 'app/locComPreUrl'
    })
  },
  created() {},
  beforeDestroy() {
    const _that = this
    if (_that.refershInterval) {
      clearInterval(_that.refershInterval)
    }
  },
  watch: {},
  methods: {
    /**
     * 非地图定位方式页面初始化
     */
    noMapInitPage() {
      const _that = this
      setPosLocatAuth().then((res) => {
        if (res) {
          // 定位服务有时会卡住，30秒没跳转就重执行一次，直到跳转到下一页
          _that.refershInterval = setInterval(
            (function () {
              const fn = function () {
                uni.showLoading({
                  title: '定位中...',
                  mask: true
                })
                _that.loadLocalArea().then((res) => {
                  // _that.loadLiveComm()
                  _that.$uniUtil.success(res)
                  if (res) {
                    setTimeout(() => {
                      uni.hideLoading()
                      // _that.$uniUtil.redirect('/pages/home/index/index', 20)
                      _that.$Router.replace({ name: 'home', params: { lineIdx: 1 } })
                    }, 500)
                  }
                }).catch((err) => {
                  _that.$uniUtil.error(err)
                })
              }
              fn()
              return fn
            })(),
            1000 * 15
          )
        } else {
          this.locationObj.confirmShow = true
        }
      }).catch((err) => {
        _that.$uniUtil.error(err)
      })



    },

    /**
     * 位置服务+地图逆地址解析方式页面初始化
     */
    mapInitPage() {
      const _that = this
      setPosLocatAuth().then((res) => {
        if (res) {
          // 定位服务有时会卡住，30秒没跳转就重执行一次，直到跳转到下一页
          _that.refershInterval = setInterval(
            (function () {
              const fn = function () {
                uni.showLoading({
                  title: '定位中...',
                  mask: true
                })
                _that.loadMapLocalArea().then((loc) => {
                  // _that.loadLiveComm()
                  if (_that.refershInterval) {
                    clearInterval(_that.refershInterval)
                  }

                  if (loc) {
                    if (loc.isCityChg) {
                      // 城市变化，清除缓存社区信息
                      _that.$store.dispatch('app/clearLocalComm')
                    }

                    _that.getLocRegion(loc).then((area) => {
                      _that.locRegAfter(loc.iTude, area)
                        //resolve(true)
                      setTimeout(() => {
                        uni.hideLoading()
                        // _that.$uniUtil.redirect('/pages/home/index/index', 20)
                        _that.$Router.replace({ name: 'home', params: { lineIdx: 1 } })
                      }, 500)
                    })
                  } else {
                     _that.$Router.push({ name: 'cityPick', params: { lineIdx: 1 } })
                  }

                  /*
                  _that.$uniUtil.success(res)
                  if (res) {
                    setTimeout(() => {
                      uni.hideLoading()
                      // _that.$uniUtil.redirect('/pages/home/index/index', 20)
                      _that.$Router.replace({ name: 'home', params: { lineIdx: 1 } })
                    }, 500)
                  }
                    */
                }).catch((err) => {
                  // _that.$uniUtil.error(err)
                  _that.$Router.push({ name: 'cityPick', params: { lineIdx: 1 } })
                })
              }
              fn()
              return fn
            })(),
            1000 * 15
          )
        } else {
          this.locationObj.confirmShow = true
        }
      }).catch((err) => {
        _that.$uniUtil.error(err)
      })

      // _that.$uniUtil.redirect('/pages/home/index/index', 20)
    },

    posConfirmOk() {
      this.locationObj.confirmShow = false
      this.initPage()
    },

    // 初始化城市地区数据
    loadLocalArea() {
      const _that = this
      return new Promise((resolve, reject) => {
        // 1.获取当前位置经纬度
        return getLocatItude()
          .then((iTude) => {
            // 缓存当前经纬度
            if (iTude) {
              _that.$store.dispatch('app/setLociTude', iTude)
            }

            // 执行到此处基本不会再卡顿，为防止因对话框提示而重复执行，在此清除定时器
            if (_that.refershInterval) {
              clearInterval(_that.refershInterval)
            }

            if (!_that.localArea || !_that.localArea.city || !_that.localArea.city.distCode) {
              // 没在历史缓存城市，跳转到城市选择页
              _that.$Router.push({ name: 'cityPick', params: { lineIdx: 1 } })
            } else {
              const hisLoc = {
                nationCode: _that.localArea.nation.distCode,
                cityCode: _that.localArea.city.distCode,
                adCode: _that.localArea.ad ? _that.localArea.ad.distCode : ''
              }

              _that.getLocRegion(hisLoc).then((area) => {
                _that.locRegAfter(iTude, area)
                resolve(true)
              })
            }
          })
          .catch((e) => {
            console.log(e)
            reject(e)
          })
      })
    },

    /**
     * 由位置服务初始化系统数据
     * 具体返回3种状态：1：跳转到城市选择页，由用户主动选择服务的城市(仅记录当前经纬度对象)
     *  2：按历史城市服务(历史城市对象)
     *  3：按当前经纬度所在城市服务(当前城市对象)
     */
    loadMapLocalArea() {
      const _that = this
      let hisLoc = undefined
      
      // 2-b1 取历史访问城市(位置)
      if (_that.localArea && _that.localArea.cityServer) {
        if (_that.localArea.city && _that.localArea.city.isOpen === 1) {
          hisLoc = {
            nationCode: _that.localArea.nation.distCode,
            cityCode: _that.localArea.city.distCode,
            adCode: _that.localArea.ad ? _that.localArea.ad.distCode : ''
          }

          if (_that.lociTude && _that.lociTude.latitude) {
            hisLoc.iTude = _that.lociTude
          }
        }
      }

      return new Promise((resolve, reject) => {
        // 1.获取当前位置经纬度
        getLocatItude().then((iTude) => {
          // 3. 上一次使用的经纬度
          if (hisLoc && hisLoc.iTude) {
            // 4 检查与上次经纬度距离
            calcLatudDistince({
              latitude1: iTude.latitude,
              longitude1: iTude.longitude,
              latitude2: hisLoc.iTude.latitude,
              longitude2: hisLoc.iTude.longitude
            }).then((disRes) => {
              let distince = 0
              if (disRes.code === 0) {
                distince = disRes.data
              }

              // 如果大于3公里则检查当前位置是否城市已改变
              if (distince && distince > 3000) {
                getLatudeArea(iTude).then((loc) => {
                  let curLoc = {
                    iTude: iTude,
                    isCityChg: false,
                    ...loc
                  }

                  // 如果当前位置城市服务未开通，则跳转到用户手工选择城市
                  if (loc.cityIsOpen && loc.cityIsOpen === 1) {
                    // 有历史则按历史,无历史按首次
                    if (hisLoc) {
                     // 检查城市是否变化
                      if (hisLoc.cityCode !== loc.cityCode) {
                        uni.showModal({
                          title: '提示',
                          content: `当前定位城市：${loc.city}，是否切换？`,
                          success: function (res) {
                            if (res.confirm) {
                              // 切换到当前定位城市
                              curLoc.isCityChg = true
                              resolve(curLoc)
                              /* 
                              console.log('用户点击确定')
                              // 城市变化，清除缓存社区信息
                              _that.$store.dispatch('app/clearLocalComm')
                              */
                            } else if (res.cancel) {
                              // 不切换到当前城市,当前经纬度也保持历史
                              resolve(hisLoc)
                              /*console.log('用户点击取消')
                              _that.getLocRegion(hisLoc).then((area) => {
                                _that.locRegAfter(undefined, area)
                                resolve(true)
                              })*/
                            }
                          }
                        })
                      } else {
                        // 还在原城市
                        resolve(hisLoc)

                       /* _that.getLocRegion(hisLoc).then((area) => {
                          _that.locRegAfter(iTude, area)
                          resolve(true)
                        })*/
                      }
                    } else {
                      resolve(curLoc)
                    }
                  } else {
                    // 未开通城市，有历史则按历史,无历史去手动选择
                    if (hisLoc) {
                      resolve(hisLoc)
                    } else {
                      resolve()
                    }
                  }
                })
              } else {
                // 有历史则按历史,无历史按首次
                if (hisLoc) {
                  resolve(hisLoc)
                } else {
                  getLatudeArea(iTude).then((loc) => {
                    let curLoc = {
                      iTude: iTude,
                      isCityChg: true,
                      ...loc
                    }
                    resolve(curLoc)
                  })
                }
              }
            })
          } else {
            // 未记录上次使用经纬度时
            getLatudeArea(iTude).then((loc) => {
              if (loc.cityIsOpen && loc.cityIsOpen === 1) {
                let curLoc = {
                  iTude: iTude,
                  isCityChg: true,
                  ...loc
                }
                resolve(curLoc)
              } else {
                resolve()
              }
            })
          }
        }).catch((e) => {
          // 获取经纬度异常时
          // 有历史则按历史,无历史则跳转到用户手工选择城市
          if (hisLoc && hisLoc.iTude) {
            resolve(hisLoc)
          } else {
            resolve()
          }
        })
      })
    },

    /**
     * 本地服务获取当前位置服务配置
     * @param {*} loc
     */
    getLocRegion(loc) {
      const _that = this
      const req = {
        nationCode: loc.nationCode,
        cityCode: loc.cityCode,
        adCode: loc.adCode
      }
      return getLocalArea(req).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          return _res
        }
      })
    },

    locRegAfter(iTude, area) {
      const _that = this
      if (iTude) {
        _that.$store.dispatch('app/setLociTude', iTude)
      }

      if (area) {
        _that.$store.dispatch('app/setLocalArea', area)
        if (_that.isLogin) {
          // 登录用户，加载常居生活区
          _that.getLiveComm(area.city.distCode)
        }
      }
    },

    /**
     * 加载社区信息
     */
    loadLiveComm() {
      // localComm
      if (!this.localComm) {
        // 没有历史小区,选择小区
      }

      if (this.isLogin && this.uid) {
        this.getLiveComm()
      }
    },

    getLiveComm(cityCode) {
      const _that = this
      const req = {
        cityCode: cityCode,
        uid: this.uid
      }
      getUserLiveComm(req).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          _that.$store.dispatch('user/setLiveComms', _res)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .logo {
    height: 200rpx;
    width: 200rpx;
    margin: 200rpx auto 50rpx auto;
  }

  .mark {
    display: table-cell;
    text-align: center;
    vertical-align: middle;

    .title {
      font-size: 48rpx;
      color: #8f8f94;
    }

    .desc {
      margin-top: 20rpx;
      font-size: 28rpx;
    }
  }
}
</style>
