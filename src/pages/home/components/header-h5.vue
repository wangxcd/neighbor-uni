<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-08 07:23:38
* @LastEditors: wangxc
* @LastEditTime: 2024-04-08 07:23:38
-->
<template>
  <!-- #ifdef H5 -->
  <view class="header-h5">
    <view class="serch-wrapper flex">
      <view class="logo">
        <image :src="logoUrl" mode=""></image>
      </view>
      <navigator url="/pages/goods_search/index" class="input" hover-class="none">
        <text class="iconfont icon-xiazai5"></text>
        搜索商品
      </navigator>
    </view>
  </view>
  <!-- #endif -->
</template>

<script>
export default {
  name: "header-h5",
  components: {},
  data() {
    return {}
  },
  onLoad(e) {
    console.log(e)
  },
  computed: {},
  created() {},
  watch: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.header-h5 {
  width: 100%;
  background-color: $theme-color;
  padding: 28rpx 30rpx;

  .serch-wrapper {
    align-items: center;

    .logo {
      width: 118rpx;
      height: 42rpx;
      margin-right: 24rpx;
    }

    image {
      width: 118rpx;
      height: 42rpx;
    }

    .input {
      display: flex;
      align-items: center;
      width: 546rpx;
      height: 58rpx;
      padding: 0 0 0 30rpx;
      background: rgba(247, 247, 247, 1);
      border: 1px solid rgba(241, 241, 241, 1);
      border-radius: 29rpx;
      color: #bbbbbb;
      font-size: 26rpx;

      .iconfont {
        margin-right: 20rpx;
        font-size: 26rpx;
        color: #666666;
      }
    }
  }

  .tabNav {
    padding-top: 24rpx;
  }
}
</style>
