<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-08 07:42:42
* @LastEditors: wangxc
* @LastEditTime: 2024-04-08 07:42:42
-->
<template>
  <view class="home-box">
    <view class="page-header" :style="{ position: 'fixed', height: `${headerHeight}px` }">
      <headerH5 />
      <headerMp @headerHeight="getPageHeaderHeight" />
    </view>
    <!-- 首页展示 -->
    <view class="page_content" :style="{ padding: `${headerHeight}px 10px 65px 10px` }">
      <view class="mp-bg"></view>
      <!-- banner -->
      <view class="banner" v-if="banner.advertList.length">
        <swiper
          :indicator-dots="banner.indicatorDots"
          :autoplay="banner.autoplay"
          :circular="banner.circular"
          :interval="banner.interval"
          :duration="banner.duration"
          indicator-color="rgba(255,255,255,0.6)"
          indicator-active-color="#fff">
          <block v-for="(item, index) in banner.advertList" :key="index">
            <swiper-item>
              <navigator :url="item.pageInLink || item.pageOutLink" class="slide-navigator acea-row row-between-wrapper" hover-class="none">
                <image :src="item.imgUrl" class="slide-image" lazy-load></image>
              </navigator>
            </swiper-item>
          </block>
        </swiper>
      </view>
      <view v-else style="margin-top: 20rpx"></view>

      <!--紧急服务与求助-->
      <view class="urgent-box">
        <view class="urgent-cell" @click="goListPage({ cateId: 11, cateName: 'jhqx' })">
          <view class="summ" url="item.url" hover-class="none">
            <view class="urgent-item serv-bg">
              <view class="title">医护/救援/抢修</view>
              <view class="content">医(救)护/开锁/疏通/维修</view>
            </view>
          </view>
        </view>
        <view class="urgent-cell" @click="goListPage({ cateId: 12, cateName: 'qzjy' })">
          <view class="summ" :url="item.url" hover-class="none">
            <view class="urgent-item help-bg">
              <view class="title">紧急求助/临时求援</view>
              <view class="content">找帮手/借工具 求答疑/救助</view>
            </view>
          </view>
        </view>
      </view>

      <!-- 通知公告 -->
      <view class="notice acea-row row-middle row-between" v-if="notices.length">
        <view class="pic">
          <image src="/static/images/logo/notice.png"></image>
        </view>
        <text class="line">|</text>
        <view class="swipers">
          <swiper :indicator-dots="indicatorDots" :autoplay="notice.autoplay" interval="3000" duration="500" vertical="true" circular="true">
            <block v-for="(item) in notices" :key="item.id">
              <swiper-item>
                <navigator class="item" :url="`/pagesCommon/article/index?articleId=${item.id}`" hover-class="none">
                  <view class="line1">{{ item.title }}</view>
                </navigator>
              </swiper-item>
            </block>
          </swiper>
        </view>
        <view class="iconfont icon-xiangyou jhx_f6"></view>
      </view>

      <!-- menu -->
      <view class="menu acea-row" v-if="cateMenus.length">
        <block v-for="(item, index) in cateMenus" :key="index">
          <view class="item" v-if="item.isShow === 1" @click="goListPage(item)">
            <view class="pictrue">
              <image :src="item.iconUrl"></image>
            </view>
            <view class="menu-txt">{{ item.cateTitle }}</view>
          </view>
        </block>
      </view>

      <!-- 政府/物业公告(弹出窗口)-->
      <view class="section-box" v-if="zfwyInfoList.length > 0">
        <u-popup :show="zfwyPopShow" mode="center" round="10" :closeable="true" @close="zfwyClose">
          <view class="zfwy-body">
            <view class="zfwy-title">{{ zfwyInfoList[zfwyCurIdx].title }}</view>
            <view class="zfwy-text">
              <text>{{ zfwyInfoList[zfwyCurIdx].content }}</text>
            </view>
            <view class="signature">
              <view v-if="zfwyInfoList[zfwyCurIdx].contactMan" class="sign-text">{{ zfwyInfoList[zfwyCurIdx].contactMan }}</view>
              <view v-if="zfwyInfoList[zfwyCurIdx].phone" class="sign-text">电话: {{ zfwyInfoList[zfwyCurIdx].phone }}</view>
              <view class="sign-text">{{ zfwyInfoList[zfwyCurIdx].hitsDate }}</view>
            </view>
          </view>
        </u-popup>
      </view>

      <!--求助/求援-->
      <view class="section-box">
        <seekhelpBlock ref="seekhelpRef"></seekhelpBlock>
      </view>

      <!--打赏跑腿-->
      <view class="section-box">
        <agentBlock ref="agentRef"></agentBlock>
      </view>

      <!--热门商家-->
      <view class="section-box" v-if="false">
        <view class="sec-title">
          <view class="main-title">
            <view class="name">品质商家</view>
            <navigator hover-class="none" url="/pages/lazy/nav/index">
              <view class="more jhx_f6 myicon icon-xiangyou1-a">更多商家</view>
            </navigator>
          </view>
        </view>
        <scroll-view scroll-x="true" style="width: 100%">
          <view class="list flex start">
            <navigator url="/pages/goods/goods" v-for="(el, idx) in [1, 2, 3, 4, 5]" :key="idx">
              <view class="item merch">
                <view class="merch-img">
                  <text class="pictrue_log pictrue_log_class">热</text>
                  <image src="/static/default.jpg" mode="aspectFill"></image>
                </view>
                <view class="merch-title">
                  <view class="tit-txt line1">联系客服展示</view>
                </view>
              </view>
            </navigator>
          </view>
        </scroll-view>
      </view>

      <!--最新发布-->
      <view class="section-box">
        <recentBlock ref="recentRef"></recentBlock>
      </view>

      <!--邻里互动-->
      <view class="interact section-box">
        <view class="sec-title">
          <view class="main-title">
            <view class="name">邻里互动</view>
            <view hover-class="none" @click="goListPage({ cateId: 20, cateName: 'ljhd' })">
              <view class="more jhx_f6 myicon icon-xiangyou1-a">更多</view>
            </view>
          </view>
          <view class="intro">邻居之间闲聊、吐槽、八卦、抒情、解闷</view>
        </view>

        <view class="scroll-x-tabs">
          <scrollXTabs :tabList="tucaoCates" nameProp="name" @tabChange="ljhdTabChg"></scrollXTabs>
          <view class="opera">
            <view class="last-reply myicon icon-pinglun" title="互动消息"></view>
            <view class="refresh myicon icon-shuaxin" :class="{ ljhdrefersh: ljhdRelod }" title="刷新" @click="reloadLjhd"></view>
          </view>
        </view>
        <view class="list">
          <view class="item" v-for="cItem in ljhdList" :key="cItem.viewIsuId">
            <interactItem :rectRpxWidth="contentRpxWidth" :interact="cItem"></interactItem>
          </view>
          <!-- 
          <view class="item">
            <interactItem :rectRpxWidth="contentRpxWidth"></interactItem>
          </view>
          -->
        </view>
      </view>

      <uni-load-more :status="loadMoreStatus" :contentText="loadMoreContent"></uni-load-more>
    </view>

    <view class="page-bottom" :style="{ height: `${bottomBarHeight}px` }">
      <BottomBar v-model="barIndex" :barlists="barlists" />
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

