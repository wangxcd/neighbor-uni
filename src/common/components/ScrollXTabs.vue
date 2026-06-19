<!--
* @Description: 横向滚动标签组件
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-19 19:27:20
* @LastEditors: wangxc
* @LastEditTime: 2024-04-19 19:27:20
-->
<template>
  <view class="ScrollXTabs-box" :style="boxStyle">
    <scroll-view class="cate-scroll" :scroll-x="true" :enable-flex="true" scroll-with-animation :scroll-left="tabsScrollLeft" @scroll="scroll">
      <view class="nav-tabs justify-start align-center" id="tabList">
        <view class="tab-item align-center justify-center un-active" style="width: 20rpx"></view>
        <view
          v-for="(tabItem, index) in tabList"
          :key="index"
          @click="onTabChange(tabItem, index)"
          :class="{
            'tab-item align-center justify-center': true,
            'active': activeTabIdx == index,
            'un-active': activeTabIdx !== index
          }"
          :style="tabItemStyle[index]">
          <view class="txt">{{ tabItem[nameProp] }}</view>
        </view>
        <view class="tab-item align-center justify-center un-active" style="width: 20rpx"></view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'ScrollXTabs',
  components: {},
  data() {
    return {
      boxStyle: '',
      tabItemStyle: [],

      activeTabIdx: 0,
      scrollLeft: 0,
      tabsScrollLeft: 0 // tabs当前偏移量
    }
  },
  props: {
    width: {
      type: String,
      default: '100%'
    },
    tabList: {
      type: Array,
      default: () => []
    },
    nameProp: {
      type: String,
      default: 'name'
    },
    activIdx: {
      type: Number,
      default: 0
    }
  },
  computed: {},
  created() {
    this.initStyle()
  },
  watch: {
    activIdx(newVal) {
      if (newVal != this.activeTabIdx) {
        this.activeTabIdx = newVal
      }
    },

    activeTabIdx(newVal) {
      // 监听当前选中项
      this.setTabList()
    }
  },
  methods: {
    initStyle() {
      const _that = this
      this.boxStyle = 'width:' + this.width
      if (this.tabList && this.tabList.length > 0) {
        this.tabList.forEach((el, idx) => {
          const charCount = _that.$util.countChars(el[_that.nameProp])
          if (charCount > 0) {
            const itemW = (charCount + 1) * 28
            _that.tabItemStyle[idx] = 'width: ' + itemW + 'rpx;'
          }
        })
      }
    },
    onTabChange(tabItem, idx) {
      this.activeTabIdx = idx
      this.$emit('tabChange', this.tabList, tabItem, this.activeTabIdx)
    },
    scroll(e) {
      this.scrollLeft = e.detail.scrollLeft
    },
    setTabList() {
      this.$nextTick(() => {
        //this.setLine()
        this.scrollIntoView()
      })
    },
    // 计算tabs位置
    scrollIntoView() {
      const _that = this
      // item滚动
      let lineLeft = 0
      _that.getElementData('#tabList', (tabs) => {
        let list = tabs[0]
        _that.getElementData(`.tab-item`, (item) => {
          let el = item[_that.activeTabIdx]
          lineLeft = el.width / 2 + -list.left + el.left - list.width / 2 - _that.scrollLeft
          _that.tabsScrollLeft = _that.scrollLeft + lineLeft
        })
      })
    },
    getElementData(el, callback) {
      uni
        .createSelectorQuery()
        .in(this)
        .selectAll(el)
        .boundingClientRect()
        .exec((data) => {
          callback(data[0])
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.ScrollXTabs-box {
  background: #f5f5f5;
  padding: 10rpx 0;

  .nav-tabs {
    .tab-item {
      width: 120rpx;
      height: 60rpx;
      font-size: 28rpx;
      text-align: center;
      color: #666;
      flex-shrink: 0;
      margin: 0;
      padding: 0 4rpx;

      &.active {
        position: relative;
        position: relative;
        background: #21c3b6;
        border-radius: 8rpx 8rpx 0 0;
        border-top: 1px solid #369;
        border-left: 1px solid #369;
        border-right: 1px solid #369;
        border-bottom: none;

        &::after {
          content: '';
          position: absolute;
          width: 100%;
          height: -1px;
          left: -2px;
          bottom: -2px;
          background: #f69316;
        }
      }

      &.un-active {
        border-top: none;
        border-left: none;
        border-right: none;
        border-bottom: 1px solid #369;
      }
    }
  }
}
</style>
