<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-08 07:24:31
* @LastEditors: wangxc
* @LastEditTime: 2024-04-08 07:24:31
-->
<template>
  <!-- #ifdef MP -->
  <view class="header-mp">
    <view class="sys-head" :style="{ height: `${statusBarHeight}px` }"></view>
    <view class="title-box" :style="{ width: `${headTitleSize.width}px`, height: `${headTitleSize.height}px` }">
      <view class="header-wrapper flex">
        <view class="city" @click="toCityPick">
          <text class="myicon icon-fujin"></text>
          <text class="loc">{{ localArea.city.distName || '未知城市' }}</text>
        </view>
        <view class="title">
          <text>{{ appCnName }}</text>
        </view>
      </view>
    </view>
    <view class="serch-box" :style="{ height: `${searchBoxSize.height}px` }">
      <view class="header-wrapper flex">
        <view class="live-comm" @click="toCommPick">
          <view class="comm-logo">
            <image src="@/static/images/logo/zhuzhaixiaoqu.png" mode=""></image>
          </view>
          <view class="comm-name">
            <text class="title">{{ localComm.ad.distName || localArea.ad.distName || '未知区(县)' }} / {{ localComm.comm.title || '未知生活区' }}</text>
          </view>
        </view>
        <!--
        <navigator url="/pages/goods_search/index" class="input" hover-class="none">
          <text class="myicon icon-sousuo"></text>
          信息检索
        </navigator>
        -->
        <view class="user flex">
          <template v-if="isLogin">
            <view class="head-img">
              <image v-if="userInfo && userInfo.avatarUrl" class="avatar" :src="userInfo.avatarUrl"></image>
              <image v-else class="avatar" src="/static/images/logo/f.png" mode=""></image>
            </view>
            <view class="username">{{ userInfo.nickName }}</view>
            <view class="role">
              <text>(</text>
              <text>{{ userCommRole.roleName }}</text>
              <text>)</text>
            </view>
          </template>
          <template v-else>
            <view class="head-img">
              <image class="avatar" src="/static/images/logo/f.png" mode=""></image>
            </view>
            <view class="username">访客</view>
          </template>
        </view>
      </view>
    </view>
  </view>
  <!-- #endif -->
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'header-mp',
  components: {},
  data() {
    return {
      appCnName: this.$config.appCnName,
      statusBarHeight: 44,
      headTitleSize: {
        width: 320,
        height: 40
      },
      searchBoxSize: {
        width: 160,
        height: 32
      }
    }
  },
  computed: {
    ...mapGetters({
      sysInfo: 'app/sysInfo',
      isLogin: 'user/isLogin',
      uid: 'user/uid',
      userInfo: 'user/userInfo',
      localArea: 'app/localArea',
      localComm: 'app/localComm',
      userCommRole: 'app/userCommRole'
    })
  },
  created() {
    this.initWin()
  },
  watch: {},
  methods: {
    initWin() {
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
      this.statusBarHeight = this.sysInfo.statusBarHeight

      /*
       * 因为getMenuButtonBoundingClientRect在不同机返回值不准确，这儿采用宽度一半+2个汉字长度设置顶部title宽度
       */
      this.headTitleSize = {
        width: this.sysInfo.screenWidth / 2 + 16 * 2 + 10,
        height: menuButtonInfo.height + 10
      }
      this.searchBoxSize = {
        width: this.sysInfo.screenWidth / 2,
        height: 32
      }
      const totalHeight = this.sysInfo.statusBarHeight + this.headTitleSize.height + this.searchBoxSize.height
      this.$emit('headerHeight', totalHeight)
    },

    initData() {
      // 没有历史浏览社区
      if (!this.localComm) {
      }
    },

    toCityPick() {
      this.$Router.push({ name: 'cityPick', params: { lineIdx: 1 } })
    },

    toCommPick() {
      const _that = this
      // 跳转到住宅区/社区选择页
      setTimeout(() => {
        _that.$Router.push({ name: 'commPick', params: { lineIdx: 1 } })
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.header-mp {
  z-index: 999;
  // position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  /* #ifdef H5 */
  padding-bottom: 20rpx;
  /* #endif */
  background-color: $theme-color;

  .header-wrapper {
    height: 100%;
    align-items: center;
    padding: 0 20rpx 0 30rpx;
  }

  .title-box {
    .city {
      width: 100px;
      height: 42rpx;
      padding-top: 10rpx;
      font-size: 14px;

      .loc {
        display: inline-block;
        position: relative;
        padding-left: 5px;
        padding-right: 10px;
        color: #222;

        &::after {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          border: 3px solid #222;
          border-color: #222 transparent transparent transparent;
          border-width: 4px 3px 4px 3px;
          right: 0;
          top: 50%;
          margin-top: -2px;
        }
      }
    }

    .title {
      flex: 1;
      text-align: right;
      font-size: 16px;
    }
  }

  .serch-box {
    .header-wrapper {
      display: flex;
      justify-content: space-between;
    }

    .live-comm {
      display: flex;

      .comm-logo {
        image {
          width: 32rpx;
          height: 42rpx;
          margin-right: 10rpx;
        }
      }

      .comm-name {
        flex-grow: 1;

        .title {
          color: #fff;
          font-size: 24rpx;
        }
      }
    }

    .user {
      .head-img {
        .avatar {
          width: 32rpx;
          height: 42rpx;
          margin-right: 10rpx;
        }
      }
      .username {
      }
      .role {
      }
    }

    .input {
      display: flex;
      float: right;
      align-items: center;
      /* #ifdef MP */
      width: 305rpx;
      /* #endif */
      height: 50rpx;
      padding: 0 0 0 30rpx;
      background: rgba(247, 247, 247, 1);
      border: 1px solid rgba(241, 241, 241, 1);
      border-radius: 29rpx;
      color: #bbbbbb;
      font-size: 28rpx;

      .iconfont {
        margin-right: 20rpx;
      }
    }
  }
}
</style>
