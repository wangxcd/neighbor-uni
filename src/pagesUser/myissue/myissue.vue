<!--
* @Description: 我的发布
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-09-29 12:23:00
* @LastEditors: wangxc
* @LastEditTime: 2024-09-29 12:23:00
-->
<template>
  <view class="myissue-box section-box">
    <view>
      <u-tabs :list="tabList" @change="chgTabs"></u-tabs>
    </view>
    <view class="list">
      <view class="item" v-for="item in isuList" :key="item.viewIsuId">
        <normalItem :info="item" :showStatus="curTab.tabLab" @refersh="refersh"></normalItem>
      </view>
    </view>
    <uni-load-more :status="loadMoreStatus" :contentText="loadMoreContent"></uni-load-more>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { isuMyList } from '@/api/isuQuery'
import normalItem from './items/normal-item.vue'

export default {
  name: 'myissue',
  components: {
    normalItem
  },
  data() {
    return {
      tabList: [
        {
          name: '显示中',
          tabLab: 'issue',
          isShow: true,
          val: 1
        },
        {
          name: '待审核',
          tabLab: 'audit',
          isShow: true,
          val: 2
        },
        {
          name: '已完成',
          tabLab: 'finish',
          isShow: true,
          val: 3
        },
        {
          name: '已下架',
          tabLab: 'pull',
          isShow: true,
          val: 4
        },
        {
          name: '已过期',
          tabLab: 'expire',
          isShow: true,
          val: 5
        },
        {
          name: '置顶',
          tabLab: 'top',
          isShow: true,
          val: 6
        }
      ],
      curTab: undefined,
      curIdx: 0,

      isuList: [],
      isuFullPageList: [],
      isuLastList: [],
      isuRelod: false,

      // 分页信息
      listPage: {
        sortNum: 0, // 当前页开始序号
        current: 1, // 当前位于哪页
        pageSize: 12, // 每页显示最多行数
        total: 0, // 总数
        pages: 0 // 总页数
      },

      loadMoreContent: {
        contentdown: '下拉显示更多',
        contentrefresh: '正在加载...',
        contentnomore: '没有更多数据了'
      },
      loadMoreStatus: 'more'
    }
  },
  onLoad(e) {
    console.log(e)
    const _that = this
    if (e.showIdx) {
      _that.curIdx = Number(e.showIdx)
    }
  },
  onShow(e) {
    console.log(e)
    if (!this.curTab) {
      this.curTab = this.tabList[0]
    }
    
    this.reloadList()
  },
  onPullDownRefresh() {
    const _that = this
    _that.reloadList()
    setTimeout(() => {
      // 停止下拉刷新
      uni.stopPullDownRefresh()
    }, 1000)
  },
  onReachBottom(e) {
    this.getList()
  },
  computed: {
    ...mapGetters({
      sysInfo: 'app/sysInfo',
      localArea: 'app/localArea',
      uid: 'user/uid'
    })
  },
  created() {},
  mounted() {
  },
  watch: {},
  methods: {
    // 显示标签
    showTab(idx) {
      const _that = this
      if (idx && idx >= 0 && idx < _that.tabList.length) {
        _that.chgTabs(_that.tabList[idx])
      }
    },

    chgTabs(e) {
      this.curTab = e
      this.reloadList()
    },

    getList() {
      const _that = this
      _that.loadMoreStatus = 'loading'
      const params = {
        current: _that.listPage.current,
        size: _that.listPage.pageSize
      }

      const reqData = {
        cityCode: _that.localArea.city.distCode,
        showStatus: _that.curTab.val
      }

      isuMyList(params, reqData).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          _that.isuRelod = false
          if (_res.records.length > 0) {
            const dataList = _res.records.map((item) => {
              return item
            })
            _that.listPage.total = Number(_res.total)
            _that.listPage.pages = Number(_res.pages)

            if (dataList.length < _res.size) {
              _that.isuLastList = dataList
            } else {
              _that.isuLastList = []
              _that.isuFullPageList.push(...dataList)
              _that.listPage.current = Number(_res.current) + 1
            }

            _that.isuList = [..._that.isuFullPageList, ..._that.isuLastList]
            _that.loadMoreStatus = 'more'
          } else {
            _that.loadMoreStatus = 'no-more'
          }
        }
      })
    },

    reloadList() {
      this.isuList = []
      this.isuFullPageList = []
      this.isuLastList = []
      this.listPage.current = 1
      this.listPage.total = 0
      this.listPage.pages = 0
      this.isuRelod = true

      this.getList()
    },

    refersh() {
      this.reloadList()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../common/scss/home-block.scss';

.myissue-box {
}
</style>
