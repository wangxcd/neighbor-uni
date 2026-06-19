<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-05-02 10:33:13
* @LastEditors: wangxc
* @LastEditTime: 2024-05-02 10:33:13
-->
<template>
  <view class="index-box">
    <form @submit="formSubmit" report-submit="true">
      <view class="personal-data pad30">
        <view class="list borRadius14">
          <view class="item row-between-wrapper">
            <view class="title">头像</view>
            <view class="pictrue" @click.stop="chooseImage">
              <template v-if="userInfo.avatarUrl || (newAvatar && newAvatar.path)">
                <image :src="newAvatar ? newAvatar.path : userInfo.avatarUrl"></image>
              </template>
              <template v-else>
                <image src="/static/images/logo/f.png"></image>
              </template>
              <image src="/static/images/logo/alter.png" class="alter"></image>
            </view>
          </view>
          <view class="item row-between-wrapper">
            <view class="title">昵称</view>
            <view class="input">
              <input type="nickname" name="nickName" :value="userInfo.nickName" />
            </view>
          </view>
          <view class="item row-between-wrapper">
            <view class="title">手机</view>
            <view class="input">
              <view class="input row-between-wrapper">
                <input type="text" disabled="true" name="mobile" :value="newMobile ? newMobile : userInfo.mobile" />
              </view>
              <view class="btn">
                <button class="sub_btn" open-type="getRealtimePhoneNumber" @getrealtimephonenumber="getphonenumber">
                  <text class="txt">更换</text>
                </button>
              </view>
            </view>
            <!--
            <view class="input" v-if="!userInfo.mobile" @click="gotoPhoneBind"> 点击绑定手机号<text class="iconfont icon-xiangyou"></text> </view>
            <view class="input" v-else @click="gotPhoneEdit">
              <view class="input row-between-wrapper">
                <input type="text" disabled="true" name="mobile" :value="userInfo.mobile" class="id" />
                <text class="myicon icon-xiangyou1"></text>
              </view>
            </view>
            -->
          </view>
          <view class="item row-between-wrapper">
            <view class="title">ID号</view>
            <view class="input row-between-wrapper">
              <input type="text" :value="uid" disabled="true" class="id" />
              <text class="myicon icon-jiesuo"></text>
            </view>
          </view>
          <!-- #ifdef MP -->
          <!--
          <view class="item row-between-wrapper">
            <view>权限设置</view>
            <view class="input" @click="Setting"> 点击管理<text class="iconfont icon-xiangyou"></text> </view>
          </view>
          -->
          <!-- #endif -->
          <view class="item row-between-wrapper" v-if="false && userInfo.mobile">
            <view class="title">密码</view>
            <navigator url="/pagesUser/user_pwd_edit/index" hover-class="none" class="input"> 点击修改密码<text class="iconfont icon-xiangyou"></text> </navigator>
          </view>
        </view>
        <button class="modifyBnt" formType="submit">保存修改</button>
        <!-- #ifdef H5 -->
        <view class="logOut cart-color row-center-wrapper" @click="outLogin" v-if="loginType === 'h5' && !this.$util.isWeixin()">退出登录</view>
        <!-- #endif -->
      </view>
    </form>

    <u-notify ref="uNotify" message=""></u-notify>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLoginOut, userEdit, getUInfo } from '@/api/user'
import { batchUploadForCom } from '@/api/foss'
import { getWxBindPhone, txtUgcSecWeixinCheck, userAvatarCheckRes } from '@/api/public'

