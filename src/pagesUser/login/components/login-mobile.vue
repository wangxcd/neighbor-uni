<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-08-12 11:01:37
* @LastEditors: wangxc
* @LastEditTime: 2024-08-12 11:01:37
-->
<template>
  <view class="login-mobile-box" v-if="isUp">
    <view class="mobile-bg" v-if="isShow" @click="close"></view>
    <view class="mobile-mask animated" :class="{ slideInUp: isUp }" :style="{ position: isPos ? 'fixed' : 'static' }">
      <view class="input-item">
        <input type="text" v-model="account" placeholder="输入手机号" />
      </view>
      <view class="input-item">
        <input type="text" :class="{ disabled: !canInKeyCode }" :disabled="!canInKeyCode" v-model="codeNum" placeholder="输入验证码" />
        <button class="code" :disabled="disabled" @click="geVerCode">{{ text }}</button>
      </view>
      <view class="sub-btn" v-if="!subBtnDisabled" @click="loginBtn">{{ isLogin ? '立即绑定' : '立即登录' }}</view>
      <view class="sub-btn btn-disabled" v-else>{{ isLogin ? '立即绑定' : '立即登录' }}</view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import sendVerifyCode from '@/mixins/SendVerifyCode'
import { sendPhoneCode, getLoginUserInfo } from '@/api/user'
import { getUserLiveComm } from '@/api/userComm'
import { getUserPhone } from '@/api/public'

const app = getApp()

export default {
  name: 'login-mobile',
  components: {},
  props: {
    isUp: {
      type: Boolean,
      default: false
    },
    isShow: {
      type: Boolean,
      default: true
    },
    isPos: {
      type: Boolean,
      default: true
    },
    authKey: {
      type: String,
      default: ''
    },
    appleShow: {
      type: String,
      default: ''
    },
    platform: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      account: '',
      codeNum: '',
      isApp: 0,
      keyCode: '',
      canInKeyCode: false
    }
  },
  mixins: [sendVerifyCode],
  computed: {
    ...mapGetters({
      isLogin: 'user/isLogin',
      sysInfo: 'app/sysInfo',
      locComPreUrl: 'app/locComPreUrl',
      localArea: 'app/localArea'
    }),

    subBtnDisabled() {
      return !this.account.length || !this.codeNum.length
    }
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    close() {
      this.$emit('close', false)
    },

    // 获取验证码
    async geVerCode() {
      let _that = this
      if (!_that.account)
        return _that.$uniUtil.tips({
          title: '请填写手机号码'
        })
      if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(_that.account))
        return _that.$uniUtil.tips({
          title: '请输入正确的手机号码'
        })

      await sendPhoneCode(_that.account)
        .then((res) => {
          _that.$uniUtil.tips({
            title: res.msg
          })
          _that.canInKeyCode = true
          _that.codeNum = '111111'
          _that.sendCode()
        })
        .catch((err) => {
          return _that.$uniUtil.tips({
            title: err
          })
        })
    },

    // 获取验证码api
    getCode() {
      let that = this
      getCodeApi()
        .then((res) => {
          that.keyCode = res.data.key
        })
        .catch((res) => {
          that.$uniUtil.tips({
            title: res
          })
        })
    },

    // 登录
    loginBtn() {
      let _that = this
      if (!_that.account) {
        return _that.$uniUtil.tips({
          title: '请填写手机号码'
        })
      }
      if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(_that.account)) {
        return _that.$uniUtil.tips({
          title: '请输入正确的手机号码'
        })
      }
      if (!_that.codeNum) {
        return _that.$uniUtil.tips({
          title: '请填写验证码'
        })
      }
      if (!/^[\w\d]+$/i.test(_that.codeNum)) {
        return _that.$uniUtil.tips({
          title: '请输入正确的验证码'
        })
      }
      uni.showLoading({
        title: _that.isLogin ? '正在绑定中' : '正在登录中'
      })
      if (_that.isLogin) {
        iosBinding({
          captcha: _that.codeNum,
          phone: _that.account
        })
          .then((res) => {
            _that.$uniUtil.tips(
              {
                title: '绑定手机号成功',
                icon: 'success'
              },
              {
                tab: 3
              }
            )
            _that.isApp = 1
            _that.getUserInfo()
          })
          .catch((error) => {
            uni.hideLoading()
            _that.$uniUtil.tips({
              title: error
            })
          })
      } else {
        const req = {
          captcha: _that.codeNum,
          phone: _that.account,
          loginType: 'phone',
          tokenType: 'wroutine', // 手机号登录仍然存用户在小程序中的openId
          authKey: _that.authKey
        }
        getUserPhone(req)
          .then((res) => {
            if (res.code === 0) {
              const { token, ...userInfo } = res.data
              const uid = Number(userInfo.uid)
              _that.$store.dispatch('user/setToken', token)
              _that.$store.dispatch('user/setUid', uid)

              _that.getUserInfo()
              _that.getLiveComm(uid)
            }
          })
          .catch((error) => {
            uni.hideLoading()
            _that.$uniUtil.tips({
              title: error
            })
          })
      }
    },

    /**
     * 获取个人用户信息
     */
    getUserInfo() {
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
          _that.isStatus =
            // #ifdef MP
            _that.$uniUtil.tips(
              {
                title: '登录成功',
                icon: 'success'
              },
              {
                tab: 3
              }
            )
          _that.close()
          // #endif
          // #ifdef H5
          _that.$emit('wechatPhone', true)
          // #endif
        }
      })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.login-mobile-box {
  .mobile-bg {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  .isPos {
    position: static;
  }

  .animated {
    animation-duration: 0.4s;
  }

  .mobile-mask {
    z-index: 20;
    // position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 67rpx 30rpx;
    background: #fff;

    .input-item {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 86rpx;
      margin-bottom: 38rpx;

      input {
        flex: 1;
        display: block;
        height: 100%;
        padding-left: 40rpx;
        border-radius: 43rpx;
        border: 1px solid #dcdcdc;
      }

      input.disabled {
        pointer-events: none;
        background-color: #e0e0e0;
      }

      .code {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 220rpx;
        height: 86rpx;
        margin-left: 30rpx;
        background: rgba(233, 51, 35, 0.05);
        font-size: 28rpx;
        color: $theme-color;
        border-radius: 43rpx;

        &[disabled] {
          background: rgba(0, 0, 0, 0.05);
          color: #999;
        }
      }
    }

    .sub-btn {
      width: 690rpx;
      height: 86rpx;
      line-height: 86rpx;
      margin-top: 60rpx;
      background: #e93323;
      border-radius: 43rpx;
      color: #fff;
      font-size: 28rpx;
      text-align: center;
    }

    .btn-disabled {
      background: #c8c9cc;
    }
  }
}
</style>
