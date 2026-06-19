<!--
* @Description: 新手用户引导组件
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2025-06-02 14:02:28
* @LastEditors: wangxc
* @LastEditTime: 2025-06-02 14:02:28
-->
<template>
  <view class="noviceGuide-box" v-if="showGuide" @touchmove.stop.prevent>
    <view :style="guideStyle" class="guide-box">
      <view class="tips guide-step-tips" :style="tipPosition">
        <view class="text">{{ guideInfo.tips }}</view>
        <view class="tool-btn">
          <text @click="skip">跳过</text>
          <view class="next" style="" @click="next">{{ guideInfo.next }}</view>
        </view>
      </view>
      <view class="arrow" :style="arrowTop"></view>
    </view>
    <!-- 遮罩层，防止点击 -->
    <view class="v-model"></view>
  </view>
</template>

<script>
export default {
  name: 'noviceGuide',
  components: {},
  props: {
    step: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      stepName: 'step', //该提示步骤的名称，用于不在重复展示
      guideList: [
        {
          el: '',
          tips: '',
          next: '',
          style: ''
        }
      ],
      index: 0, // 当前展示的索引
      showGuide: true, // 是否显示引导
      guideStyle: '', // 默认样式
      arrowTop: '', //步骤提示三角形的定位
      tipPosition: '', //步骤提示的定位
      windowInfo: '', //系统窗口信息
      tipWidth: 200 //步骤提示默认的宽度
    }
  },
  onLoad(e) {
    console.log(e)
  },
  onShow(e) {
    console.log(e)
  },
  onReachBottom(e) {
    console.log(e)
  },
  computed: {
    guideInfo() {
      return this.guideList[this.index]
    }
  },
  created() {},
  mounted() {
    this.guideList = this.step.guideList
    this.stepName = this.step.name
    const winInfo = uni.getWindowInfo()
    this.windowInfo = winInfo
    const guide = uni.getStorageSync(this.stepName)
    if (!guide) {
      this.getDomInfo()
    } else {
      this.showGuide = false
    }
  },
  watch: {},
  methods: {
    viewTips(data, scrollTop) {
      if (data) {
        // 如果dom宽度大于或者等于窗口宽度,需要重新调整dom展示宽度
        let newWidth = this.windowInfo.windowWidth - 20
        if (data.width >= newWidth) {
          data.width = newWidth
        }
        // 如果距离左边为0,自动增加一点左边距
        if (data.left == 0) {
          data.left = 10
        }
        let domRW = this.windowInfo.windowWidth - data.left
        let left = 0
        // 如果dom距离右边没有tips的宽度大的话,就要让tips向左便宜
        if (domRW < this.tipWidth) {
          left = domRW - this.tipWidth - 30
        }
        const index = this.index
        // 步骤条展示的高度需要加上屏幕滚动的高度
        data.top += scrollTop
        // 根据实际情况需要滚动到展示区域
        uni.pageScrollTo({
          scrollTop: data.top > 44 ? data.top - 44 : 0,
          duration: 100
        })
        let obj = Object.assign(this.guideList[index], data)
        // 设置三角形高度
        let arrowTop = data.height + 5 // 调小高度，避免位置太低
        // 如果dom在屏幕底部的话，重新调整提示框和三角形的定位
        let newHeight = this.windowInfo.windowHeight - data.bottom

        // 使用可选链来避免res.height为null时报错
        uni
          .createSelectorQuery()
          .in(this.$root)
          .select('.tips')
          .boundingClientRect((res) => {
            if (newHeight > (res?.height || 0) + 5) {
              // 如果res.height不存在，默认为0
              this.arrowTop = `top:${arrowTop}px;` // 上移10px
              // 设置提示框定位
              this.tipPosition = `top:${arrowTop + 5}px;left:${left}px;
			                    background: linear-gradient(180deg, #1cbbb4, #0081ff);`
            } else {
              this.arrowTop = 'top: -29px;' // 更靠上一些
              // 设置提示框定位
              this.tipPosition = `top: -24px;left:${left}px;
			                    transform: translateY(-100%);
			                    background: linear-gradient(0deg, #1cbbb4, #0081ff);`
            }
          })
          .exec()

        // 重新设置guideList的值
        this.guideList.splice(index, 1, obj)
        this.guideStyle = this.getStyle()
      } else {
        this.index += 1
        this.getDomInfo()
      }
    },
    // 获取步骤提示的主要样式
    getStyle() {
      const { width, height, left, top, style = 'border-radius: 8rpx;margin: 0' } = this.guideInfo
      let newstyle = 'width:' + width + 'px;'
      newstyle += 'height:' + height + 'px;'
      newstyle += 'left:' + left + 'px;'
      newstyle += 'top:' + top + 'px;'
      newstyle += 'box-shadow: rgb(33 33 33 / 80%) 0px 0px 0px 0px, rgb(33 33 33 / 50%) 0px 0px 0px 5000px;'
      newstyle += style
      return newstyle
    },
    // 获取dom信息
    getDomInfo() {
      const { el } = this.guideInfo
      const query = uni.createSelectorQuery().in(this.$root)
      this.$nextTick(function () {
        query.select(el).boundingClientRect()
        query.selectViewport().scrollOffset()
        var _this = this
        query.exec(function (res) {
          // console.log('打印dom的元素的信息', res);
          let data = res[0] // #the-id节点的上边界坐标
          let scrollTop = res[1].scrollTop // 显示区域的竖直滚动位置
          _this.viewTips(data, scrollTop)

          uni.pageScrollTo({
            scrollTop: data.top + scrollTop - 20, // 滚动位置微调
            duration: 300
          })
        })
      })
    },

    // 跳过新手提示
    skip() {
      this.showGuide = false
      uni.setStorageSync(this.stepName, 'true')
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 100
      })
    },
    // 下一步
    next() {
      if (this.index === this.guideList.length - 1) {
        this.showGuide = false
        uni.setStorageSync(this.stepName, 'true')
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 100
        })
      } else {
        this.index += 1
        this.getDomInfo()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.noviceGuide-box {
  z-index: 1001;

  .v-model {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
  }

  .guide-box {
    position: absolute;
    z-index: 10001;
    transition: all 0.2s;

    &::before {
      content: '';
      height: 100%;
      width: 100%;
      border: 1px dashed #fff;
      border-radius: 8rpx;
      position: absolute;
      top: -8rpx;
      left: -8rpx;
      padding: 7rpx;
    }

    .arrow {
      height: 20rpx;
      width: 20rpx;
      background: #1cbbb4;
      position: absolute;
      top: 144rpx;
      left: 45%;
      z-index: 990000;
      transform: rotate(45deg);
    }

    .tips {
      width: 400rpx;
      box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.1);
      color: #fff;
      position: absolute;
      top: 152rpx;
      left: -50%;
      z-index: 10001;
      padding: 15rpx 20rpx;
      font-size: 28rpx;
      border-radius: 12rpx;
      text-align: justify;

      .text {
      }

      .tool-btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 0rpx;
        margin-top: 20rpx;

        .next {
          background: #fff;
          height: 48rpx;
          width: 100rpx;
          text-align: center;
          border-radius: 8rpx;
          color: #666;
          line-height: 48rpx;
          font-size: 24rpx;
        }
      }
    }
  }
}
</style>
