<!--
* @Description: 小店铺主页面
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-24 23:10:38
* @LastEditors: wangxc
* @LastEditTime: 2024-04-24 23:10:38
-->
<template>
  <view class="info-list-box section-box" :style="{ 'min-height': sysInfo.pageHeight + 'px', 'padding-top': `${sysInfo.statusBarHeight + 48}px` }">
    <u-navbar
      height="44"
      :fixed="true"
      leftText="返回"
      :autoBack="false"
      title="社区小店/工作室"
      titleStyle="font-size: 15px;"
      bgColor="#0AB27D"
      :border="true"
      @leftClick="goHomePage"></u-navbar>
    <view class="content">
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
          <sqkdItem :rectRpxWidth="contentRpxWidth" :info="item"></sqkdItem>
        </view>
      </view>
      
      <uni-load-more :status="loadMoreStatus" :contentText="loadMoreContent"></uni-load-more>

      <view style="top: 100rpx;">
        <uni-fab ref="fab" :pattern="pattern" :content="openContent" horizontal="right" vertical="top"
          :popMenu="true" direction="vertical" @trigger="gotoOpenStore" />
      </view>
    </view>

    <view :style="{ height: `${config.bottomBarHeight}px` }">
      <BottomBar v-model="barIndex" :barlists="barlists" />
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { sqkdList } from '@/api/isuQuery'
import { getIsuCateLevsByPar } from '@/api/isuqu'
import { isuPreFormCheck } from '@/api/isuForm'

import sqkdItem from '@/pagesStore/components/sqkd-item.vue'

export default {
  name:'index',
  components: {
    sqkdItem
  },
  data(){
    const sysInfo = this.$store.getters.sysInfo
    const rectPxWidth = sysInfo.screenWidth - 20

    return {
      barIndex: 2,
      config: this.$config,

      contentRpxWidth: rectPxWidth * sysInfo.rpxPxRatio, // content部分的宽度值(rpx单位)
      comId: null,

      mecrCate: {},
      subCateList: [],
      comTypeList: [
        {
          name: '当前社区',
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
      loadMoreStatus: 'more',

      pattern: {
        buttonColor: '#c93763'
      },

      openContent: [{
          iconPath: 'https://mmecoa.qpic.cn/sz_mmecoa_png/IeCoiaHh7icxTBAlW6r6FcRoD4We37ghQkib8mBl1OROZqxYSicLgT9EJlhoQ4NRiaEqgVDFo4dYCbGE2k4odKRUNXw/640?wx_fmt=png&amp;from=appmsg',
          selectedIconPath: 'https://mmecoa.qpic.cn/sz_mmecoa_png/IeCoiaHh7icxTBAlW6r6FcRoD4We37ghQkib8mBl1OROZqxYSicLgT9EJlhoQ4NRiaEqgVDFo4dYCbGE2k4odKRUNXw/640?wx_fmt=png&amp;from=appmsg',
          text: '开设小店',
          active: false
        },
        {
          iconPath: 'https://mmecoa.qpic.cn/sz_mmecoa_png/IeCoiaHh7icxTBAlW6r6FcRoD4We37ghQk910kib23NL4dgKBdxlO3QhCx7X3RSNGHDMCdStYfvZrOSO81zTGH0wA/640?wx_fmt=png&amp;from=appmsg',
          selectedIconPath: 'https://mmecoa.qpic.cn/sz_mmecoa_png/IeCoiaHh7icxTBAlW6r6FcRoD4We37ghQk910kib23NL4dgKBdxlO3QhCx7X3RSNGHDMCdStYfvZrOSO81zTGH0wA/640?wx_fmt=png&amp;from=appmsg',
          text: '开工作室',
          active: false
        }
      ]
    }
  },
  onLoad(e) {
    console.log(e)
  },
  onShow(e) {
    this.getList()
  },
  onPullDownRefresh() {
    const _that = this
    _that.initData()
    setTimeout(() => {
      // 停止下拉刷新
      uni.stopPullDownRefresh()
    }, 2000)
  },
  onReachBottom(e) {
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
    this.initData()
  },
  mounted() {
  },
  watch: {
  },
  methods: {
    initData() {
      const _that = this
      getIsuCateLevsByPar('sjkd').then((res) => {
      if (res.code === 0) {
        const _res = res.data
        _that.mecrCate = _res
      }
    })
    },

    chgComType(e) {
      const _that = this
      _that.comTypeIdx = e.index
      _that.isuQuType = e.val
      _that.reloadList()
    },

    getList() {
      const _that = this
      _that.loadMoreStatus = 'loading'

      const params = {
        current: _that.page.current,
        size: _that.page.pageSize
      }
      const reqData = {
        cityCode: _that.localArea.city.distCode,
        comId: _that.localComm.comm.comId,
        queryRange: _that.isuQuType || 'comm'
      }

      return sqkdList(params, reqData).then((res) => {
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
            if (_that.comTypeIdx === 0) {
              _that.loadMoreContent.contentnomore = '--欢迎开办小区首家小店/工作室--'
            } else {
              // 周边社区
              _that.loadMoreContent.contentnomore = '--周边社区还没有小店/工作室--'
            }
            
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
    },

    gotoOpenStore(e) {
      const cIdx = e.index
      this.gotoIsuForm(cIdx)
    },

    // 跳转到发布表单页
    gotoIsuForm(cIdx) {
      const _that = this
      const childList = _that.mecrCate.childList
      if (childList && childList.length) {
        const subCate = childList[cIdx]
        if (subCate) {
          const checkReq = {
            uid: _that.uid,
            cateId: subCate.cateId
          }
          isuPreFormCheck(checkReq).then((res) => {
            if (res.code === 0) {
              const _res = res.data
              if (!_res || _res.length === 0) {
                _that.$Router.push({ 
                  path: subCate.isuPagePath, 
                  query: { 
                    sCateId: subCate.cateId, 
                    mCateName: '社区开店', 
                    sCateName: subCate.cateName, 
                    editType: 'new' 
                  } 
                })
              } else {
                // 错误提示
                let errors = ''
                _res.forEach((el) => {
                  errors += el.checkRetMsg
                  errors += '<br>'
                })

                _that.preCheck.show = true
                _that.preCheck.errors = errors
              }
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .info-list-box {
    .content {
    }
  }
</style>
