<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2023-08-17 19:48:16
* @LastEditors: wangxc
* @LastEditTime: 2023-08-17 19:48:16
-->
<template>
  <view id="BottomBar">
    <view class="bar-content justify-between">
      <view class="bar-item" :class="{ 'text-color': value == index + 1 }" v-for="(item, index) in barlists"
        :key="index" @click="go(index, item)">
        <view v-if="item.text" class="justify-center flex-col align-center">
          <i :class="['myicon icon_class', `${item.icon}`]"></i>
          <view class="uifont text">{{ item.text }}</view>
        </view>
        <view v-else class="justify-center align-center">
          <view class="justify-center align-center only-icon">
            <i :class="['myicon', `${item.icon}`]"></i>
          </view>
        </view>
      </view>
    </view>
    <u-modal :show="confirmModel.show" 
        :closeOnClickOverlay="confirmModel.closeOnClickOverlay" 
        :showCancelButton="true"
        @confirm="confirmOk" @cancel="confirmCancel" @close="confirmCancel">
      <view class="slot-content" :style="{ 'font-size': confirmModel.fontSize ? confirmModel.fontSize : '32rpx' }">
        <view class="content">
          <view class="txt">只有生活区中[常居用户]才可发布信息。</view>
          <view class="txt">
            <text>你可以通过底部菜单</text>
            <text style="color: #ff9900;">"我的"- "常居生活区"</text>
            <text>添加当前生活区为你的常居生活区。</text>
          </view>
          <view class="txt">是否现在去添加？</view>
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import config from '@/config/config'
  import appstate from '@/libs/appstate'
  import {
    getUserLiveComm
  } from '@/api/userComm'

  export default {
    name: 'BottomBar',
    data() {
      return {
        barlists: config.bottomBars,

        confirmModel: {
          show: false,
          title: '',
          content: '',
          fontSize: '32rpx',
          closeOnClickOverlay: true
        }
      }
    },
    props: {
      value: Number
    },
    computed: {
      ...mapGetters({
        localArea: 'app/localArea',
        uid: 'user/uid',
        userliveComms: 'user/userliveComms',
        localComm: 'app/localComm'
      })
    },
    created() {},
    methods: {
      go(index, item) {
        this.$emit('update:input', index)

        const curPage = '/' + this.$uniUtil.prePage()
        if (item.pagePath !== curPage) {
          if (item.pagePath === '/pages/home/issue/index') {
            const chkRes = appstate.checkLogin()
            if (!chkRes) {
              // 仅登录用户可以发布信息
              appstate.toLogin()
              return false
            }

            if (!this.userliveComms || this.userliveComms.length === 0) {
              if (this.localArea && this.localArea.city && this.uid) {
                this.getLiveComm().then(() => {
                  if (!this.checkPermit()) {
                    // this.$uniUtil.error('只有常居用户才可发布信息')
                    this.confirmModel.show = true
                    return false
                  } else {
                    // this.$uniUtil.redirect(item.pagePath);
                    this.$Router.push({
                      name: item.name
                    })
                  }
                })
              }
            } else {
              if (!this.checkPermit()) {
                // this.$uniUtil.error('只有常居用户才可发布信息')
                this.confirmModel.show = true
                return false
              } else {
                // this.$uniUtil.redirect(item.pagePath);
                this.$Router.push({
                  name: item.name
                })
              }
            }
          } else {
            // this.$uniUtil.redirect(item.pagePath)
            this.$Router.replace({
              name: item.name
            })
          }
        }
      },

      // 检查发布权限
      checkPermit() {
        const comm = this.localComm.comm
        let isPermit = false
        if (comm) {
          const comId = comm.comId
          if (this.userliveComms && this.userliveComms.length > 0) {
            const liveComm = this.userliveComms.find((el) => el.comId === comId)
            if (liveComm) {
              isPermit = true
            }
          }
        }
        return isPermit
      },

      getLiveComm() {
        const _that = this
        const req = {
          cityCode: this.localArea.city.distCode,
          uid: this.uid
        }
        return new Promise((resolve, reject) => {
          getUserLiveComm(req).then((res) => {
            if (res.code === 0) {
              const _res = res.data
              _that.$store.dispatch('user/setLiveComms', _res)
            }
            resolve()
          })
        })
      },

      confirmOk() {
        this.confirmModel.show = false
        this.$Router.push({
          name: 'liveComm'
        })
      },

      confirmCancel() {
        this.confirmModel.show = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .bar-content {
    position: fixed;
    bottom: 0;
    width: 100%;
    box-shadow: 0px 2px 16px 0px rgba(4, 0, 0, 0.45);
    z-index: 50;
    background-color: #ffffff;

    .bar-item {
      flex: 1;
      padding-top: 8px;
      padding-bottom: 4px;

      .text {
        margin-top: 4px;
        font-size: 12px;
      }

      .icon_class {
        font-size: 18px;
      }

      .only-icon {
        width: 36px;
        height: 36px;
        margin: auto;
        font-size: 32px;
        font-weight: 700;
        background-color: darkcyan;
        color: white;
        border-radius: 50%;
      }
    }

    .bar-item:active {
      background: #f0f0f0;
    }
  }

  .slot-content {
    font-size: 32rpx;

    .content {
      font-size: 32rpx;
      margin-bottom: 10rpx;

      .txt {
        margin: 15rpx 0;
      }
    }
  }
</style>