<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-24 23:19:43
* @LastEditors: wangxc
* @LastEditTime: 2024-04-24 23:19:43
-->
<template>
  <view class="msg-box">
    <view :style="{ height: `${config.bottomBarHeight}px` }">
      <BottomBar
        v-model="barIndex"
        :barlists="barlists" />
    </view>
  </view>
</template>

<script>
export default {
  name: 'msg',
  components: {},
  data() {
    return {
      barIndex: 4,
      config: this.$config
    }
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
.msg-box {
}
</style>
