<!--
* @Description: 信息详情
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-06-28 08:41:01
* @LastEditors: wangxc
* @LastEditTime: 2024-06-28 08:41:01
-->
<template>
  <view class="info-detail-box" :style="{ 'min-height': sysInfo.pageHeight + 'px', 'padding-top': `${sysInfo.statusBarHeight + 48}px` }">
    <u-navbar
      height="44"
      :fixed="true"
      leftText="返回"
      :autoBack="true"
      :title="`详情-${infoCate.cateTitle}`"
      titleStyle="font-size: 15px;"
      bgColor="#0AB27D"
      :border="true"></u-navbar>
    <view class="body">
      <template v-if="mCateName === 'aaa'"></template>
      <shfwDetail v-else-if="mCateName === 'shfw' || mCateName === 'jhqx'" ref="infoShfw" :infoDetail="infoDetail"></shfwDetail>
      <agentDetail v-else-if="mCateName === 'dspt'"  ref="infoDspt" :infoDetail="infoDetail" :infoCate="infoCate" :parCate="parCate" @reload="reload"></agentDetail>
      <labourDetail v-else-if="cateId === 1201"  ref="infoLabour" :infoDetail="infoDetail" :infoCate="infoCate" :parCate="parCate" @reload="reload"></labourDetail>
      <wxqunDetail v-else-if="cateId === 3305"  ref="infoWxqun" :infoDetail="infoDetail"></wxqunDetail>
      <normalDetail v-else ref="infoNormal" :infoDetail="infoDetail"></normalDetail>

      <uni-load-more :status="loadMoreStatus" :contentText="loadMoreContent"></uni-load-more>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { isuDetail, ljhdIsuInfo, isuReadCount } from '@/api/isuQuery'
import isuCate from '@/libs/isucate'

import normalDetail from './components/detail/normal-detail.vue'
import shfwDetail from './components/detail/shfw-detail.vue'
import labourDetail from './components/detail/labour-detail.vue'
import agentDetail from './components/detail/agent-detail.vue'
import wxqunDetail from './components/detail/wxqun-detail.vue'
import { isFunction } from '@vue/shared'

export default {
  name: 'info-detail',
  components: {
    normalDetail,
    shfwDetail,
    labourDetail,
    agentDetail,
    wxqunDetail
  },
  data() {
    return {
      cateId: null,
      mCateName: null,
      sCateName: null,
      comId: null,
      isuId: null,
      outTradeNo: null,

      infoCate: {}, // 信息类目
      parCate: {}, // 上级类目

      // 原信息
      infoDetail: {},
      isuInfoView: {},
      userInfo: {},
      commLive: {},

      // 信息附件图片
      imgUrls: [],

      loadMoreContent: {
        contentdown: '下拉显示更多',
        contentrefresh: '正在加载...',
        contentnomore: '--已经到底了--'
      },
      loadMoreStatus: 'no-more'
    }
  },
  onLoad(e) {
    const _that = this
    if (e.comId) {
      this.comId = Number(e.comId)
    }
    if (e.cateId) {
      this.cateId = Number(e.cateId)
    }
    if (e.isuId) {
      this.isuId = Number(e.isuId)
    }
    if (e.outTradeNo) {
      this.outTradeNo = e.outTradeNo
    }
  },
  onShow() {
    this.initData().then((r) => {})
  },
  onPullDownRefresh() {
    const _that = this
    _that.initData()
    setTimeout(() => {
      // 停止下拉刷新
      uni.stopPullDownRefresh()
    }, 1000)
  },
  onReachBottom() {
    const refs = this.$refs
    for (const key in refs) {
      if (key.startsWith('info')) {
        const detailVue = refs[key]
        if (detailVue && detailVue.reachBottom && isFunction(detailVue.reachBottom)) {
          detailVue.reachBottom()
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      sysInfo: 'app/sysInfo',
      localComm: 'app/localComm',
      uid: 'user/uid',
      locIsuPreUrl: 'app/locIsuPreUrl'
    })
  },
  created() {},
  mounted() {
    const _that = this
    setTimeout(function () {
      _that.readNumCount()
    }, 5000)
  },
  watch: {},
  methods: {
    initData() {
      const _that = this
      isuCate.getIsuCateById(this.cateId).then((r) => {
        _that.infoCate = r
        _that.sCateName = r.cateName
        if (r.parCateId && r.parCateId !== -1) {
          isuCate.getIsuCateById(r.parCateId).then((r1) => {
            _that.parCate = r1
            _that.mCateName = r1.cateName
          })
        }
      })

      const reqData = {
        cateId: this.cateId,
        comId: this.comId,
        isuId: this.isuId,
        outTradeNo: this.outTradeNo
      }
      return isuDetail(reqData).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          _that.infoDetail = _res
          /* const { userLiveInfo, ...isuInfo } = { ..._res }
          if (isuInfo) {
            _that.isuInfoView = isuInfo

            if (isNotEmpty(isuInfo.imgUrls)) {
              this.imgUrls = JSON.parse(isuInfo.imgUrls)
            }
          }
          if (userLiveInfo) {
            const { userInfo, commLive } = { ...userLiveInfo }
            _that.userInfo = userInfo
            _that.commLive = commLive
          } */
        }
      })
    },

    readNumCount() {
      const _that = this
      isuReadCount({
        cateId: this.cateId,
        isuId: this.isuId
      }).then((res) => {
        if (res.code === 0) {
          _that.isuInfoView.readCount = _that.isuInfoView.readCount + 1
        }
      })
    },

    reload() {
      this.initData()
    }
  }
}
</script>

<style lang="scss" scoped>
.info-detail-box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .body {
    flex: 1;
    height: calc(100% - 60rpx);
    overflow-x: hidden;
    overflow-y: hidden;
    margin-bottom: 60px;

    .audit-status {
      padding: 8rpx 12rpx;

      .audit-ing {
        .result {
          .desc {
            color: #e2ac49;
          }
        }
      }

      .audit-refuse {
        .result {
          .desc {
            color: #ec4542;
          }
        }

        .memo {
          .lab {
            &::after {
              content: ': ';
            }
          }

          .desc {
            color: #612bb6;
          }
        }
      }
    }
  }
}
</style>
