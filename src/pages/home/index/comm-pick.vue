<!--
* @Description: 社区选择页面
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-27 21:57:13
* @LastEditors: wangxc
* @LastEditTime: 2024-04-27 21:57:13
-->
<template>
  <view class="comm-pick-box">
    <u-navbar
      height="44"
      :fixed="true"
      leftText="返回"
      :autoBack="false"
      title="生活区选择"
      titleStyle="font-size: 15px;"
      bgColor="#0AB27D"
      :border="true"
      @leftClick="leftBack"></u-navbar>
    <view class="loc-area" :style="{ 'padding-top': `${sysInfo.statusBarHeight + 48}px` }">
      <view class="loc-title">
        <view class="title">当前区域</view>
        <view class="city" @click="toCityPick">
          <text>切换城市:</text>
          <text class="loc">{{ localArea.city.distName || '未知城市'}}</text>
        </view>
      </view>
      <view class="list-cell" @click="pickLoc">
        <text class="myicon icon-fujin"></text>
        <text>{{ locAd.distName || '未知区(县)' }} / {{ locTown.distName || '未知街道(乡镇)' }}</text>
      </view>
    </view>

    <!--名称过滤-->
    <view class="filter">
      <view class="left"></view>
      <view class="right">
        <input class="uni-input" style="width: 420rpx;" :value="filterTxt" placeholder="输入小区名称在当前城市筛选" @confirm="filterComm(1, $event)" />
        <text class="icon myicon icon-sousuo"></text>
      </view>
    </view>

    <view class="pick-notes">
      <view class="note-txt">
        <text class="txt note">特别提醒</text>
        <text></text>
        <text class="txt">如果你所在住宅小区规模较小或常居人口较少，强烈建议你以小区所属的行政社区为基本生活区</text>
      </view>
    </view>

    <view class="comm-list" v-if="commList && commList.length > 0">
      <view class="list-cell" v-for="(comm, idx) in commList" :key="idx" @click="pickComm(comm)">
        <view class="title-line">
          <view class="item-title">{{ comm.title }}</view>
          <view class="dist">
            <text class="desc">距离 {{ comm.showDist }}{{ comm.distUnit }}</text>
          </view>
        </view>
        <view class="desc-line">
          <view class="addr">{{ comm.address }}</view>
        </view>
      </view>
    </view>
    <view class="comm-list" v-else>
      <view class="list-cell">
        <text>街道(乡镇)首次访问,请</text>
        <text class="op" @click="toMapSerch">点击这儿</text>
        <text>获取当前位置周边生活区</text>
      </view>
    </view>

    <view class="toMap" v-if="isMapLoad === 0 && isNoComm && commList && commList.length > 0">
      <view>
        <text>没有我的生活区, </text>
        <text class="op" @click="toMapSerch">点击这儿</text>
        <text>获取当前位置周边生活区</text>
      </view>
    </view>

    <u-loadmore status="nomore" />

    <cityTownPickVue v-if="areaPickShow" :show="areaPickShow" :adCode="locAd.distCode" :townCode="locTown.distCode" @setLocArea="setLocArea" @areaOk="areaOk" @close="areaPickShow = false"></cityTownPickVue>

    <u-modal :show="confirmModel.show" :closeOnClickOverlay="confirmModel.closeOnClickOverlay" @confirm="confirmOk">
      <view class="slot-content" :style="{ 'font-size': confirmModel.fontSize ? confirmModel.fontSize : '33rpx' }">
        <view>
          <text>你需要选择一个要浏览的生活区。\n 可以通过选择区(县)—街道(乡镇)—生活区；\n 也可以点击最下面的文字加载当前位置周边的生活区选择。</text>
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLocatItude } from '@/libs/location'
import { getCommListOfTown, filterCommOfCity, mapLocComm, getLocalArea, nearsByItude, getLocalAreByLatng } from '@/api/locCity'
import { getUserCommRole } from '@/api/userComm'
import cityTownPickVue from '@/common/components/loc/city-town-pick.vue'

const app = getApp()

