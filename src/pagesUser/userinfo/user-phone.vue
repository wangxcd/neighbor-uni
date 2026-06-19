<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-07-15 17:05:48
* @LastEditors: wangxc
* @LastEditTime: 2024-07-15 17:05:48
-->
<template>
  <view class="user-phone-box">
    <view class="chang-pwd">
      <view class="list">
        <view class="item" v-if="isNew">
          <input type="number" disabled="true" placeholder="填写手机号码" placeholder-class="placeholder" v-model="userInfo.mobile" />
        </view>
        <view class="item" v-if="!isNew">
          <input type="number" placeholder="填写手机号码" placeholder-class="placeholder" v-model="mobile" />
        </view>
        <view class="item acea-row row-between-wrapper">
          <input type="number" placeholder="填写验证码" placeholder-class="placeholder" class="codeIput" v-model="captcha" />
          <button class="code font-color" :class="disabled === true ? 'on' : ''" :disabled="disabled" @click="code">
            {{ text }}
          </button>
        </view>
      </view>

      <button form-type="submit" v-if="isNew" class="confirmBnt bg-color" @click="next">下一步</button>
      <button form-type="submit" v-if="!isNew" class="confirmBnt bg-color" @click="editPwd">保存</button>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import appstate from '@/libs/appstate'
import { bindingVerify, bindingPhone, registerVerify } from '@/api/user'

export default {
  name: 'user-phone',
  components: {},
  data() {
    return {
      mobile: '',
      captcha: '',
      isAuto: false, //没有授权的不会自动授权
      isShowAuth: false, //是否隐藏授权
      key: '',
      isNew: true,
      timer: '',
      text: '获取验证码',
      nums: 60
    }
  },
  onLoad(e) {
    console.log(e)
    if (this.isLogin) {
    } else {
      appstate.toLogin()
    }
  },
  computed: {
    ...mapGetters({
      sysInfo: 'app/sysInfo',
      userInfo: 'user/userInfo',
      uid: 'user/uid',
      isLogin: 'user/isLogin'
    })
  },
  created() {},
  watch: {},
  methods: {
    getTimes() {
      this.nums = this.nums - 1
      this.text = '剩余 ' + this.nums + 's'
      if (this.nums < 0) {
        clearInterval(this.timer)
      }
      this.text = '剩余 ' + this.nums + 's'
      if (this.text < '剩余 ' + 0 + 's') {
        this.disabled = false
        this.text = '重新获取'
      }
    },

    next() {
      uni.hideLoading()
      this.isNew = false
      this.captcha = ''
      clearInterval(this.timer)
      this.disabled = false
      this.text = '获取验证码'
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      if (!this.captcha) {
        return this.$uniUtil.tips({
          title: '请填写验证码'
        })
      }

      bindingVerify({
        mobile: this.userInfo.mobile,
        captcha: this.captcha
      })
        .then((res) => {
          uni.hideLoading()
          this.isNew = false
          this.captcha = ''
          clearInterval(this.timer)
          this.disabled = false
          this.text = '获取验证码'
        })
        .catch((err) => {
          return this.$uniUtil.tips({
            title: err
          })
          uni.hideLoading()
        })
    },

    editPwd() {
      let that = this
      if (!that.mobile) {
        return that.$uniUtil.tips({
          title: '请填写手机号码！'
        })
      }

      if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.mobile)) {
        return that.$uniUtil.tips({
          title: '请输入正确的手机号码！'
        })
      }
      if (!that.captcha) {
        return that.$uniUtil.tips({
          title: '请填写验证码'
        })
      }
      uni.showModal({
        title: '是否更换绑定账号',
        confirmText: '绑定',
        success(res) {
          if (res.confirm) {
            bindingPhone({
              mobile: that.mobile,
              captcha: that.captcha
            })
              .then((res) => {
                return that.$uniUtil.tips(
                  {
                    title: res.message,
                    icon: 'success'
                  },
                  {
                    tab: 5,
                    url: '/pagesUser/user_info/index'
                  }
                )
              })
              .catch((err) => {
                return that.$uniUtil.tips({
                  title: err
                })
              })
          } else if (res.cancel) {
            return that.$uniUtil.tips(
              {
                title: '您已取消更换绑定！'
              },
              {
                tab: 5,
                url: '/pagesUser/user_info/index'
              }
            )
          }
        }
      })
    },

    /**
     * 发送验证码
     *
     */
    async code() {
      this.nums = 60
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      let that = this
      if (!that.isNew) {
        if (!that.phone) {
          return that.$uniUtil.tips({
            title: '请填写手机号码！'
          })
        }
        if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.mobile))
          return that.$uniUtil.tips({
            title: '请输入正确的手机号码！'
          })
      }
      await registerVerify(that.isNew ? that.userInfo.mobile : that.mobile)
        .then((res) => {
          that.$uniUtil.tips({
            title: res.message
          })

          that.timer = setInterval(that.getTimes, 1000)
          that.disabled = true
          uni.hideLoading()
        })
        .catch((err) => {
          return that.$uniUtil.tips({
            title: err
          })
          uni.hideLoading()
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.user-phone-box {
  .chang-pwd {
    .phone {
      font-size: 32rpx;
      font-weight: bold;
      text-align: center;
      margin-top: 55rpx;
    }

    .list {
      width: 580rpx;
      margin: 53rpx auto 0 auto;

      .item {
        width: 100%;
        height: 110rpx;
        border-bottom: 2rpx solid #f0f0f0;

        input {
          width: 100%;
          height: 100%;
          font-size: 32rpx;
        }

        .codeIput {
          width: 340rpx;
        }

        .placeholder {
          color: #b9b9bc;
        }

        .code {
          font-size: 32rpx;
          color: #e93323 !important;
          // background-color: #fff;
        }

        .on {
          color: #b9b9bc !important;
        }
      }
    }
  }

  .confirmBnt {
    font-size: 32rpx;
    width: 580rpx;
    height: 90rpx;
    border-radius: 45rpx;
    color: #fff;
    margin: 92rpx auto 0 auto;
    text-align: center;
    line-height: 90rpx;
    background-color: #e93323 !important;
  }
}
</style>