export default {
  name: 'index',
  components: {},
  data() {
    return {
      memberInfo: {},
      loginType: 'h5', //app.globalData.loginType
      userIndex: 0,
      newAvatar: undefined,
      avatarUgcInterval: null,

      newMobile: undefined,

      isAuto: false, //没有授权的不会自动授权
      isShowAuth: false //是否隐藏授权
    }
  },
  onLoad(e) {
    console.log(e)
  },
  onUnload() {
    const _that = this
    if (_that.avatarUgcInterval) {
      // 清除定时器
      clearInterval(_that.avatarUgcInterval)
    }
  },
  computed: {
    ...mapGetters({
      sysInfo: 'app/sysInfo',
      userInfo: 'user/userInfo',
      uid: 'user/uid',
      locComPreUrl: 'app/locComPreUrl'
    })
  },
  created() {},
  watch: {},
  methods: {
    /**
     * 选择图片上传
     * fKey: 上传文件key值
     */
    chooseImage() {
      const _that = this
      let maxImgSize = 200
      uni.chooseImage({
        count: 1, // 一次最多上传文件图片数
        sizeType: ['original', 'compressed'], // 是否压缩所选文件
        sourceType: ['album', 'camera'], // 来源是相册还是相机，默认二者都有
        success: function (res) {
          if (res.errMsg === 'chooseImage:ok') {
            const tempFiles = res.tempFiles
            let isLimtSize = false
            if (Array.isArray(tempFiles) && tempFiles.length > 0) {
              const item = tempFiles[0]
              if (item.size <= 1024 * maxImgSize) {
                _that.newAvatar = {
                  size: item.size,
                  path: item.path,
                  isTmp: true
                }
              } else {
                isLimtSize = true
              }
            }
            if (isLimtSize) {
              _that.$uniUtil.error(`图片不能超过${maxImgSize}k`)
            }
          }
        },
        fail: function (err) {
          console.log(err)
        },
        complete: function (e) {}
      })
    },

    gotoPhoneBind() {
      // url="/pagesUser/app_login/index" hover-class="none"
    },

    gotPhoneEdit() {
      this.$Router.push({ name: 'userPhone', params: {} })
    },

    // 小程序获取微信绑定手机号码
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
      return getWxBindPhone({
        code: e.code
      }).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          _that.newMobile = _res
        }
      }).catch((error) => {
        uni.hideLoading()
        this.$uniUtil.tips({
          title: error
        })
      })
    },

    /**
     * 上传文件
     * @returns
     */
    fileUpload() {
      const _that = this
      return new Promise((resove, reject) => {
        let tmpList = [_that.newAvatar] // 未上传的文件

        batchUploadForCom(tmpList, {
          storeType: 'user'
        })
          .then((files) => {
            if (files && Array.isArray(files) && files.length > 0) {
              const { path, ...f1 } = { ...files[0] }
              resove(f1)
            }
          })
          .catch(() => {
            reject()
          })
      })
    },

    /**
     * 提交修改
     */
    formSubmit(e) {
      const _that = this
      const form = e.detail.value
      if (!form.nickName) {
        return _that.$uniUtil.Tips({
          title: '用户姓名不能为空'
        })
      }
      if (!form.mobile) {
        return _that.$uniUtil.Tips({
          title: '用户手机号不能为空'
        })
      }

      let reqData = {}
      if (form.nickName !== _that.userInfo.nickName) {
        reqData.nickName = form.nickName
      }
      if (form.mobile !== _that.userInfo.mobile) {
        reqData.mobile = form.mobile
      }

      if (reqData.nickName) {
        // 如果用户昵称有修改，则进行ugc检查
        txtUgcSecWeixinCheck({
          title: reqData.nickName,
          content: reqData.nickName,
          scene: 1, // 1资料检查
          uid: _that.uid
        }).then((chkRes) => {
          if (chkRes && chkRes.code === 0) {
            const _chkRes = chkRes.data
            if (_chkRes.errCode === 0) {
              if (_chkRes.label > 1000) {
                // 检查未通过
                _that.$uniUtil.tips(
                  {
                    title: `昵称含${_chkRes.txtChkRes}文字`,
                    icon: 'error'
                  },
                  {
                    tab: 3,
                    delta: 1
                  }
                )
                return false
              } else if(_chkRes.label === 100) {
                // 检查昵称通过
                if (_that.newAvatar && _that.newAvatar.path) {
                  _that.fileUpload().then((upf) => {
                    if (upf) {
                      reqData.avatarUrl = upf.url
                      _that.saveEdit(reqData)
                    }
                  })
                } else {
                  _that.saveEdit(reqData)
                }
              }
            } else {
              _that.$uniUtil.tips(
                {
                  title: '用户昵称更改审核失败',
                  icon: 'fail'
                },
                {
                  tab: 3,
                  delta: 1
                }
              )
            }
          } else {
            _that.$uniUtil.tips(
                {
                  title: '用户昵称更改审核失败',
                  icon: 'exception'
                },
                {
                  tab: 3,
                  delta: 1
                }
              )
          }
        })
      } else {
        if (_that.newAvatar && _that.newAvatar.path) {
          _that.fileUpload().then((upf) => {
            if (upf) {
              reqData.avatarUrl = upf.url
              _that.saveEdit(reqData)
            }
          })
        } else {
          _that.saveEdit(reqData)
        }
      }
    },

    /**
     * 保存更改
     */
    saveEdit(form) {
      const _that = this
      if (form) {
        userEdit(form)
          .then((res) => {
            if (res.code === 0) {
              const _res = res.data
              if (_res) {
                _that.refershUserInfo()
                // 清除改变的图像路径
                _that.newAvatar = undefined
                _that.$uniUtil.tips(
                  {
                    title: '用户信息修改已成功',
                    icon: 'success'
                  }
                )

                // 定时获取头像UGC检查结果
                if (_that.avatarUgcInterval) {
                  clearInterval(_that.avatarUgcInterval)
                }
                // 设置间隔为1分钟
                _that.avatarUgcInterval = setInterval(
                  (function () {
                    const fn = function () {
                      _that.getUserAvatarCheckRes()
                    }
                    fn()
                    return fn
                  })(),
                  1000 * 10
                )
              }
            } else {
              _that.$uniUtil.tips(
                {
                  title: res.msg || '保存失败'
                }
              )
            }
          })
          .catch((msg) => {
            _that.$uniUtil.tips(
              {
                title: msg || '保存失败'
              }
            )
          })
      }
    },

    /**
     * 刷新用户信息
     */
    refershUserInfo() {
      getUInfo(this.uid).then((res) => {
        if (res.code === 0) {
          const newUserInfo = res.data
          const avatarUrl = newUserInfo.avatarUrl
          if (avatarUrl && !_that.$util.isRemoteUrl(avatarUrl) && _that.$util.startWith(avatarUrl, 'f/')) {
            newUserInfo.avatarUrl = _that.locComPreUrl + avatarUrl + '?d=' + new Data()
          }

          this.$store.dispatch('user/setUser', newUserInfo)
        }
      })
    },

    /**
     * 用户最近更新头像后UGC返回的检查结果
     */
    getUserAvatarCheckRes() {
      const _that = this
      userAvatarCheckRes().then((res) => {
        if (res.code === 0) {
          const checkRes = res.data
          if (checkRes) {
            if (checkRes.errCode === 0 && 'ok' === checkRes.errMsg) {
              // 检查成功
              if (_that.avatarUgcInterval) {
                // 清除定时器
                clearInterval(_that.avatarUgcInterval)
              }

              const resLabel = checkRes.label
              if (resLabel === 100) {
                // 正常, 头像更新成功，重新获取用户信息
                _that.refershUserInfo()
              } else if (resLabel === -100) {
                if(checkRes.mediaChkRes && Array.isArray(checkRes.mediaChkRes) && checkRes.mediaChkRes.length > 0) {
                  const tipMsg = `最近更改的用户头像因疑似【${checkRes.mediaChkRes[0]}】图片而未生效`
                  _that.$refs.uNotify.show({
                    top: 50,
                    type: 'error',
                    color: '#ed1c24',
                    bgColor: '#e8e8e8',
                    message: tipMsg,
                    duration: 1000 * 3,
                    fontSize: 12,
                    safeAreaInsetTop:true
                  })
                }
                _that.refershUserInfo()
                _that.newAvatar.path = undefined
              }
            }
          } else {
            if (_that.avatarUgcInterval) {
              clearInterval(_that.avatarUgcInterval)
            }
          }
        }
      })
    },

    /**
     * 退出登录
     *
     */
    outLogin() {
      let that = this
      if (that.loginType == 'h5') {
        uni.showModal({
          title: '提示',
          content: '确认退出登录?',
          success: function (res) {
            if (res.confirm) {
              getLoginOut()
                .then((res) => {
                  that.$store.dispatch('user/actLoginOut')
                  uni.reLaunch({
                    url: '/pages/index/index'
                  })
                })
                .catch((err) => {
                  console.log(err)
                })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.index-box {
  .personal-data {

    .list {
      margin-top: 30rpx;
      background-color: #fff;

      .item {
        border-bottom: 1rpx solid #f2f2f2;
        padding: 24rpx;
        font-size: 32rpx;
        color: #282828;
        margin-right: 20rpx;
        display: flex;

        .title {
          width: 200rpx;
          font-size: 32rpx;
        }

        .phone {
          width: 160rpx;
          height: 56rpx;
          font-size: 24rpx;
          color: #fff;
          line-height: 56rpx;
          border-radius: 32rpx;
        }

        .pictrue {
          width: 88rpx;
          height: 88rpx;
          position: relative;

          image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }

          .alter {
            width: 30rpx;
            height: 30rpx;
            border-radius: 50%;
            position: absolute;
            bottom: 0;
            right: 0;
          }
        }

        .input {
          width: 415rpx;
          color: #868686;
          display: flex;
          align-items: center;

          .iconfont {
            font-size: 35rpx;
          }

          .btn {
            .sub_btn {
              width: 110rpx;
              border: 1px solid rgb(151, 148, 148);
              border-radius: 8rpx;
              height: 60rpx;
              line-height: 48rpx;
              background: #f5f3f3;

              .txt {
                font-size: 28rpx;
              }
            }
          }
        }
      }
    }

    .modifyBnt {
      font-size: 32rpx;
      color: #fff;
      width: 690rpx;
      height: 90rpx;
      border-radius: 50rpx;
      text-align: center;
      line-height: 90rpx;
      margin: 76rpx auto 0 auto;
      background-color: #e93323 !important;
    }

    .logOut {
      font-size: 32rpx;
      text-align: center;
      width: 690rpx;
      height: 90rpx;
      border-radius: 45rpx;
      margin: 30rpx auto 0 auto;
    }
  }
}
</style>
