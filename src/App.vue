<script>
  import Routine from '@/libs/routine'
  import {
    refreshTokenFn,
    mpUserInfo
  } from '@/libs/loginlib'
  import {
    getLoginUserInfo
  } from '@/api/user'
  import sysApi from '@/api/sys'
  import { getLocalArea, getCommById } from '@/api/locCity'
  import { getUserCommRole } from '@/api/userComm'

  export default {
    globalData: {
      spid: 0, // 推广人ID
      qrCode: 0, // 推广人分享二维码ID
      sCityCode: '', // 推广人分享的城市
      sAdCode: '', // 推广人分享的区县
      sComId: '', // 推广人分享的生活区ID
      isFirstInComm: true, // 是否首次进入生活区主页，进入小程序或生活区切换时需加载生活区部分信息

      refreshTokenInterval: undefined // token刷新定时器
    },
    onLaunch: function(e) {
      const _that = this
      if (e.query.spid) {
        this.globalData.spid = Number(e.query.spid)
      }
      if (e.query.cityCode) {
        this.globalData.sCityCode = e.query.cityCode
      }
      if (e.query.adCode) {
        this.globalData.sAdCode = Number(e.query.adCode)
      }
      if (e.query.comId) {
        this.globalData.sComId = Number(e.query.comId)
      }

      // 每次启动获取系统信息
      const sysInfo = this.$store.getters.sysInfo
      if (!sysInfo) {
        this.getSysInfo()
      }

      this.getSysCfig()

      this.authLogin().then(() => {
        if (_that.globalData.sCityCode && _that.globalData.sAdCode) {
          _that.loadSpredCityServe()
        }
      })
    },
    onShow: function() {
      console.log('App Show')
      // #ifdef MP
      // 每次进入app时
      this.globalData.isFirstInComm = true
      this.checkForUpdate()
      // #endif
    },
    onHide: function() {
      console.log('App Hide')
      const _that = this
      if (_that.globalData.refreshTokenInterval) {
        clearInterval(_that.globalData.refreshTokenInterval)
      }
    },
    methods: {
      getSysInfo() {
        const _that = this

        // 支付渠道
        let payChannel = 'WRoutine'
        // #ifdef H5
        payChannel = this.$util.isWeixin() ? 'WPublic' : 'WH5'
        // #endif
        // #ifdef MP
        payChannel = 'WRoutine'
        // #endif

        return new Promise((resolve, reject) => {
          // 获取系统信息
          const windowInfo = uni.getWindowInfo() // 窗口信息
          const deviceInfo = uni.getDeviceInfo() // 设备基础信息
          const appBaseInfo = uni.getAppBaseInfo() // 微信 APP 基础信息

          const sysInfo = {
            pixelRatio:	windowInfo.pixelRatio, // 设备像素比	
            screenWidth: windowInfo.screenWidth, //	屏幕宽度	
            screenHeight:	windowInfo.screenHeight, //	屏幕高度	
            windowWidth:	windowInfo.windowWidth,	// 可使用窗口宽度	
            windowHeight:	windowInfo.windowHeight, // 可使用窗口高度	
            windowTop: windowInfo.windowTop, // 可使用窗口的顶部位置	
            windowBottom:	windowInfo.windowBottom, // 可使用窗口的底部位置	
            statusBarHeight: windowInfo.statusBarHeight, // 手机状态栏的高度	
            screenTop: windowInfo.screenTop, // 窗口上边缘的 y 值	
            safeArea: windowInfo.safeArea, // 在竖屏正方向下的安全区域	
            safeAreaInsets: windowInfo.safeAreaInsets, //在竖屏正方向下的安全区域插入位置
            osName: deviceInfo.osName, // 系统名称
            deviceType: deviceInfo.deviceType, // 设备类型phone、pad、pc
            platform: deviceInfo.platform, // 客户端平台

            uniPlatform: appBaseInfo.uniPlatform, // uni-app 运行平台，与条件编译平台相同

            rpxPxRatio: Math.floor((750 * 10000) / windowInfo.screenWidth) / 10000,
            pageHeight: windowInfo.screenHeight - windowInfo.statusBarHeight,
            payChannel: payChannel, // 支付渠道
          }

          _that.$store.dispatch('app/setSysInfo', sysInfo)
          resolve()
        })
      },

      /**
       * 小程序静默授权
       */
      authLogin() {
        return new Promise((resolve, reject) => {
          const isLogin = this.$store.getters['user/isLogin']
          const isAutoLogin = this.$store.getters['user/isAutoLogin']
          if (!isLogin && isAutoLogin) {
            this.getUserProfile()
          } else {
            this.getUserInfo()
          }
          resolve()
        })
      },

      getUserProfile() {
        let _that = this
        return Routine.getUserCode()
          .then((authCode) => {
            _that.getWxUser(authCode)
          })
          .catch((res) => {})
      },

      getWxUser(authCode) {
        let _that = this
        if (!authCode) {
          return
        }
        //let userInfo = res.userInfo
        let userData = {
          code: authCode.code,
        }
        userData.spreadPid = _that.globalData.spid //获取推广人ID
        userData.spreadCode = _that.globalData.qrCode //推广人分享二维码ID

        mpUserInfo(userData).then((res) => {
          if (res) {
            // 已注册用户直接静默登录
            if (res.authRet === 'login') {
              _that.$store.dispatch('user/setToken', res.token)
              _that.$store.dispatch('user/setUid', Number(res.uid))
              _that.autoRefreshToken()
              _that.getUserInfo()
            }
          }
        })
      },

      /**
       * 获取个人用户信息
       */
      getUserInfo() {
        const _that = this
        const locComPreUrl = _that.$store.getters['app/locComPreUrl']
        return getLoginUserInfo().then((res) => {
          if (res.code === 0) {
            const _res = res.data
            let userInfo = {
              ..._res
            }
            const avatarUrl = _res.avatarUrl
            if (avatarUrl && !_that.$util.isRemoteUrl(avatarUrl) && _that.$util.startWith(avatarUrl, 'f/')) {
              userInfo.avatarUrl = locComPreUrl + avatarUrl
            }
            _that.$store.dispatch('user/setUser', userInfo)
          }
        })
      },

      /**
       * 自动刷新token,防止使用过程中掉线
       */
      autoRefreshToken() {
        const _that = this
         
           // 在线30分钟刷新一次token
        _that.globalData.refreshTokenInterval = setInterval(
          (function () {
            const fn = function () {
              const token = _that.$store.getters.token
              if (token && token.refreshToken) {
                refreshTokenFn(token.refreshToken)
              } 
            }
            fn()
            return fn
          })(),
          1000 * 60 * 30
        )
      },

      /**
       * 检测小程序是否更新
       */
      checkForUpdate() {
        const _this = this
        // 检查小程序是否有新版本发布
        const updateManager = uni.getUpdateManager()
        // 请求完新版本信息的回调
        updateManager.onCheckForUpdate((res) => {
          console.log('onCheckForUpdate-res', res)
          //检测到新版本，需要更新，给出提示
          if (res && res.hasUpdate) {
            uni.showModal({
              title: '更新提示',
              content: '检测到新版本，是否下载新版本并重启小程序？',
              success(res) {
                if (res.confirm) {
                  //用户确定下载更新小程序，小程序下载及更新静默进行
                  _this.downLoadAndUpdate(updateManager)
                } else {
                  // 若用户点击了取消按钮，二次弹窗，强制更新，如果用户选择取消后不需要进行任何操作，则以下内容可忽略
                  uni.showModal({
                    title: '温馨提示~',
                    content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                    confirmText: '确定更新',
                    cancelText: '取消更新',
                    success(res) {
                      if (res.confirm) {
                        //下载新版本，并重新应用
                        _this.downLoadAndUpdate(updateManager)
                      }
                    },
                  })
                }
              },
            })
          }
        })
      },

      /**
       * 下载小程序新版本并重启应用
       */
      downLoadAndUpdate(updateManager) {
        const _this = this
        uni.showLoading({
          title: '小程序更新中'
        })

        // //静默下载更新小程序新版本
        updateManager.onUpdateReady((res) => {
          console.log('onUpdateReady-res', res)
          uni.hideLoading()
          //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        })

        // 更新失败
        updateManager.onUpdateFailed((res) => {
          console.log('onUpdateFailed-res', res)
          // 新的版本下载失败
          uni.hideLoading()
          uni.showModal({
            title: '已经有新版本了哟~',
            content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            showCancel: false,
          })
        })
      },

      /**
       * 获取系统配置参数
       */
      getSysCfig() {
        const _that = this
        sysApi.getSysCfgParms().then((res) => {
          if (res.code === 0) {
            const _res = res.data
            _that.$store.dispatch('app/setSysConfig', _res)
          }
        })
      },

      /**
       * 根据分享信息中的城市直接确定为用户访问区域城市
       * @param 
       */
      loadSpredCityServe() {
        const _that = this
        const req = {
          adCode: this.globalData.sAdCode,
          cityCode: this.globalData.sCityCode
        }

        // 首次调getLocalArea主要为获取城市服务地址
        getLocalArea(req).then((res) => {
          if (res.code === 0) {
            const area = res.data
            // 此时不带town
            _that.$store.dispatch('app/setLocalArea', area)

            if (area.city) {
              const tCity = area.city
              if (tCity.location) {
                const latng = JSON.parse(tCity.location)
                const iTude = {
                  latitude: latng.lat,
                  longitude: latng.lng
                }
                _that.$store.dispatch('app/setLociTude', iTude)
              }
            }
            if (_that.globalData.sComId) {
              _that.loadSpredComm(area)
            }
          }
        })
      },

      loadSpredComm(area) {
        const _that = this
        if (this.globalData.sComId) {
          const req = {
            commId: this.globalData.sComId,
          }

          getCommById(req).then((res) => {
            if (res.code === 0) {
              const comm = res.data

              const req2 = {
                adCode: comm.adCode,
                cityCode: comm.cityCode,
                townCode: comm.townCode
              }

              getLocalArea(req2).then((res2) => {
                if (res2.code === 0) {
                  const _res2 = res2.data
                  const locComm = {
                    ad: _res2.ad, // 所在区县
                    town: _res2.town, // 所在街道(乡镇)
                    comm: comm // 住宅区信息
                  }
                  _that.$store.dispatch('app/setLocalArea', _res2)
                  _that.$store.dispatch('app/setLocalComm', locComm)

                  const isLogin = _that.$store.getters['user/isLogin']
                  const uid = _that.$store.getters['user/uid']
                  if (isLogin) {
                    getUserCommRole({
                      uid: uid,
                      commId: comm.comId
                    }).then((res3) => {
                      if (res3.code === 0) {
                        const _res3 = res3.data
                        _that.$store.dispatch('app/setUserCommRole', _res3)
                      }
                    })
                  } else {
                    _that.$store.dispatch('app/setUserCommRole', undefined)
                  }
                }
              })
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '@/uni_modules/uview-ui/index.scss';
  @import url('@/plugin/animate/animate.min.css');
  @import 'static/icon/iconfont.css';
  @import 'static/css/block.css';
  @import 'static/css/base_style.css';
  @import 'static/css/block_color.css';
  @import 'static/css/common.css';

  /* #ifndef APP-NVUE */
  @import 'uni_modules/uni-icons/components/uni-icons/uniicons.css';

  @font-face {
    font-family: uniicons;
    src: url('~@/uni_modules/uni-icons/components/uni-icons/uniicons.ttf');
  }

  /* #endif */
  .uni-icons {
    font-family: uniicons;
    font-size: 14px;
    text-decoration: none;
    text-align: center;
  }

  /*每个页面公共css */

  /* 条件编译，仅在H5平台生效 */
  // #ifdef H5
  body::-webkit-scrollbar,
  html::-webkit-scrollbar {
    display: none;
  }

  // #endif
  view {
    box-sizing: border-box;
  }

  .bg-color-red {
    background-color: #e93323 !important;
  }

  .syspadding {
    padding-top: var(--status-bar-height);
  }

  .flex {
    display: flex;
  }

  .uni-scroll-view::-webkit-scrollbar {
    /* 隐藏滚动条，但依旧具备可以滚动的功能 */
    display: none;
  }

  .bar-content {
    .text-color {
      color: $base-color;
    }
  }

  ::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
  }
</style>