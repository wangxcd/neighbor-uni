<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-05-02 19:01:44
* @LastEditors: wangxc
* @LastEditTime: 2024-05-02 19:01:44
-->
<template>
  <view class="wechat-box">
    <view class="system-height" :style="{ height: statusBarHeight }"></view>
    <!-- #ifdef MP -->
    <u-navbar title="账户登录" @rightClick="rightClick" :autoBack="true"></u-navbar>
    <!-- #endif -->
    <view class="wechat_login">
      <view class="img">
        <image
          src="https://mmecoa.qpic.cn/sz_mmecoa_png/IeCoiaHh7icxTBAlW6r6FcRoD4We37ghQkFFbRUVCvSGicMdFiaBNjZ6P6XjGfZnCYOaqPkgdMlVVxOeouGibze4BzA/640?wx_fmt=png&amp;from=appmsg"
          mode="widthFix"></image>
      </view>
      <view class="btn-wrapper">
        <!-- #ifdef H5 -->
        <button hover-class="none" @click="wechatLogin" class="bg-green btn1">微信登录</button>
        <!-- #endif -->
        <!-- #ifdef MP -->
        <button hover-class="none" @tap="wechatLogin" class="bg-green btn1">微信账号快捷登录</button>
        <!-- #endif -->
        <!--
        <button hover-class="none" @tap="phoneLogin" class="btn2">手机号快捷登录</button>
        -->
      </view>
      <!-- 底部信息 -->
      <view class="footer">
        <text @tap="isShowAgree" class="myicon" :class="showAgree ? 'icon-yuanxingxuanzhong' : 'icon-yuanxingweixuanzhong'">同意</text>
        <!-- 协议地址 -->
        <navigator url="" open-type="navigate" @click="fuwuxyClick">《服务协议》</navigator>
        <navigator url="" open-type="navigate" @click="yisixyClick">《隐私政策》</navigator>
      </view>
    </view>
    <block v-if="isUp">
      <mobileLogin :isUp="isUp" :authKey="auth.key" @wechatPhone="wechatPhone" @close="maskClose"></mobileLogin>
    </block>
    <block v-if="isPhoneBox">
      <routinePhone :logoUrl="logoUrl" :isPhoneBox="isPhoneBox" @close="bindPhoneClose" :authKey="auth.key"></routinePhone>
    </block>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import mobileLogin from './components/login-mobile.vue'
import routinePhone from './components/routine-phone.vue'
import Routine from '@/libs/routine'
import { mpUserInfo } from '@/libs/loginlib'
import { getLoginUserInfo } from '@/api/user'
import { getUserLiveComm } from '@/api/userComm'

const app = getApp()

