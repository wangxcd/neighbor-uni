<!--
* @Description: 城市选择页面
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-26 15:25:33
* @LastEditors: wangxc
* @LastEditTime: 2024-04-26 15:25:33
-->
<template>
  <view class="city-pick-box">
    <u-navbar height="44" :fixed="true" leftText="返回" :autoBack="true" title="城市选择" titleStyle="font-size: 15px;" bgColor="#0AB27D" :border="true"></u-navbar>
    <view class="cityserch" :style="{ 'padding-top': `${sysInfo.statusBarHeight + 48}px` }"></view>
    <view class="loc-city">
      <view class="loc-title">当前城市</view>
      <view class="list-cell" @click="pickLoc">
        {{ localArea.city.distName || '未知城市' }} 
      </view>
    </view>
    <view class="pick-idx">
      <u-index-list :index-list="idxLetters">
        <u-index-item v-for="(item, idx) in idxCityList" :key="idx">
          <u-index-anchor :text="item.letter"></u-index-anchor>
          <view class="list-cell" v-for="(city, idxI) in item.data" :key="idxI" @click="pickCity(city)">
            {{ city.distName }}
          </view>
        </u-index-item>
      </u-index-list>
    </view>

    <uni-load-more :status="loadMoreStatus" :contentText="loadMoreContent"></uni-load-more>

  </view>
</template>

<script>
import { getAllOpenCitys, getLocalArea } from '@/api/locCity'
import { getUserLiveComm } from '@/api/userComm'
import { getLatudeArea } from '@/libs/location'
import { mapGetters } from 'vuex'

export default {
  name: 'city-pick',
  components: {},
  data() {
    return {
      idxLetters: [],
      idxCityList: [],

      loadMoreContent: {
        contentdown: '下拉显示更多',
        contentrefresh: '正在加载...',
        contentnomore: '更多城市正在开通服务中...'
      },
      loadMoreStatus: 'noMore',
    }
  },
  onLoad(e) {
    console.log(e)
  },
  computed: {
    ...mapGetters({
      sysInfo: 'app/sysInfo',
      localArea: 'app/localArea',
      isLogin: 'user/isLogin',
      uid: 'user/uid'
    })
  },
  created() {
    this.initData()
  },
  watch: {},
  methods: {
    initData() {
      const _that = this
      getAllOpenCitys().then((res) => {
        if (res.code === 0) {
          const citys = res.data
          _that.idxCityList = []

          // 组装索引数据
          citys.forEach((el, idx) => {
            if (el.pinyin) {
              el.pyletter = el.pinyin.replace(/\[|\]|\,|\"/g, '')
              if (el.pyletter) {
                const idxLetter = el.pyletter.slice(0, 1).toUpperCase()
                let letterCityList = _that.idxCityList.find((item) => item.letter === idxLetter)
                if (!letterCityList) {
                  _that.idxCityList.push({
                    letter: idxLetter,
                    data: [el]
                  })
                } else {
                  let cityList = letterCityList.data
                  cityList.push(el)
                  letterCityList.data = cityList
                }
              }
            }
          })

          // 索引排序
          _that.idxCityList.sort((a, b) => {
            if (a.letter < b.letter) {
              return -1
            } else {
              return 1
            }
          })

          // 索引城市排序
          _that.idxLetters = []
          _that.idxCityList.forEach((item) => {
            _that.idxLetters.push(item.letter)
            item.data.sort((a, b) => {
              if (a.pyletter < b.pyletter) {
                return -1
              } else {
                return 1
              }
            })
          })
        }
      })
    },

    pickLoc() {
      this.$Router.back(1)
    },

    pickCity(city) {
      const _that = this
      if (_that.localArea && _that.localArea.city && _that.localArea.city.distCode 
            && city.distCode === _that.localArea.city.distCode) {
        // 城市未变化不处理
        return false
      }

      const req = {
        cityCode: city.distCode
      }

      return getLocalArea(req).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res.city) {
            /* 
            const tCity = _res.city
            if (tCity.location) {
              const latng = JSON.parse(tCity.location)
              const iTude = {
                latitude: latng.lat,
                longitude: latng.lng
              }

              // 不使用位置服务时，经伟度暂无用处
              _that.$store.dispatch('app/setLociTude', iTude)
            }
            */

            // 选了城市后，以城市经纬度为历史
            if (city.location) {
              const cityTude = JSON.parse(city.location)
              if (cityTude && cityTude.lat && cityTude.lng) {
                _that.$store.dispatch('app/setLociTude', {
                  latitude: cityTude.lat,
                  longitude: cityTude.lng
                })
              }
            }

            const cityArea = {
              nation: _res.nation, // 国家
              province: _res.province, // 省份
              city: _res.city, // 城市
              ad: undefined, //区县
              cityServer: _res.cityServer // 城市服务(生活区选择前先使用城市的服务地址)
            }

            _that.$store.dispatch('app/setLocalArea', cityArea)
            _that.$store.dispatch('app/clearLocalComm')
            _that.$Router.back(1)

            /*
             * 取消腾讯位置服务方式
            
            if (tCity.location) {
              const latng = JSON.parse(tCity.location)
              const iTude = {
                latitude: latng.lat,
                longitude: latng.lng
              }
              // 调用位置服务取当前所在城市
              getLatudeArea(iTude).then((loc) => {
                _that.getLocRegion(loc).then((area) => {
                  _that.$store.dispatch('app/setLociTude', iTude)
                  _that.$store.dispatch('app/setLocalArea', area)
                  _that.$store.dispatch('app/clearLocalComm')
                  _that.$Router.back(1)
                })
              }).catch((err) => {
                _that.$uniUtil.error(JSON.stringify(err))
              })

              if (_that.isLogin) {
                // 登录用户，加载常居生活区
                _that.getLiveComm(tCity.distCode)
              }
            }
            */
          }
        }
      })
    },

    /**
     * 本地服务获取当前位置服务配置
     * @param {*} loc
     */
    getLocRegion(loc) {
      const req = {
        nationCode: loc.nationCode,
        cityCode: loc.cityCode,
        adCode: loc.adCode
      }
      return getLocalArea(req).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          return _res
        }
      })
    },

    getLiveComm(cityCode) {
      const _that = this
      const req = {
        cityCode: cityCode,
        uid: this.uid
      }
      getUserLiveComm(req).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          _that.$store.dispatch('user/setLiveComms', _res)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.city-pick-box {
  .list-cell {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 10px 24rpx;
    overflow: hidden;
    color: #323233;
    font-size: 14px;
    line-height: 24px;
    background-color: #fff;
  }
}
</style>
