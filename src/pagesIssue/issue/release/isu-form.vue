<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-07-13 11:13:13
* @LastEditors: wangxc
* @LastEditTime: 2024-07-13 11:13:13
-->
<template>
  <view class="isu-form-box">
    <template v-if="mCateName === 'aaa'"></template>
    <normal v-else :sCateId="sCateId"></normal>
  </view>
</template>

<script>
import normal from './components/normal.vue'

export default {
  name: 'isu-form',
  components: {
    normal
  },
  data() {
    return {
      mCateName: undefined,
      sCateId: undefined,
      sCateName: undefined
    }
  },
  onLoad(e) {
    if (e.sCateId && e.mCateName && e.sCateName) {
      this.sCateId = Number(e.sCateId)
      this.mCateName = e.mCateName
      this.sCateName = e.sCateName
    } else {
      this.$uniUtil.back(1)
    }
  },
  computed: {},
  created() {},
  watch: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.isu-form-box {
}
</style>