export default {
  name: 'comm-pick',
  components: {
    cityTownPickVue
  },
  data() {
    return {
      areaPickShow: false,

      // 当前区县、街道
      locAd: {
        distCode: undefined,
        distName: undefined
      },
      locTown: {
        distCode: undefined,
        distName: undefined
      },

      prePickCommId: undefined, // 选择前的生活区ID

      filterTxt: '', // 筛选文本
      filterFlag: 0, // 是否筛选处理，下拉加载里需要判断
      isFirstFilter: 1, // 是否为首次筛选，首次分页需要初始化

      // 小区列表
      commList: [],
      // 小区分页信息
      commPage: {
        sortNum: 0, // 当前页开始序号
        current: 1, // 当前位于哪页
        pageSize: 20, // 每页显示最多行数
        total: 0, // 总数
        pages: 0 // 总页数
      },

      isNoComm: false,
      isMapLoad: 0, // 是否已从地图加载 0:未加载,1:已加载, 2:禁止加载
      mapLoadComm: [],

      confirmModel: {
        show: false,
        title: '',
        content: '',
        fontSize: '33rpx',
        closeOnClickOverlay: true
      }
    }
  },
  onLoad(e) {
    console.log(e)
  },
  onShow() {
    const _that = this
    const localArea = this.localArea
    if (!localArea || !localArea.city || !localArea.cityServer) {
      // 跳转到城市选择页
      setTimeout(() => {
        _that.$Router.push({ name: 'cityPick', params: { lineIdx: 1 } })
      }, 500)
    } else {
      const locComm = this.localComm
      if (!locComm || !locComm.ad || !locComm.town) {
        _that.pickLoc()
      }
    }
  },
  onReachBottom() {
    if (this.filterFlag === 0) {
      // 加载当前街道更多小区
      if (!this.isNoComm && this.locTown && this.locTown.distCode) {
        this.commPage.current++
        this.listTownComm()
      }
    } else if(this.filterFlag === 1) {
      // 加载更多筛选结果
      if (!this.isNoComm) {
        this.commPage.current++
        this.filterComm(2)
      }
    }
  },
  computed: {
    ...mapGetters({
      sysInfo: 'app/sysInfo',
      isLogin: 'user/isLogin',
      uid: 'user/uid',
      userInfo: 'user/userInfo',
      lociTude: 'app/lociTude',
      localArea: 'app/localArea',
      localComm: 'app/localComm'
    })
  },
  created() {
    this.initData()
  },
  watch: {},
  methods: {
    initData() {
      const _that = this
      // 先判断是否已选择城市
      const localArea = this.localArea
      if (!localArea || !localArea.city || !localArea.cityServer) {
        // 跳转到城市选择页
        setTimeout(() => {
          _that.$Router.push({ name: 'cityPick', params: { lineIdx: 1 } })
        }, 500)
      }

      // 选择前的生活区ID
      if (_that.localComm.comm) {
        _that.prePickCommId = _that.localComm.comm.comId
      }

      // 索引当前所在区县
      const ad = _that.localComm.ad || _that.localArea.ad
      _that.locAd = ad
      if (!_that.locAd) {
        _that.pickLoc()
      }

      if (_that.localComm.town && _that.localComm.town.distCode) {
        _that.locTown = _that.localComm.town
        _that.commList = []
        _that.commPage.current = 1
        _that.isNoComm = false
        _that.isMapLoad = 0
        _that.listTownComm()
      } else {
        _that.pickLoc()
      }
    },

    setLocArea(ad, town) {
      const _that = this
      _that.locAd = ad
      _that.locTown = town
    },

    areaOk(ad, town) {
      const _that = this
      _that.areaPickShow = false
      _that.locAd = ad
      _that.locTown = town

      _that.commList = []
      _that.commPage.current = 1
      _that.isNoComm = false
      // _that.isMapLoad = 0
      _that.listTownComm()
    },

    pickLoc() {
      const _that = this
      _that.areaPickShow = true
    },

    // 列出街道的小区
    listTownComm() {
      const _that = this
      _that.filterFlag = 0

      const params = {
        current: _that.commPage.current,
        size: _that.commPage.pageSize
      }

      const req = {
        latitude1: _that.lociTude.latitude,
        longitude1: _that.lociTude.longitude,
        townCode: _that.locTown.distCode
      }

      getCommListOfTown(params, req).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res.records && _res.records.length > 0) {
            const dataList = _res.records.map((item) => {
              return item
            })
            _that.commList.push(...dataList)

            _that.commPage.total = Number(_res.total)
            _that.commPage.pages = Number(_res.pages)
          } else {
            _that.isNoComm = true
          }
        }
      })
    },

    // 名称搜索小区
    filterComm(isFirstFilter, e) {
      const _that = this
      if (e) {
        _that.filterTxt = e.detail.value.trim()
      }

      if (isFirstFilter === 1) {
        _that.commList = []
        _that.commPage.current = 1
        _that.isNoComm = false
        // _that.isMapLoad = 0
      }

      if (_that.filterTxt.length === 0) {
        _that.filterFlag = 0
        _that.listTownComm()
        return false
      }

      const params = {
        current: _that.commPage.current,
        size: _that.commPage.pageSize
      }

      const req = {
        latitude1: _that.lociTude.latitude,
        longitude1: _that.lociTude.longitude,
        cityCode: _that.localArea.city.distCode,
        filterTxt: _that.filterTxt
      }

      _that.filterFlag = 1

      filterCommOfCity(params, req).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res.records && _res.records.length > 0) {
            const dataList = _res.records.map((item) => {
              return item
            })
            _that.commList.push(...dataList)

            _that.commPage.total = Number(_res.total)
            _that.commPage.pages = Number(_res.pages)
          } else {
            _that.isNoComm = true
          }
        }
      })

    },

    // 选择小区
    pickComm(comm) {
      const _that = this

      // 新选择的社区与选择前不一样
      if (_that.prePickCommId !== comm.comId) {
        app.globalData.isFirstInComm = true

        const req = {
          adCode: comm.adCode,
          cityCode: comm.cityCode,
          townCode: comm.townCode
        }
        getLocalArea(req).then((res) => {
          if (res.code === 0) {
            const _res = res.data
            const locComm = {
              ad: _res.ad, // 所在区县
              town: _res.town, // 所在街道(乡镇)
              comm: comm // 住宅区信息
            }

            // 选了社区后，以社区经纬度为历史
            if (comm.location) {
              const comTude = JSON.parse(comm.location)
              if (comTude && comTude.lat && comTude.lng) {
                _that.$store.dispatch('app/setLociTude', {
                  latitude: comTude.lat,
                  longitude: comTude.lng
                })
              }
            }

            _that.$store.dispatch('app/setLocalArea', _res)
            _that.$store.dispatch('app/setLocalComm', locComm)

            if (_that.isLogin) {
              getUserCommRole({
                uid: _that.uid,
                commId: comm.comId
              }).then((res2) => {
                if (res2.code === 0) {
                  const _res = res2.data
                  _that.$store.dispatch('app/setUserCommRole', _res)
                  _that.$Router.back(1)
                }
              })
            } else {
              _that.$store.dispatch('app/setUserCommRole', undefined)
              _that.$Router.back(1)
            }
          }
        })
      } else {
        _that.$Router.back(1)
      }
    },

    /**
     * 地图搜索添加生活区
     */
    toMapSerch() {
      const _that = this

      if (_that.isMapLoad === 2) {
        // 未开通城市不再重复处理
        _that.$uniUtil.tips({ title: '当前位置所在城市还未开通服务', endtime: 3000 })
        return false
      } else if(_that.isMapLoad === 1) {
        if (_that.mapLoadComm.length === 0) {
          _that.$uniUtil.tips({ title: '已列出了当前位置1000米范围内所有生活区', endtime: 3000 })
          return false
        }
      } else if(_that.isMapLoad === 0) {
        // 获取当前位置经纬度
        getLocatItude().then((iTude) => {
          let req = {
            latitude1: iTude.latitude,
            longitude1: iTude.longitude
          }

          getLocalAreByLatng(req).then((res) => {
            if (res.code === 0) {
              const _res = res.data
              if (_res && _res.city && _res.city.isOpen === 1) {
                this.loadMapCommByLatlng(req)
              } else {
                // 未开通城市
                _that.isMapLoad = 2
                _that.$uniUtil.tips({ title: '当前位置所在城市还未开通服务', endtime: 3000 })
              }
            }
          })

        })
      }
    },

    /**
     * 地图加载经纬度附近生活区
     * @param req 
     */
    loadMapCommByLatlng(req) {
      _that.mapLoadComm = []
      mapLocComm(req).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res) {
            _that.isMapLoad = 1
            nearsByItude(req).then((res2) => {
              if (res2.code === 0) {
                const _res2 = res2.data
                if (_res2 && _res2.length > 0) {
                  _res2.forEach((el) => {
                    const idx = _that.commList.findIndex((e2) => e2.comId === el.comId)
                    if (idx === -1) {
                      _that.commList.push(el)
                      _that.mapLoadComm.push(el)
                    }
                  })
                }
              }
            })
          }
        }
      })
    },

    leftBack() {
      const _that = this
      if (!this.localComm.comm) {
        this.confirmModel.show = true
      } else {
        _that.$Router.back(1)
      }
    },

    confirmOk() {
      this.confirmModel.show = false
    },

    toCityPick() {
      this.$Router.push({ name: 'cityPick', params: { lineIdx: 1 } })
    }
  }
}
</script>

