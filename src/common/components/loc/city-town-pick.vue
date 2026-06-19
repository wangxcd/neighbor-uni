<!--
* @Description: 城市的街道(乡镇)选择组件
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-05-13 07:57:29
* @LastEditors: wangxc
* @LastEditTime: 2024-05-13 07:57:29
-->
<template>
  <view class="city-town-pick-box">
    <u-picker
      :show="show"
      :loading="areaPickLoading"
      ref="uPicker"
      title="区域选择"
      :columns="areaList"
      :defaultIndex="areaIdxs"
      :closeOnClickOverlay="true"
      keyName="distName"
      @confirm="areaOk"
      @change="changeAd"
      @close="popClose"
      @cancel="popClose"></u-picker>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCityTownLev } from '@/api/locCity'

export default {
  name: 'city-town-pick',
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false
    },
    adCode: {
      type: String,
      default: undefined
    },
    townCode: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      areaPickLoading: false,
      // 当前区县、街道
      locAd: undefined,
      locTown: undefined,

      adList: [], // 区县列表
      adTownList: [], // 乡镇列表
      areaList: [],

      areaIdxs: [0, 0] // 区域各级选择的索引
    }
  },
  computed: {
    ...mapGetters({
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
      getCityTownLev(this.localArea.city.distCode).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          _that.adList = []
          _that.adTownList = []
          if (Array.isArray(_res)) {
            _res.forEach((el, idx) => {
              const { locNode, childList } = { ...el }
              _that.adList.push(locNode)
              if (childList) {
                const nodeList = childList.map((el) => {
                  return el.locNode
                })
                _that.adTownList.push(nodeList)
              }
            })

            // 索引当前所在区县
            let adIdx = -1
            if (_that.adCode) {
              adIdx = _that.adList.findIndex((el, idx) => el.distCode === _that.adCode)
            } else {
              const ad = _that.localComm.ad || _that.localArea.ad
              if (ad) {
                adIdx = _that.adList.findIndex((el, idx) => el.distCode === ad.distCode)
              }
            }

            if (adIdx === -1) {
              adIdx = 0
            }

            _that.locAd = _that.adList[adIdx]
            const townList = _that.adTownList[adIdx]
            _that.areaList = [_that.adList, townList]

            let townIdx = 0
            if (_that.townCode) {
              townIdx = townList.findIndex((el, idx) => el.distCode === _that.townCode)
            } else {
              if (_that.localComm.town && _that.localComm.town.distCode) {
                townIdx = townList.findIndex((el, idx) => el.distCode === _that.localComm.town.distCode)
              }
            }
            if (townIdx === -1) {
              townIdx = 0
            }

            _that.locTown = townList[townIdx]
            _that.areaIdxs = [adIdx, townIdx]

            // 返回当前区域
            _that.$emit('setLocArea', _that.locAd, _that.locTown)
          }
        }
      })
    },

    changeAd(e) {
      const _that = this
      const {
        columnIndex,
        value,
        values, // values为当前变化列的数组内容
        index,
        indexs,
        // 微信小程序无法将picker实例传出来，只能通过ref操作
        picker = this.$refs.uPicker
      } = e

      _that.areaIdxs = indexs
      // 当第一列值发生变化时，变化第二列(后一列)对应的选项
      if (columnIndex === 0) {
        this.areaPickLoading = true
        // 模拟网络请求
        uni.$u.sleep(500).then(() => {
          picker.setColumnValues(1, _that.adTownList[index])
          _that.areaIdxs[1] = 0
          _that.areaPickLoading = false
        })
      }
    },

    areaOk() {
      const _that = this
      _that.areaPickLoading = false

      const adIdx = _that.areaIdxs[0]
      const townIdx = _that.areaIdxs[1]
      _that.locAd = _that.adList[adIdx]
      _that.locTown = _that.adTownList[adIdx][townIdx]

      this.$emit('areaOk', _that.locAd, _that.locTown)
    },

    popClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.city-town-pick-box {
}
</style>