export default {
  name: 'wechat',
  components: {
    mobileLogin,
    routinePhone
  },
  data() {
    return {
      statusBarHeight: '40px',
      isUp: false,
      isPhoneBox: false,
      loginType: 'weixin', // weixin/phone
      showAgree: false,

      auth: {
        key: ''
      }
    }
  },
  onLoad(e) {
    console.log(e)
  },
  computed: {
    ...mapGetters({
      sysInfo: 'app/sysInfo',
      localArea: 'app/localArea',
      locComPreUrl: 'app/locComPreUrl'
    })
  },
  created() {
    this.initData()
  },
  watch: {},
  methods: {
    initData() {
      this.statusBarHeight = this.sysInfo.statusBarHeight + 'px'
    },

    back() {
      uni.navigateBack()
    },
    home() {
      uni.switchTab({
        url: '/pages/index/index'
      })
    },
    // 弹窗关闭
    maskClose() {
      this.isUp = false
    },

    getUserProfile(e) {
      let _that = this
      uni.showLoading({
        title: '正在登录中'
      })
      Routine.getUserProfile()
        .then((profile) => {
          _that.getWxUser(profile)
        })
        .catch((res) => {
          uni.hideLoading()
        })
    },

    getWxUser(profile) {
      let _that = this
      if (!profile) {
        return
      }
      const { userInfo, user, ...userProf } = { ...profile, ...profile.user, ...profile.user.userInfo }
      //let userInfo = res.userInfo
      let userData = { ...userProf }
      userData.spreadPid = app.globalData.spid //获取推广人ID
      userData.spreadCode = app.globalData.qrCode //推广人分享二维码ID
      userData.thirdType = 'wroutine' // 微信小程序

      mpUserInfo(userData).then((res) => {
        if (res) {
          _that.auth.key = res.authKey
          if (res.authRet === 'login') {
            _that.$store.dispatch('user/setToken', res.token)
            _that.$store.dispatch('user/setUid', Number(res.uid))

            uni.hideLoading()

            _that.getUserInfo()
            _that.getLiveComm(res.uid)
            _that.$uniUtil.tips(
              {
                title: '登录成功',
                icon: 'success'
              },
              {
                tab: 3
              }
            )
          } else if (res.authRet === 'noreg') {
            uni.hideLoading()
            if (_that.loginType === 'weixin') {
              _that.isPhoneBox = true
              _that.isUp = false
            } else if (_that.loginType === 'phone') {
              _that.isUp = true
              _that.isPhoneBox = false
            }
          }
        }
      })
    },

    /**
     * 获取个人用户信息
     */
    getUserInfo() {
      const _that = this
      getLoginUserInfo().then((res) => {
        if (res.code === 0) {
          const _res = res.data
          let userInfo = { ..._res }
          const avatarUrl = _res.avatarUrl
          if (avatarUrl && !_that.$util.isRemoteUrl(avatarUrl) && _that.$util.startWith(avatarUrl, 'f/')) {
            userInfo.avatarUrl = _that.locComPreUrl + avatarUrl
          }
          _that.$store.dispatch('user/setUser', userInfo)
        }
      })
    },

    getPhoneNumber(e) {
      console.log(e.detail.errMsg)     
      console.log(e.detail.iv)     
      console.log(e.detail.encryptedData)     
      if (e.detail.errMsg == 'getPhoneNumber:fail user deny'){    
        wx.showModal({    
            title: '提示',    
            showCancel: false,    
            content: '未授权',    
            success: function (res) { }    
        })    
      } else {    
        wx.showModal({    
            title: '提示',    
            showCancel: false,    
            content: '同意授权',    
            success: function (res) { }    
        })    
      }    
    },

    wechatLogin(e) {
      if (this.showAgree === false) {
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: '请先同意《协议》'
        })
        return false
      }

      this.loginType = 'weixin' // 微信登录
      this.getUserProfile(e)
    },

    phoneLogin(e) {
      if (this.showAgree === false) {
        uni.showToast({
          icon: 'none',
          position: 'bottom',
          title: '请先同意《协议》'
        })
        return false
      }

      this.loginType = 'phone'
      this.getUserProfile(e)
    },

    getLiveComm(uid) {
      const _that = this
      const req = {
        cityCode: this.localArea.city.distCode,
        uid: uid
      }
      getUserLiveComm(req).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          const liveCommList = _res
          _that.$store.dispatch('user/setLiveComms', liveCommList)
        }
      })
    },

    bindPhoneClose(data) {
      const _that = this
      if (data.isStatus) {
        this.isPhoneBox = false
        _that.$uniUtil.tips(
          {
            title: '登录成功',
            icon: 'success'
          },
          {
            tab: 3
          }
        )
      } else {
        this.isPhoneBox = false
      }
    },

    /**
     * 输入手机号后的回调
     */
    wechatPhone() {
      this.$Cache.clear('snsapiKey')
      if (this.options.back_url) {
        let url = uni.getStorageSync('snRouter')
        url = url.indexOf('/pages/index/index') != -1 ? '/' : url
        if (url.indexOf('/pagesUser/wechat_login/index') !== -1) {
          url = '/'
        }
        if (!url) {
          url = '/pages/index/index'
        }
        this.isUp = false
        uni.showToast({
          title: '登录成功',
          icon: 'none'
        })
        setTimeout((res) => {
          location.href = url
        }, 800)
      } else {
        uni.navigateBack()
      }
    },

    /**
     * 选择协议
     */
    isShowAgree() {
      //是否选择协议
      this.showAgree = !this.showAgree
    },

    fuwuxyClick() {
      this.$Router.push({ path: '/article', query: { articleId: 1001 } })
    },

    yisixyClick() {
      this.$Router.push({ path: '/article', query: { articleId: 1101 } })
    }
  }
}
</script>

<style lang="scss">
page {
  background: #fff;
  height: 100%;
}

.wechat-box {
  background: #fff;
  height: 100%;

  .wechat_login {
    padding: 72rpx 34rpx;
    margin-top: 200rpx;

    .img image {
      width: 100%;
    }

    .btn-wrapper {
      margin-top: 86rpx;
      padding: 0 66rpx;

      button {
        width: 100%;
        height: 86rpx;
        line-height: 86rpx;
        margin-bottom: 40rpx;
        border-radius: 120rpx;
        font-size: 30rpx;

        &.btn1 {
          color: #fff;
        }

        &.btn2 {
          color: #666666;
          border: 1px solid #666666;
        }
      }
    }

    .footer {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      font-size: 30rpx;
      margin-top: 64rpx;
      color: rgba(0, 0, 0, 0.7);
      text-align: center;
      height: 40rpx;
      line-height: 40rpx;

      text {
        margin-left: 15rpx;
        margin-right: 15rpx;

        &::before {
          margin-right: 15rpx;
        }
      }

      .myicon {
        &::before {
          font-size: 42rpx;
        }
      }
    }
  }
}
</style>
