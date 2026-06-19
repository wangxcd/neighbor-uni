<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2025-12-15 13:53:52
* @LastEditors: wangxc
* @LastEditTime: 2025-12-15 13:53:52
-->
<template>
  <view class="myjoin-box section-box">
    <view class="list">
      <view class="item" v-for="item in isuList" :key="item.viewIsuId">
        <joinIsuItem :info="item" :showStatus="curTab.tabLab"></joinIsuItem>
      </view>
    </view>
    <uni-load-more :status="loadMoreStatus" :contentText="loadMoreContent"></uni-load-more>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { isuMyJoinList } from '@/api/isuQuery'
import joinIsuItem from './items/join-isu-item.vue'

export default {
  name:'myjoin',
  components: {
    joinIsuItem
  },
  data(){
    return {
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
  },
  onShow(e) {
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
  created() {
  },
  mounted() {
  },
  watch: {
  },
  methods: {
    getList() {
      const _that = this
      _that.loadMoreStatus = 'loading'
      const params = {
        current: _that.listPage.current,
        size: _that.listPage.pageSize
      }

      const reqData = {
        cityCode: _that.localArea.city.distCode,
        uid: _that.uid
      }

      isuMyJoinList(params, reqData).then((res) => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../common/scss/home-block.scss';

  .myjoin-box {
  }
</style>
