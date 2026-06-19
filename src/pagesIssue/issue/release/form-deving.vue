<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-10-24 13:27:03
* @LastEditors: wangxc
* @LastEditTime: 2024-10-24 13:27:03
-->
<template>
  <view class="form-box">
    <u-navbar
      height="44"
      :fixed="true"
      leftText="返回"
      :autoBack="true"
      :title="`信息发布-${infoCate.cateTitle}`"
      titleStyle="font-size: 15px;"
      bgColor="#0AB27D"
      :border="true"></u-navbar>
    <view class="page-body" :style="{ 'padding-top': `${sysInfo.statusBarHeight + 48}px` }">
      <form @submit="formSubmit1" report-submit="true">
        <view class="deving">功能研发中，敬请等待...</view>
      </form>
    </view>
  </view>
</template>

<script>
import releaseForm from './release-form'

export default {
  name: 'form-deving',
  components: {
  },
  data() {
    const $d = releaseForm.data()
    return {
      ...$d
    }
  },
  onLoad(e) {
    this.pageOnLoad(e)
  },
  onShow(e) {
    console.log(e)
  },
  onReachBottom(e) {
    console.log(e)
  },
  computed: {
    ...releaseForm.computed
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    ...releaseForm.methods,
    initData() {
      this.formInit()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/scss/release/release-form.scss';

.form-box {
  .deving {
    margin: 50rpx 30rpx;
    min-height: 200rpx;
    background-color: #fff;
    font-size: 14px;
    padding: 50rpx 30rpx;
  }
}
</style>
