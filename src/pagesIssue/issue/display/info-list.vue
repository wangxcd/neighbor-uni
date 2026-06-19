<!--
* @Description: 信息列表统一入口页面
*  具体展示样式由组件确定
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-06-28 08:31:35
* @LastEditors: wangxc
* @LastEditTime: 2024-06-28 08:31:35
-->
<template>
  <view class="info-list-box section-box" :style="{ 'min-height': sysInfo.pageHeight + 'px', 'padding-top': `${sysInfo.statusBarHeight + 48}px` }">
    <u-navbar
      height="44"
      :fixed="true"
      leftText="返回"
      :autoBack="false"
      :title="`列表-${parCate.cateTitle}`"
      titleStyle="font-size: 15px;"
      bgColor="#0AB27D"
      :border="true"
      @leftClick="goHomePage"></u-navbar>
    <!-- 类目切换栏 -->
    <view class="cate-bar sec-title">
      <view class="main-title">
        <view class="cate-title flex">
          <view class="title">当前类目</view>
          <view class="cate">
            <picker :value="preMCateIdx" :range="pCateTag.cateList" range-key="cateTitle" @change="cateChg" @cancel="celCateChg">
              <view class="picker">
                <text class="cuIcon-unfold margin-left-xs">{{ pCateTag.cateList[preMCateIdx].cateTitle }}</text>
                <text class="myicon icon-xiangxia2"></text>
              </view>
            </picker>
          </view>
        </view>
      </view>
    </view>
    <view>
      <u-tabs :list="comTypeList" @change="chgComType"></u-tabs>
    </view>
    <!-- 子类目标签 -->
    <view class="scroll-x-tabs">
      <scrollXTabs :tabList="subCateList" nameProp="name" @tabChange="subCateTabChg"></scrollXTabs>
    </view>
    <!-- 信息列表栏 -->
    <view class="list">
      <view class="item" v-for="item in isuinfoList" :key="item.viewIsuId">
        <interactItem v-if="parCate.cateName === 'ljhd'" :rectRpxWidth="contentRpxWidth" :interact="item"></interactItem>
        <shfwItem v-else-if="parCate.cateName === 'shfw' || parCate.cateName === 'jhqx'" :rectRpxWidth="contentRpxWidth" :mCateName="parCate.cateName" :info="item"></shfwItem>
        <agentItem v-else-if="parCate.cateName === 'dspt'" :rectRpxWidth="contentRpxWidth" :mCateName="parCate.cateName" :info="item"></agentItem>
        <labourItem v-else-if="item.cateId === 1201" :rectRpxWidth="contentRpxWidth" mCateName="zlsbs" :info="item"></labourItem>
        <wxqunItem v-else-if="item.cateId === 3305" :rectRpxWidth="contentRpxWidth" mCateName="wxq" :info="item"></wxqunItem>
        <normalItem v-else :rectRpxWidth="contentRpxWidth" :cateName="parCate.cateName" :info="item"></normalItem>
      </view>
    </view>
    <uni-load-more :status="loadMoreStatus" :contentText="loadMoreContent"></uni-load-more>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { getIsuCateViews } from '@/api/isuqu'
import { isuPageList, isuReadCount } from '@/api/isuQuery'
import isuCate from '@/libs/isucate'

import normalItem from './components/item/normal-item.vue'
import shfwItem from './components/item/shfw-item.vue'
import labourItem from './components/item/labour-item.vue'
import agentItem from './components/item/agent-item.vue'
import wxqunItem from './components/item/wxqun-item.vue'
import interactItem from '@/common/components/interact/interact-item.vue'

