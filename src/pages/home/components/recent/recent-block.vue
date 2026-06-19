<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-10-18 11:34:27
* @LastEditors: wangxc
* @LastEditTime: 2024-10-18 11:34:27
-->
<template>
  <view class="recent-block-box section-box">
    <view class="sec-title">
      <view class="main-title">
        <view class="name">最新发布</view>
        <view hover-class="none" @click="goListPage()">
          <view class="more jhx_f6 myicon icon-xiangyou1-a">更多</view>
        </view>
      </view>
      <view class="intro">新鲜出炉，抢先参与</view>
    </view>
    <scrollXTabs :tabList="pubCates" nameProp="name" :activIdx="tabIdx" @tabChange="isuTabChg"></scrollXTabs>
    <view class="list">
      <template v-if="isuRecList.length && isuRecList.length > 0">
        <view v-for="(item, idx) in isuRecList" :key="idx">
          <recentItem :info="item"></recentItem>
        </view>
      </template>
      <view class="none" v-else>当前暂无信息</view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import scrollXTabs from '@/common/components/ScrollXTabs.vue'
import recentItem from './recent-item.vue'
import { isuRecentList } from '@/api/isuQuery'

export default {
  name: 'recent-block',
  components: {
    scrollXTabs,
    recentItem
  },
  data() {
    return {
      tabIdx: 0,

      pubCates: [
        {
          name: '邻里发布',
          val: 'comm',
          info: '本生活区发布'
        },
        {
          name: '周边社区',
          val: 'near',
          info: '周边生活区最新发布'
        },
        {
          name: '关注社区',
          val: 'care',
          info: '关注生活区最近发布'
        },
        {
          name: '同城信息',
          val: 'sameCity',
          info: '同一城市均可见的最新发布'
        }
      ],

      isuQuType: 'comm', // 最新发布信息类型
      isuRecList: [], // 最新发布列表
      listInterval: null
    }
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
    this.intervalList()
  },
  mounted() {},
  destroyed() {
    const _that = this
    if (_that.listInterval) {
      clearInterval(_that.listInterval)
    }
  },
  watch: {},
  methods: {
    /**
     * 最新发布标签页切换
     */
    isuTabChg(tbList, tb, activIdx) {
      const _that = this
      _that.tabIdx = activIdx
      _that.isuQuType = tb.val
      _that.reloadList()
    },

    /**
     * 查询最近发布信息
     */
    getIsuRecentList() {
      const _that = this
      if (_that.localComm && _that.localComm.comm && _that.localComm.comm.comId) {
        if (!_that.isuQuType) {
          _that.tabIdx = 0
        }
        const reqData = {
          cityCode: _that.localArea.city.distCode,
          comId: Number(_that.localComm.comm.comId),
          queryRange: _that.isuQuType || 'comm'
        }

        _that.isuRecList = []
        isuRecentList(reqData).then((res) => {
          if (res.code === 0) {
            const _res = res.data
            _that.isuRecList = [..._res]
          }
        })
      }
    },

    reloadList() {
      this.intervalList()
    },

    intervalList() {
      const _that = this
      if (_that.listInterval) {
        clearInterval(_that.listInterval)
      }
      // 设置间隔为3分钟
      _that.listInterval = setInterval(
        (function () {
          const fn = function () {
            _that.getIsuRecentList()
          }
          fn()
          return fn
        })(),
        1000 * 60 * 3
      )
    },

    /**
     * 跳转到信息列表页
     */
    goListPage() {
      const _that = this
      this.$Router.push({
        path: '/isuInfoList',
        query: { mCateId: _that.mCateId }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../common/scss/home-block.scss';

.recent-block-box {
}
</style>
