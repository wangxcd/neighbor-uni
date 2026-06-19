<!--
* @Description: 关注第三人的按钮
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-21 10:29:21
* @LastEditors: wangxc
* @LastEditTime: 2024-04-21 10:29:21
-->
<template>
  <view class="interest-btn-box">
    <view
      class="interest"
      v-if="isInterest"
      @click="switchInter(0)">
      已关注
    </view>
    <view
      class="no-interest"
      v-else
      @click="switchInter(1)">
      + 关注
    </view>
  </view>
</template>

<script>
export default {
  name: 'interestBtn',
  props: {
    // 目标对象用户ID
    tagUserId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      isInterest: 0 // 是否已关注0/1, 0表示未关注
    }
  },
  computed: {},
  created() {},
  watch: {},
  methods: {
    switchInter(toIst) {
      this.isInterest = toIst
    }
  }
}
</script>

<style lang="scss" scoped>
.interest-btn-box {
  width: 135rpx;
  height: 52rpx;
  line-height: 52rpx;
  font-weight: 500;
  text-align: center;

  .interest {
    color: #999;
    background: #f8f8f8;
    border-color: #999;
  }
  .no-interest {
    background-color: #f04142;
    border-color: #f04142;
    color: #fff;
    border-radius: 4px;
  }
}
</style>
