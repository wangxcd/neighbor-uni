<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-05-03 11:17:53
* @LastEditors: wangxc
* @LastEditTime: 2024-05-03 11:17:53
-->
<template>
  <view class="routine-phone-box" v-if="isPhoneBox">
    <view class="mobile-bg" @click="close"></view>
    <view class="mobile-mask animated" :class="{ slideInUp: isUp }">
      <view class="info-box">
        <view class="title">
          <view class="logo">
            <image :src="logoUrl"></image>
          </view>
          <view class="name">你居吾邻&社圈微生活</view>
        </view>
        
        <view class="title">获取授权</view>
        <view class="txt">账号需要绑定你的手机号</view>
      </view>
      <button class="sub_btn" open-type="getRealtimePhoneNumber" @getrealtimephonenumber="getphonenumber">
        <text class="myicon icon-c002dianhua"></text>
        <text>获取你的手机号登录</text>
      </button>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Routine from '@/libs/routine'
import { loginMobile, registerVerify, getCodeApi, getLoginUserInfo } from '@/api/user'
import { getLogo, getUserPhone } from '@/api/public'

const app = getApp()
export default {
  name: 'routine-phone',
  components: {},
  props: {
    isPhoneBox: {
      type: Boolean,
      default: false
    },
    authKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      keyCode: '',
      account: '',
      codeNum: '',
      isStatus: false,
      logoUrl: '/static/logo250527.png'
    }
  },
  onLoad(e) {
    console.log(e)
  },
  computed: {
    ...mapGetters({
      sysInfo: 'app/sysInfo',
      locComPreUrl: 'app/locComPreUrl'
    })
  },
  created() {
    getLogo().then((res) => {
      this.logoUrl = res.data.logoUrl
    })
  },
  watch: {},
  methods: {
    // #ifdef MP
    // 小程序获取手机号码
    getphonenumber(e) {
      const detail = e.detail
      if (detail.errMsg == 'getPhoneNumber:ok') {
        console.log('用户同意授权')
        uni.showLoading({ title: '加载中' })
        this.getUserPhoneNumber(detail).then(() => {
          uni.hideLoading()
        })
      }
    },
    // 小程序获取手机号码回调
    getUserPhoneNumber(e) {
      const _that = this
      return getUserPhone({
        code: e.code,
        encryptedData: e.encryptedData,
        iv: e.iv,
        authKey: this.authKey,
        loginType: 'weixin',
        tokenType: 'wroutine'
      }).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          _that.$store.dispatch('user/setToken', _res.token)
          _that.$store.dispatch('user/setUid', Number(_res.uid))

          _that.getUserInfo()
        }
      }).catch((error) => {
        uni.hideLoading()
        this.$uniUtil.tips({
          title: error
        })
      })
    },

    /**
     * 获取个人用户信息
     */
    getUserInfo: function () {
      let _that = this
      getLoginUserInfo().then((res) => {
        uni.hideLoading()
        if (res.code === 0) {
          const _res = res.data
          let userInfo = { ..._res }
          const avatarUrl = _res.avatarUrl
          if (!_that.$util.isRemoteUrl(avatarUrl) && _that.$util.startWith(avatarUrl, 'f/')) {
            userInfo.avatarUrl = _that.locComPreUrl + avatarUrl
          }
          _that.$store.dispatch('user/setUser', userInfo)
          _that.userInfo = userInfo
          _that.isStatus = true
          _that.close()
        }
      })
    },
    // #endif
    close() {
      this.$emit('close', { isStatus: this.isStatus })
    }
  }
}
</script>

<style lang="scss" scoped>
.routine-phone-box {
  .mobile-bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  .mobile-mask {
    z-index: 20;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 67rpx 30rpx;
    background: #fff;
    .info-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      image {
        width: 150rpx;
        height: 150rpx;
        border-radius: 10rpx;
      }
      .title {
        margin-top: 30rpx;
        margin-bottom: 20rpx;
        font-size: 36rpx;
      }
      .txt {
        font-size: 30rpx;
        color: #868686;
      }
    }
    .sub_btn {
      width: 690rpx;
      height: 86rpx;
      line-height: 86rpx;
      margin-top: 60rpx;
      background: $theme-color;
      border-radius: 43rpx;
      color: #fff;
      font-size: 28rpx;
      text-align: center;
    }
  }
  .animated {
    animation-duration: 0.4s;
  }
}
</style>
