<!--
* @Description: 底部评论操作区
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-23 16:31:06
* @LastEditors: wangxc
* @LastEditTime: 2024-04-23 16:31:06
-->
<template>
  <view class="comment-bottom-op-box flex">
    <view
      class="input"
      @click="showForm">
      <text class="myicon icon-bianji"></text>
      文明评论...
    </view>
    <view class="op-vote flex around">
      <view
        class="agree uni-icons uniui-hand-up"
        title="赞"></view>
      <view
        class="oppose uni-icons uniui-hand-down"
        title="踩"></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'comment-bottom-op',
  components: {},
  data() {
    return {}
  },
  created() {},
  watch: {},
  methods: {
    showForm() {
      this.$emit('pubShow')
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-bottom-op-box {
  .input {
    display: flex;
    align-items: center;
    width: 500rpx;
    height: 60rpx;
    margin: 15rpx 30rpx 20rpx 30rpx;
    padding: 0 0 0 30rpx;
    background: rgba(247, 247, 247, 1);
    border: 1px solid rgba(241, 241, 241, 1);
    border-radius: 12rpx;
    color: #bbbbbb;
    font-size: 28rpx;

    .iconfont {
      margin-right: 20rpx;
    }
  }

  .op-vote {
    font-size: 40rpx;
    width: 200rpx;
  }

  .uni-icons {
    &::before {
      font-size: 50rpx;
    }

    text {
      padding-left: 10rpx;
    }
  }
}
</style>
