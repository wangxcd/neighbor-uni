<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2023-08-18 11:42:57
* @LastEditors: wangxc
* @LastEditTime: 2023-08-18 11:42:57
-->
<template>
  <view id="Empty" class="content" :class="classname">
    <view class="tips">
      <span class="tipIcon myicon icon-meiyoushuju"></span>
      <view class="tipText">{{ tipsText }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Empty',
  data () {
    return {
    }
  },
  props: {
    tipsText: {
      type: String,
      default: '暂无数据'
    },
    classname: {
      type: String,
      default: ''
    },
  },
  onload (e) {
    console.log(e)
  },
  computed: {
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.content {
  .tips {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20%;

    .tipIcon {
      font-size: 90px;
      color: #999999;
    }

    .tipText {
      font-size: 18px;
      color: #999999;
      margin-top: 5px;
    }
  }
}
</style>
