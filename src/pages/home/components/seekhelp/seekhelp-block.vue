<!--
* @Description: 首页-求助找帮手块
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-08-24 06:48:35
* @LastEditors: wangxc
* @LastEditTime: 2024-08-24 06:48:35
-->
<template>
  <view class="seekhelp-block-box section-box">
    <view class="sec-title">
      <view class="main-title">
        <view class="name">求助/找帮手</view>
        <view hover-class="none" @click="goListPage({ cateId: 12, cateName: 'qzjy' })">
          <view class="more jhx_f6 myicon icon-xiangyou1-a">更多</view>
        </view>
      </view>
      <view class="intro">临时有活，找帮手(工)、找日结工、助力完成</view>
    </view>
    <scrollXTabs :tabList="pubCates" nameProp="name" :activIdx="tabIdx" @tabChange="isuTabChg"></scrollXTabs>
    <view class="list">
      <template v-if="isuinfoList.length && isuinfoList.length > 0">
        <view v-for="(item, idx) in isuinfoList" :key="idx">
          <seekhelpZlsbs v-if="item.cateId === 1201" :info="item"></seekhelpZlsbs>
          <recentItem v-else :info="item"></recentItem>
        </view>
      </template>
      <view class="none" v-else>当前暂无求助信息</view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { isuPageList } from '@/api/isuQuery'
import scrollXTabs from '@/common/components/ScrollXTabs.vue'
import seekhelpZlsbs from './seekhelp-zlsbs-item.vue'
import recentItem from '../recent/recent-item.vue'

export default {
  name: 'seekhelp-block',
  components: {
    scrollXTabs,
    seekhelpZlsbs,
    recentItem
  },
  data() {
    return {
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
        }
      ],

      mCateId: 12,
      mCateName: 'qzjy',

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
        size: 10
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
      // 设置间隔为1分钟
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
    goListPage(cate) {
      this.$Router.push({
        path: '/isuInfoList',
        query: { mCateId: cate.cateId }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../common/scss/home-block.scss';
</style>
