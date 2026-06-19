<!--
* @Description: 动态表单行组合(一个或多个表单项组合成表单上显示的一行)
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-06-15 11:08:58
* @LastEditors: wangxc
* @LastEditTime: 2024-06-15 11:08:58
-->
<template>
  <view class="dyform-comb-row-box">
    <view class="col">
      <view class="title">
        <image class="tubiao" src="/img/icon_nearby.png"></image>
        <text class="rowLab">{{ rowLabel }}:</text>
      </view>
      <view class="form-input">
        <view class="input-row"> </view>
        <input type="text" name="contactMan" :value="userInfo.nickName" placeholder="请填写联系人" />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'dyform-comb-row',
  components: {},
  props: {
    rowLabel: {
      type: String,
      default: ''
    }
  },
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
.dyform-comb-row-box {
}
</style>