import isuCate from '@/libs/isucate'

import { getHomeIndex } from '@/api/homePage'
import { getSysAdvert, getCommAdvert } from '@/api/isuqu'
import { ljhdPageInfo, zfwyList } from '@/api/isuQuery'
import { getUserCommRole } from '@/api/userComm'

import headerH5 from '../components/header-h5.vue'
import headerMp from '../components/header-mp.vue'

import seekhelpBlock from '../components/seekhelp/seekhelp-block.vue'
import agentBlock from '../components/agent/agent-block.vue'
import recentBlock from '../components/recent/recent-block.vue'
import interactItem from '@/common/components/interact/interact-item.vue'
import scrollXTabs from '@/common/components/ScrollXTabs.vue'
import config from '@/config/config'

const app = getApp()

export default {
  name: 'home',
  components: {
    headerH5,
    headerMp,
    interactItem,
    seekhelpBlock,
    agentBlock,
    recentBlock,
    scrollXTabs
  },
  data() {
    const sysInfo = this.$store.getters.sysInfo
    const rectPxWidth = sysInfo.screenWidth - 20

    return {
      barIndex: 1,
      bottomBarHeight: config.bottomBarHeight,
      headerHeight: 118,
      contentRpxWidth: rectPxWidth * sysInfo.rpxPxRatio, // content部分的宽度值(rpx单位)
      bodyHeight: 600,

      banner: {
        indicatorDots: false,
        circular: true,
        autoplay: true,
        interval: 5000,
        duration: 500,
        advertList: []
      },

      cateMenus: [],
      notice: {
        autoplay: true
      },
      notices: [],

      cateIdx: 0,

      helpShow: false, // 求助块是否显示

      zfwyInfoList: [], // 政府物业信息
      zfwyCurIdx: 0, // 当前显示第idx条政府物业通告
      zfwyPopShow: false,

      ljhdRelod: false,
      tucaoCates: [
        {
          name: '最新',
          val: 1
        },
        {
          name: '热门',
          val: 2
        }
      ],
      tucaoIdx: 0,
      ljhdQuType: 1, // 邻间互动列表类型
      ljhdList: [], // 邻间互动列表
      ljhdFullPageList: [],
      ljhdLastList: [],
      // 邻间互动分页信息
      ljhdPage: {
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
  },
  onShow: function () {
    const _that = this
    _that.loadLiveComm()
    _that.$refs.seekhelpRef.reloadList()
    _that.$refs.agentRef.reloadList()
    _that.$refs.recentRef.reloadList()
    _that.reloadLjhd()
  },
  onPullDownRefresh() {
    const _that = this
    _that.banner.advertList = []
    if (this.localComm && this.localComm.comm && this.localComm.comm.comId) {
      _that.loadPageCommData()
      //this.ljhdList = []
      //this.ljhdPage.current = 1
      //this.ljhdPage.total = 0
      //this.ljhdPage.pages = 0
    }
    setTimeout(() => {
        // 停止下拉刷新
        uni.stopPullDownRefresh()
    }, 1000)
  },
  /**
   * 用户点击右上角分享
   */
  // #ifdef MP
  onShareAppMessage: function () {
    let path = '/pages/index/index'
    const params = {}
    if (this.isLogin && this.uid) {
      params.spid = this.uid
    }

    if (this.localArea) {
      if (this.localArea.city) {
        params.cityCode = this.localArea.city.distCode
      }
      if (this.localArea.ad) {
        params.adCode = this.localArea.ad.distCode
      }
    }

    if (this.localComm && this.localComm.comm) {
      params.comId = this.localComm.comm.comId
    }
    path += `?${this.$util.serialize(params)}`

    return {
      title: this.$config.webConfig.fullTitle,
      imageUrl: this.$config.webConfig.img || '',
      desc: this.localComm.comm.title,
      path: path
    }
  },

  /**
   * 用户点击右上角分享到朋友圈
   */
  onShareTimeline() {
    const params = {}
    if (this.isLogin && this.uid) {
      params.spid = this.uid
    }

    if (this.localArea) {
      if (this.localArea.city) {
        params.cityCode = this.localArea.city.distCode
      }
      if (this.localArea.ad) {
        params.adCode = this.localArea.ad.distCode
      }
    }

    if (this.localComm && this.localComm.comm) {
      params.comId = this.localComm.comm.comId
    }

    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: '你居吾邻&社圈微生活'
        })
      }, 2000)
    })
    return {
      title: '你居吾邻&社圈微生活',
      query: this.$util.serialize(params),
      promise
    }
  },

  // #endif
  onReachBottom() {
    // 首页-邻里互动加载更多
    if (this.localComm && this.localComm.comm && this.localComm.comm.comId) {
      this.getLjhdList()
    }
  },
  computed: {
    ...mapGetters({
      sysInfo: 'app/sysInfo',
      localArea: 'app/localArea',
      localComm: 'app/localComm',
      isLogin: 'user/isLogin',
      uid: 'user/uid'
    })
  },
  beforeCreate() {
    const localArea = this.localArea

    if (!localArea || !localArea.city || !localArea.cityServer) {
      this.$Router.replace({ name: 'index', params: { lineIdx: 1 } })
      return false
    }
  },
  created() {
    this.initData()
  },
  watch: {
    localComm: {
      handler: function (newVal, oldVal) {
        if (newVal && newVal.comm && newVal.comm.comId) {
          this.loadPageCommData()
        }
      },
      deep: true
    }
  },
  methods: {
    // 初始化页面数据
    initData() {
      console.log(this.localArea)
      const _that = this
      getHomeIndex().then((res) => {
        if (res.code === 0) {
          const _res = res.data
          _that.cateMenus = _res.categorys.map((item) => {
            item.iconUrl = _that.$config.HTTP_REQUEST_URL + '/api/pcom/' + item.iconUrl
            return item
          })

          _that.notices = _res.noticeList
        }
      })

      if (this.localComm && this.localComm.comm && this.localComm.comm.comId) {
        this.loadPageCommData()
      }
    },

    getPageHeaderHeight(headerH) {
      this.headerHeight = headerH
      this.bodyHeight = this.sysInfo.screenHeight - this.headerHeight - this.bottomBarHeight
    },
    onCate(a, b) {
      this.cateIdx = b
    },
    onTouTio(o, i) {
      this.tucaoIdx = i
    },
    scroll() {},

    /**
     * 加载社区信息
     */
    loadLiveComm() {
      const _that = this
      const localArea = this.localArea
      const localComm = this.localComm

      if (!localArea || !localArea.city || !localArea.cityServer) {
        // 跳转到城市选择页
        setTimeout(() => {
          // _that.$Router.push({ name: 'cityPick', params: { lineIdx: 1 } })
          this.$Router.replace({ name: 'index', params: { lineIdx: 1 } })
        }, 500)
      } else {
        if (!localComm || !localComm.comm || !localComm.comm.comId) {
          // 跳转到住宅区/社区选择页
          setTimeout(() => {
            _that.$Router.push({ name: 'commPick', params: { lineIdx: 1 } })
          }, 500)
        } else {
          if (_that.isLogin) {
            getUserCommRole({
              uid: _that.uid,
              commId: localComm.comm.comId
            }).then((res2) => {
              if (res2.code === 0) {
                const _res = res2.data
                _that.$store.dispatch('app/setUserCommRole', _res)
              }
            })
          }
        }
      }
    },

    loadPageCommData() {
      const _that = this

      const isFirstInComm = app.globalData.isFirstInComm
      if (isFirstInComm) {
        zfwyList({
          comId: _that.localComm.comm.comId,
          cityCode: _that.localArea.city.distCode
        }).then((res) => {
          if (res.code === 0) {
            const _res = res.data
            _that.zfwyInfoList = []
            if (_res && Array.isArray(_res)) {
              _that.zfwyInfoList = _res
            }

            if (_that.zfwyInfoList.length > 0) {
              _that.zfwyInfoList.forEach((el) => {
                isuCate.getIsuCateById(el.cateId).then((r) => {
                  const cateDispRules = r.cateDispRules
                  el.dispRules = cateDispRules
                })
              })

              _that.zfwyPopShow = true
            }
            app.globalData.isFirstInComm = false
          }
        })
      }

      const sysAdvert = getSysAdvert()
      const commAdvert = getCommAdvert({
        comId: _that.localComm.comm.comId,
        townCode: _that.localComm.town.distCode,
        adCode: _that.localComm.ad.distCode,
        cityCode: _that.localArea.city.distCode
      })
      Promise.all([sysAdvert, commAdvert]).then((res) => {
        let advertList = []
        if (res[0].code === 0) {
          const sysAry = res[0].data
          if (sysAry && Array.isArray(sysAry) && sysAry.length > 0) {
            advertList = [...advertList, ...sysAry]
          }
        }
        if (res[1].code === 0) {
          const comAry = res[1].data
          if (comAry && Array.isArray(comAry) && comAry.length > 0) {
            advertList = [...advertList, ...comAry]
          }
        }

        _that.banner.advertList = advertList.sort((a, b) => b.priLevel - a.priLevel)
      })

      // 加载邻间互动
      _that.reloadLjhd()
    },

    // 政府物业弹出窗口关闭
    zfwyClose() {
      const _that = this
      _that.zfwyPopShow = false
      if (_that.zfwyCurIdx < _that.zfwyInfoList.length - 1) {
        _that.zfwyCurIdx = _that.zfwyCurIdx + 1
        _that.zfwyPopShow = true
      } else {
        _that.zfwyPopShow = false
      }
    },

    /**
     * 跳转到信息列表页
     */
    goListPage(cate) {
      this.$Router.push({
        path: '/isuInfoList',
        query: { mCateId: cate.cateId }
      })
    },

    getLjhdList() {
      const _that = this
      _that.loadMoreStatus = 'loading'
      const params = {
        current: _that.ljhdPage.current,
        size: _that.ljhdPage.pageSize
      }

      const reqData = {
        cityCode: _that.localArea.city.distCode,
        comId: Number(_that.localComm.comm.comId),
        queryType: _that.ljhdQuType
      }
      ljhdPageInfo(params, reqData).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          _that.ljhdRelod = false
          if (_res.records.length > 0) {
            const dataList = _res.records.map((item) => {
              return item
            })
            _that.ljhdPage.total = Number(_res.total)
            _that.ljhdPage.pages = Number(_res.pages)

            if (dataList.length < _res.size) {
              _that.ljhdLastList = dataList
            } else {
              _that.ljhdLastList = []
              _that.ljhdFullPageList.push(...dataList)
              _that.ljhdPage.current = Number(_res.current) + 1
            }

            _that.ljhdList = [..._that.ljhdFullPageList, ..._that.ljhdLastList]
            _that.loadMoreStatus = 'more'
          } else {
            _that.loadMoreStatus = 'no-more'
          }
        }
      })
    },

    ljhdTabChg(tbList, tb) {
      const _that = this
      _that.ljhdQuType = tb.val
      _that.reloadLjhd()
    },

    reloadLjhd() {
      this.ljhdList = []
      this.ljhdPage.current = 1
      this.ljhdPage.total = 0
      this.ljhdPage.pages = 0
      this.ljhdRelod = true

      if (this.localComm && this.localComm.comm && this.localComm.comm.comId) {
        this.getLjhdList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home-box {
  .page-header {
    width: 100%;
    height: 118px;
    position: sticky;
    top: 0;
    z-index: 999;
  }

  .page-bottom {
    width: 100%;
    position: sticky;
    bottom: 0;
    z-index: 999;
  }

  .page_content {
    background-color: #f5f5f5;
    /* #ifdef H5 */
    /* margin-top: 20rpx !important; */
    /* #endif */
    margin-bottom: -65px;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;

    .mp-bg {
      position: absolute;
      left: 0;
      /* #ifdef H5 */
      top: 98rpx;
      /* #endif */
      width: 100%;
      height: 220rpx;
      /* background: linear-gradient(180deg, $bg-mid 0%, $bg-end 100%, $bg-end 100%); */
      // background: linear-gradient(180deg, #e93323 0%, #f5f5f5 100%, #751a12 100%);
      background: linear-gradient(180deg, #00b27f 0%, #4ed7b3 90%, #fff 100%);
      /* border-radius: 0 0 30rpx 30rpx; */
    }

    .banner {
      position: relative;
      width: 100%;
      height: 280rpx;
      margin: 0 auto;
      border-radius: 10rpx;
      overflow: hidden;
      padding: 20rpx 0 20rpx 0;
      margin-bottom: 25rpx;
      /* #ifdef MP */
      z-index: 10;

      /* #endif */
      swiper,
      .swiper-item,
      image {
        width: 100%;
        height: 280rpx;
        border-radius: 10rpx;
      }
    }

    .menu {
      padding-bottom: 26rpx;
      background: #fff;
      opacity: 1;
      border-radius: 14rpx;
      width: 100%;
      margin-bottom: 25rpx;

      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 20%;
        margin-top: 30rpx;

        image {
          width: 82rpx;
          height: 82rpx;
        }
      }
    }

    .urgent-box {
      display: flex;
      justify-content: space-between;
      padding: 10rpx 0;
      margin-bottom: 25rpx;
      z-index: 99;

      .urgent-cell {
        float: left;
        width: 340rpx;
        box-sizing: border-box;

        .urgent-item {
          padding: 20rpx;
        }

        .summ {
          color: #78a3f9;

          .title {
            margin-bottom: 20rpx;
            font-size: 30rpx;
            font-weight: 700;
            line-height: 40rpx;
            font-family: PingFangSC-Semibold;
            font-weight: 700;
          }

          .content {
            font-size: 24rpx;
            font-weight: 400;
            line-height: 30rpx;
          }

          .serv-bg {
            color: #21c3b6;
            background: url(~@/static/images/bg/ug_left_bg.webp) no-repeat;
            background-size: 100% 100%;
          }

          .help-bg {
            color: #ff7300;
            background: url(~@/static/images/bg/ug_right_bg.webp) no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }

    .notice {
      width: 100%;
      height: 70rpx;
      border-radius: 10rpx;
      background-color: #fff;
      margin-bottom: 25rpx;
      line-height: 70rpx;
      padding: 10rpx 14rpx;
      z-index: 9;

      .line {
        color: #cccccc;
      }

      .pic {
        width: 100rpx;
        height: 36rpx;

        image {
          width: 100%;
          height: 100%;
          display: block !important;
        }
      }

      .swipers {
        height: 100%;
        width: 500rpx;
        overflow: hidden;

        swiper {
          height: 100%;
          width: 100%;
          overflow: hidden;
          font-size: 22rpx;
          color: #333333;
        }
      }

      .iconfont {
        color: #999999;
        font-size: 20rpx;
      }
    }

    .section-box {
      height: auto;
      overflow: hidden;
      background: #fff;
      margin-top: 20rpx;

      .sec-title {
        margin: 0 10rpx;
        border-top: 0rpx solid #eee;
        border-bottom: 1px solid #d9d9d9;
        padding: 14rpx 20rpx 10rpx 20rpx;

        .main-title {
          display: flex;
          justify-content: space-between;
          font-size: 36rpx;
          margin-bottom: 7rpx;

          .name {
            position: relative;
            color: #303133;
            font-weight: 700;
          }

          .more {
            color: #909399;
          }
        }

        .intro {
          font-size: 24rpx;
          color: #999;
        }
      }

      .list {
        padding-top: 14rpx;

        .item {
          margin: 20rpx 0;
          align-items: center;
          justify-content: space-between;

          .lab {
            &::after {
              content: ': ';
            }
          }

          .addr {
            width: 250rpx;
            margin-right: 10rpx;
          }

          .limit {
            margin-right: 10rpx;
            width: 200rpx;

            .lab {
              color: #999;
            }

            .desc {
              color: rgb(218, 19, 142);
            }
          }

          .past_time {
            width: 200rpx;

            .lab {
              color: #999;
            }

            .desc {
              color: rgb(11, 134, 28);
              float: right;
            }
          }

          .reward {
            width: 200rpx;
            padding-right: 10rpx;

            .lab {
              color: #999;
            }

            .desc {
              color: goldenrod;
            }
          }
        }

        .agent {
          border-bottom: 1px dashed #eceaea;

          .title-line {
            display: flex;
            justify-content: space-between;
            font-size: 26rpx;

            .tag {
              width: 64rpx;
              height: 26rpx;
              line-height: 26rpx;
              font-size: 20rpx;
              color: #ff4c48;
              border-radius: 26rpx;
              text-align: center;
              border: 2rpx solid #ff4947;
            }

            .item-title {
              width: 480rpx;
              color: #333;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .desc-line {
            display: flex;
            justify-content: space-between;
            font-size: 24rpx;
            margin: 10rpx 10rpx 10rpx 64rpx;
          }
        }
      }

      .zfwy-body {
        width: 620rpx;
        min-height: 1000rpx;
        padding: 20rpx;

        .zfwy-title {
          font-size: 36rpx;
          margin: 70rpx auto 20rpx;
          font-weight: 700;
          text-align: center;
          max-width: 500rpx;
        }
        .zfwy-text {
          font-size: 28rpx;
          text-indent: 2ch;

          text {
            line-height: 42rpx;
          }
        }

        .signature {
          width: 300rpx;
          margin-top: 50rpx;
          margin-right: 30rpx;
          float: right;

          .sign-text {
            margin-top: 10rpx;
          }

          .sign-text-r {
            text-align: right;
          }
        }
      }
    }

    .merch {
      width: 210rpx;
      height: 250rpx;
      margin-bottom: 20rpx;
      padding: 0 10rpx;
      background-color: #fff;
      border-radius: 10rpx;
      overflow: hidden;

      .merch-img {
        position: relative;

        .pictrue_log {
          width: 80rpx;
          height: 40rpx;
          border-radius: 10rpx 0 10rpx 0;
          line-height: 40rpx;
          font-size: 24rpx;
        }

        .pictrue_log_class {
          background: linear-gradient(90deg, rgba(246, 122, 56, 1) 0, rgba(241, 27, 9, 1) 100%);
          opacity: 1;
          position: absolute;
          top: 0;
          left: 0;
          color: #fff;
          text-align: center;
          z-index: 3;
        }

        image {
          width: 210rpx;
          height: 210rpx;
        }
      }

      .merch-title {
        .tit-txt {
          color: #222222;
        }

        .line1 {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .scroll-x-tabs {
      /* #ifndef APP-PLUS-NVUE */
      display: flex;
      position: -webkit-sticky;
      /* #endif */
      position: sticky;
      /* #ifdef H5*/
      top: var(--window-top);
      /* #endif */

      z-index: 99;
      flex-direction: row;
      background: #f5f5f5;
      padding: 10rpx 0;
    }
  }

  .interact {
    .scroll-x-tabs {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .opera {
      display: flex;
      justify-content: space-evenly;
      width: 180rpx;
      font-size: 40rpx;
      color: #333;

      .last-reply {
      }

      .my-rela {
      }

      .refresh {
      }

      .ljhdrefersh {
        transition: all 0.8s;
        background: red;
        transform-origin: 50 100;
        transform: rotate(360deg);
        border-radius: 50%;
      }
    }

    .list {
      background-color: #f5f5f5;
      padding-top: 3rpx;
    }
  }
}
</style>
