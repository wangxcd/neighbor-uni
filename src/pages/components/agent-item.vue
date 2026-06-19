<!--
* @Description: 打赏跑腿列表项组件
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-19 17:06:20
* @LastEditors: wangxc
* @LastEditTime: 2024-04-19 17:06:20
-->
<template>
  <view class="agent-item-box">
    <navigator url="/pages/goods/goods" style="padding: 0 10rpx">
      <view class="title-line">
        <view class="tag">紧急</view>
        <view class="item-title">代扔垃圾代扔垃圾代扔垃圾代扔垃圾代扔垃圾代扔垃圾</view>
        <view class="reward" style="text-align: right">
          <text class="lab">赏</text>
          <text class="desc">100元</text>
        </view>
      </view>
      <view class="desc-line">
        <view class="addr">59#楼3单元10层</view>
        <view class="limit">
          <text class="lab">要求</text>
          <text class="desc">力气大</text>
        </view>
        <view class="past_time">
          <text class="desc">30分钟前</text>
        </view>
      </view>
    </navigator>
  </view>
</template>

<script>
export default {
  name: 'agent-item',
  components: {},
  data() {
    return {}
  },
  computed: {},
  created() {},
  watch: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.agent-item-box {
  border-bottom: 1px dashed #eceaea;
  margin: 20rpx 0;
  padding: 0 10rpx;

  .title-line {
    display: flex;
    justify-content: space-between;
    font-size: 26rpx;

    .tag {
      width: 64rpx;
      height: 26rpx;
      line-height: 26rpx;
      font-size: 20rpx;
      color: #ff4c48;
      border-radius: 26rpx;
      text-align: center;
      border: 2rpx solid #ff4947;
    }

    .item-title {
      width: 480rpx;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .desc-line {
    display: flex;
    justify-content: space-between;
    font-size: 24rpx;
    margin: 10rpx 10rpx 10rpx 64rpx;
  }

  .lab {
    &::after {
      content: ': ';
    }
  }

  .addr {
    width: 250rpx;
  }

  .limit {
    width: 200rpx;

    .lab {
      color: #999;
    }

    .desc {
      color: rgb(218, 19, 142);
    }
  }

  .past_time {
    width: 200rpx;

    .lab {
      color: #999;
    }

    .desc {
      color: rgb(11, 134, 28);
      float: right;
    }
  }

  .reward {
    width: 200rpx;

    .lab {
      color: #999;
    }

    .desc {
      color: goldenrod;
    }
  }
}
</style>
