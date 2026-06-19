<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-10-23 16:13:32
* @LastEditors: wangxc
* @LastEditTime: 2024-10-23 16:13:32
-->
<template>
  <view class="index-box">
    <view class="qrcode">
      <image :src="qrCodeImg" class="slide-image" :class="swiperIndex == index ? 'active' : 'quiet'" mode="aspectFill" />
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { getShareQrCode } from '@/api/public'
import sysApi from '@/api/sys'

export default {
  name: 'index',
  components: {},
  data() {
    return {
      qrCodeImg: ''
    }
  },
  onLoad(e) {
    console.log(e)
  },
  onShow(e) {
    console.log(e)
  },
  onReachBottom(e) {
    console.log(e)
  },
  computed: {
    ...mapGetters({
      sysInfo: 'app/sysInfo',
      localArea: 'app/localArea',
      localComm: 'app/localComm',
      userInfo: 'user/userInfo',
      uid: 'user/uid',
      isLogin: 'user/isLogin'
    })
  },
  created() {
    this.initData()
  },
  mounted() {},
  watch: {},
  methods: {
    initData() {
      const _that = this
      debugger
      if (_that.isLogin && _that.uid) {
        const req = {
          path: 'pages/index/index',
          envVersion: 'develop',
          spid: _that.uid,
          cityCode: _that.localArea.city.distCode,
          adCode: _that.localComm.ad.distCode,
          comId: _that.localComm.comm.comId
        }
        getShareQrCode(req).then((res) => {
          if (res.code === 0) {
            const _res = res.data
            if (_res.columns && _res.columns.code) {
              _that.qrCodeImg = _res.columns.code
            }
          }
        })
      } else {
        sysApi.getSysArticle(1005).then((res) => {
          debugger
          if (res.code === 0) {
            const _res = res.data
            if (_res) {
              _that.qrCodeImg = _res.htmlContent
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.index-box {
  .qrcode {
    image {
      width: 500rpx;
      height : 500rpx;
    }
  }
}
</style>