export default {
  name: 'info-list',
  components: {
    normalItem,
    shfwItem,
    labourItem,
    agentItem,
    wxqunItem,
    interactItem
  },
  data() {
    const sysInfo = this.$store.getters.sysInfo
    const rectPxWidth = sysInfo.screenWidth - 20

    return {
      contentRpxWidth: rectPxWidth * sysInfo.rpxPxRatio, // content部分的宽度值(rpx单位)

      mCateId: null,

      parCate: {},
      comId: null,

      preMCateIdx: 0,

      // 类目切换
      pCateTag: {
        show: false,
        cateList: [],
        cateMap: {}
      },

      subCateList: [],

      comTypeList: [
        {
          name: '邻里发布',
          val: 'comm',
          info: '本生活区发布'
        },
        {
          name: '周边社区',
          val: 'near',
          info: '周边生活区最新发布'
        }
      ],
      comTypeIdx: 0,
      isuQuType: 'comm',

      // 信息评论
      isuinfoList: [],
      fullPageList: [],
      lastList: [],

      // 分页信息
      page: {
        sortNum: 0, // 当前页开始序号
        current: 1, // 当前位于哪页
        pageSize: 12, // 每页显示最多行数
        total: 0, // 总数
        pages: 0 // 总页数
      },

      loadMoreContent: {
        contentdown: '下拉显示更多',
        contentrefresh: '正在加载...',
        contentnomore: '没有更多了'
      },
      loadMoreStatus: 'more'
    }
  },
  onLoad(e) {
    if (e.mCateId) {
      this.mCateId = Number(e.mCateId)
    }
  },
  onShow() {
    if (this.pCateTag.cateList.length > 0) {
      this.getList()
    }
  },
  onPullDownRefresh() {
    const _that = this
    _that.initData()
    setTimeout(() => {
      // 停止下拉刷新
      uni.stopPullDownRefresh()
    }, 2000)
  },
  onReachBottom() {
    // 加载更多
    this.getList()
  },
  computed: {
    ...mapGetters({
      sysInfo: 'app/sysInfo',
      localArea: 'app/localArea',
      localComm: 'app/localComm',
      uid: 'user/uid'
    })
  },
  created() {
    const _that = this
    this.initData().then(() => {
      _that.getList()
    })
  },
  watch: {},
  methods: {
    initData() {
      const _that = this

      // 一级类目
      return getIsuCateViews().then((res) => {
        if (res.code === 0) {
          const _res = res.data
          _that.pCateTag.cateList = _res
          return
        }
      })
    },

    cateChg(e) {
      this.pCateTag.show = false
      const idx = Number(e.detail.value)
      const cates = this.pCateTag.cateList
      const tagCate = cates[idx]
      this.mCateId = tagCate.cateId
      if (this.mCateId !== cates[this.preMCateIdx].cateId) {
        this.reloadList()
      }
    },

    celCateChg() {
      this.pCateTag.show = false
    },

    subCateTabChg() {},

    chgComType(e) {
      const _that = this
      _that.comTypeIdx = e.index
      _that.isuQuType = e.val
      _that.reloadList()
    },

    getList() {
      const _that = this
      _that.loadMoreStatus = 'loading'

      let idx = _that.pCateTag.cateList.findIndex((item) => item.cateId === _that.mCateId)
      if (idx === -1) {
        idx = 0
      }

      const mCate = _that.pCateTag.cateList[idx]
      _that.preMCateIdx = idx
      _that.parCate = mCate

      const params = {
        current: _that.page.current,
        size: _that.page.pageSize
      }
      const reqData = {
        cateId: mCate.cateId,
        cateName: mCate.cateName,
        cityCode: _that.localArea.city.distCode,
        comId: _that.localComm.comm.comId,
        queryRange: _that.isuQuType || 'comm'
      }

      return isuPageList(params, reqData).then((res) => {
        _that.isuinfoList = []
        if (res.code === 0) {
          const _res = res.data
          if (_res.records.length > 0) {
            const dataList = _res.records.map((item) => {
              return item
            })

            _that.page.total = Number(_res.total)
            _that.page.pages = Number(_res.pages)

            if (dataList.length < _res.size) {
              _that.lastList = dataList
              _that.loadMoreStatus = 'no-more'
            } else {
              _that.lastList = []
              _that.fullPageList.push(...dataList)
              _that.page.current = Number(_res.current) + 1
              _that.loadMoreStatus = 'more'
            }

            _that.isuinfoList = [..._that.fullPageList, ..._that.lastList]
          } else {
            _that.loadMoreStatus = 'no-more'
          }

          if (_that.isuinfoList.length === 0) {
            _that.loadMoreContent.contentnomore = '--该类目暂无信息--'
          } else {
            _that.loadMoreContent.contentnomore = '--没有更多了--'
          }
        }
      })
    },

    reloadList() {
      this.fullPageList = []
      this.lastList = []
      this.isuinfoList = []
      this.page.current = 1
      this.page.total = 0
      this.page.pages = 0
      this.getList()
    },

    goHomePage() {
      this.$Router.replaceAll({
        path: '/home'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.info-list-box {
  .cate-bar {
    .main-title {
      .cate-title {
        margin-left: 20rpx;
        height: 60rpx;
        line-height: 60rpx;
        font-size: 14px;

        .title {
          &::after {
            content: ':';
          }
        }

        .cate {
          margin: 0 20rpx;
        }
      }
    }
  }
  .sec-title {
  }
  .scroll-x-tabs {
  }

  .list {
    .item {
      margin: 20rpx 0;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