<style lang="scss" scoped>
.comm-pick-box {
  padding: 20rpx;

  .loc-area {
    margin: 30rpx 0;

    .loc-title {
      display: flex;
      justify-content: space-between;

      .title {
        font-size: 33rpx;
        color: #323233;
        font-weight: 700;
      }

      .city {
        font-size: 33rpx;

        .loc {
          display: inline-block;
          position: relative;
          padding-left: 5px;
          padding-right: 10px;
          color: #222;

          &::after {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border: 3px solid #222;
            border-color: #222 transparent transparent transparent;
            border-width: 4px 3px 4px 3px;
            right: 0;
            top: 50%;
            margin-top: -2px;
          }
        }
      }
    }

    .list-cell {
      margin-top: 20rpx;
      font-size: 33rpx;
    }
  }

  .filter {
    display: flex;
    justify-content: space-between;

    .left {

    }

    .right {
      display: flex;
      justify-content: space-between;
      width: 500rpx;
      margin: 10rpx 3rpx;
      background-color: #fff;
      padding: 10rpx 20rpx;

      .icon {
        margin: 10rpx;
      }
    }
  }

  .pick-notes {
    .note-txt {
      text-indent: 2em;

      .note {
        font-weight: 600;
        margin-right: 10rpx;

        &::after {
          content: ':';
        }
      }

      .txt {
        color: #ff5722;
        font-size: 28rpx;
        line-height: 42rpx;
      }
    }
  }

  .comm-list {
    border-top: 1px dashed #eceaea;

    .list-cell {
      box-sizing: border-box;
      width: 100%;
      overflow: hidden;
      color: #323233;
      background-color: #fff;
      margin: 10rpx 0;
      padding: 20rpx 10rpx;

      .title-line {
        display: flex;
        justify-content: space-between;
        font-size: 33rpx;

        .item-title {
          width: 480rpx;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .dist {
          font-size: 28rpx;
        }
      }

      .desc-line {
        display: flex;
        justify-content: space-between;
        font-size: 24rpx;
        margin: 10rpx;

        .addr {
          width: 100%;
          color: #c8c9cc;
        }
      }

      .op {
        color: #ff5722;
        font-size: 28rpx;
      }
    }
  }

  .toMap {
    margin: 50rpx 0 50rpx 0;
    color: #9c9c9e;
    font-size: 24rpx;

    .op {
      color: #ff5722;
      font-size: 28rpx;
    }
  }
}
</style>
