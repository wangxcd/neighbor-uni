<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-09-29 15:55:04
* @LastEditors: wangxc
* @LastEditTime: 2024-09-29 15:55:04
-->
<template>
  <view class="agent-block-box section-box">
    <view class="sec-title">
      <view class="main-title">
        <view class="name">打赏跑腿</view>
        <view hover-class="none" @click="goListPage()">
          <view class="more jhx_f6 myicon icon-xiangyou1-a">更多</view>
        </view>
      </view>
      <view class="intro">不方便、懒的动、不在家...，找他人代办</view>
    </view>
    <scrollXTabs :tabList="comTypeList" nameProp="name" :activIdx="tabIdx" @tabChange="isuTabChg"></scrollXTabs>
    <view class="list">
      <template v-if="isuinfoList.length > 0">
        <view v-for="(item, idx) in isuinfoList" :key="idx">
          <agentItem :info="item"></agentItem>
        </view>
      </template>
      <view class="none" v-else>当前暂无打赏信息</view>
      <!-- 
          <swiper
            :autoplay="false"
            interval="3000"
            duration="3000"
            easing-function="linear"
            :circular="false"
            :acceleration="true"
            :vertical="true"
            :display-multiple-items="3"
            class="commodity-swiper">
            <swiper-item v-for="(item, idx) in 9" :key="idx">
              <agentItem></agentItem>
            </swiper-item>
          </swiper>
          -->
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { isuPageList } from '@/api/isuQuery'
import scrollXTabs from '@/common/components/ScrollXTabs.vue'
import agentItem from './agent-item.vue'

export default {
  name: 'agent-block',
  components: {
    scrollXTabs,
    agentItem
  },
  data() {
    return {
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

      mCateId: 13,
      mCateName: 'dspt',

      isuQuType: 'comm', // 最新发布信息类型
      isuinfoList: [],
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
  updated() {},
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

    getList() {
      const _that = this
      // 当前未指定社区
      if (!_that.localComm.comm) {
        return false
      }

      const params = {
        current: 1,
        size: 6
      }
      const reqData = {
        cateId: _that.mCateId,
        cateName: _that.mCateName,
        cityCode: _that.localArea.city.distCode,
        comId: _that.localComm.comm.comId,
        queryRange: _that.isuQuType || 'comm'
      }

      return isuPageList(params, reqData).then((res) => {
        _that.isuinfoList.splice(0, _that.isuinfoList.length)
        if (res.code === 0) {
          const _res = res.data
          if (_res.records.length > 0) {
            const dataList = _res.records.map((item) => {
              return item
            })

            _that.$set(_that, 'isuinfoList', dataList)
          }
        }
      })
    },

    reloadList() {
      this.intervalList()
    },

    intervalList() {
      const _that = this
      if (_that.listInterval) {
        clearInterval(_that.listInterval)
      }
      // 设置间隔为2分钟
      _that.listInterval = setInterval(
        (function () {
          const fn = function () {
            _that.getList()
          }
          fn()
          return fn
        })(),
        1000 * 60
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
</style>
