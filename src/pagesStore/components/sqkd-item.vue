<!--
* @Description: 社区商店列表项
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2025-11-28 21:19:38
* @LastEditors: wangxc
* @LastEditTime: 2025-11-28 21:19:38
-->
<template>
  <view class="sqkd-item-box">
    <view class="body flex">
      <view class="info-left" v-if="imgUrls && imgUrls.length > 0" @click="gotoFull">
        <view class="logo-img">
          <image :src="imgUrls[0]" mode="scaleToFill"></image>
        </view>
      </view>
      <view class="info-right">
        <view class="top-title">
          <view class="info-title" @click="gotoFull">{{ info.title }}</view>
          <view class="opt-btn" :class="{
            'biz-run': curBizStatusIdx === 0,
            'biz-rest': curBizStatusIdx == 1,
            'biz-stop': curBizStatusIdx === 2
          }">{{ bizStaus[curBizStatusIdx].statusName }}</view>
        </view>
        <view class="info-txt">
          <view class="info-content" @click="gotoFull">{{ showText }}</view>
        </view>
      </view>
    </view>

    <view class="sub-line">
      <view class="sub-left">
        <view class="info-cate">{{ infoCate.cateTitle }}</view>
      </view>
      <view class="sub-right">
        <view class="keywords flex" v-if="keyWords.length && keyWords.length > 0">
          <view class="word-list justify-start">
            <text class="tag" v-for="(kw, idx) in keyWords" :key="idx">{{ kw }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    isNotEmpty
  } from '@/utils/validate'
  import isuCate from '@/libs/isucate'

  export default {
    name: 'sqkd-item',
    components: {},
    props: {
      rectRpxWidth: {
        type: Number,
        default: 750
      },
      info: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        infoCate: {},
        timeAgo: '',
        originalText: '',
        showText: '',
        maxShowCharCount: 20 * 3 - 6,
        isShowAll: false,

        // 信息附件图片
        imgUrls: [],
        spfs: {},
        keyWords: [],

        // 营业时间
        bizDayTime: [],
        bizStaus: [{
            status: 1,
            statusName: '正在营业'
          },
          {
            status: 2,
            statusName: '休息中'
          },
          {
            status: 3,
            statusName: '暂停营业'
          }
        ],

        curBizStatusIdx: 0,

        infoInterval: null
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
      ...mapGetters({
        localComm: 'app/localComm',
        locIsuPreUrl: 'app/locIsuPreUrl',
        locComPreUrl: 'app/locComPreUrl',
        uid: 'user/uid'
      })
    },
    created() {

    },
    mounted() {
      this.init()
      this.initInfo()
      this.getShowText()
    },
    beforeDestroy() {
      const _that = this
      if (_that.infoInterval) {
        clearInterval(_that.infoInterval)
      }
    },
    watch: {},
    methods: {
      init() {
        const rectRpxWidth = this.rectRpxWidth - 40 - 30
        const textLineCharNum = Math.floor(rectRpxWidth / 33) // 每行字数
        this.maxShowCharCount = textLineCharNum * 3 - 6
      },

      initInfo() {
        const _that = this
        if (this.info) {
          this.timeAgo = this.$util.timeAgo(this.info.isuTime)

          isuCate.getIsuCateById(this.info.cateId).then((r) => {
            this.infoCate = r
          })

          if (isNotEmpty(this.info.imgUrls)) {
            const infoImgs = JSON.parse(this.info.imgUrls)
            this.imgUrls = infoImgs.map((el) => {
              if (!this.$util.isRemoteUrl(el.url) && this.$util.startWith(el.url, 'f/')) {
                return _that.locIsuPreUrl + el.url
              } else {
                return el.url
              }
            })
          }

          if (isNotEmpty(this.info.keyWords)) {
            this.keyWords = this.info.keyWords.split(',')
          }

          // 动态表单内容
          if (this.info.dyFormData) {
            const dyData = this.info.dyFormData
            if (dyData.bizDayTime) {
              _that.bizDayTime = JSON.parse(dyData.bizDayTime)
              _that.intervalInfoView()
            }
          }

          // 专有内容
          if (this.info.speclFields) {
            // this.spfs = JSON.parse(this.info.speclFields)
            this.spfs = this.info.speclFields
          }
        }
      },

      getShowText() {
        if (this.info) {
          this.originalText = this.info.content
        }
        const charCount = this.$util.countChars(this.originalText)
        if (charCount > this.maxShowCharCount) {
          this.showText = this.originalText.substr(0, this.maxShowCharCount) + '...'
          this.isShowAll = true
        } else {
          this.showText = this.originalText
          this.isShowAll = false
        }
      },

      intervalInfoView() {
        const _that = this
        if (_that.infoInterval) {
          clearInterval(_that.infoInterval)
        }
        // 设置间隔为1分钟
        _that.infoInterval = setInterval(
          (function() {
            const fn = function() {
              if (_that.info.runingStatus === 1) {
                // 检查当前时间
                const nowTime = new Date()
                const nowDay = nowTime.getDay()
                const nowH = nowTime.getHours()
                const nowMi = nowTime.getMinutes()

                let dayIdx = 0
                if (nowDay === 0) {
                  dayIdx = 6
                } else {
                  dayIdx = nowDay - 1
                }
                const curBizDayTime = _that.bizDayTime[dayIdx]
                if (curBizDayTime.isOpen === 0) {
                  _that.curBizStatusIdx = 1 // 不营业的日期显示休息中
                } else {
                  const openTime = Number(curBizDayTime.openTime.replace(':', ''))
                  const closeTime = Number(curBizDayTime.closeTime.replace(':', ''))
                  const nowNumTime = nowH * 100 + nowMi
                  if (nowNumTime >= openTime && nowNumTime <= closeTime) {
                    _that.curBizStatusIdx = 0
                  } else {
                    _that.curBizStatusIdx = 1 // 不在营业时间范围的时间点显示休息中
                  }
                }
              } else {
                _that.curBizStatusIdx = 2 // 用户暂停营业
              }
            }
            fn()
            return fn
          })(),
          1000 * 60 * 5
        )
      },

      /**
       * 拨打电话
       */
      makePhone(phone) {
        uni.makePhoneCall({
          phoneNumber: phone
        })
      },

      gotoFull() {
        const _that = this
        this.$Router.push({
          name: 'storeDetail',
          params: {
            isuId: _that.info.isuId,
            cateId: _that.info.cateId,
            comId: _that.localComm.comm.comId
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sqkd-item-box {
    background-color: #fff;
    margin: 10rpx 15rpx;
    border-radius: 10rpx;

    .body {
      padding: 10rpx 20rpx;

      .info-left {
        .logo-img {
          image {
            width: 180rpx;
            height: 180rpx;
            border-radius: 10rpx;
          }
        }
      }

      .info-right {
        margin-left: 20rpx;
        padding: 10rpx;
        flex: 1;

        .top-title {
          display: flex;
          justify-content: space-between;

          .info-title {
            font-size: 33rpx;
            color: #606266;
            font-weight: 600;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .opt-btn {
            font-size: 28rpx;
            width: 150rpx;
            height: 54rpx;
            border-radius: 20rpx;
            color: #fff;
            text-align: center;
            line-height: 54rpx;
            margin-right: 10rpx;
          }

          .biz-run {
            background-color: #19be6b;
          }

          .biz-stop {
            background-color: #1135a3;
          }

          .biz-rest {
            background-color: #c8c9cc;
          }
        }

        .info-txt {
          .info-content {
            font-size: 28rpx;
            color: #909399;
            margin-top: 10rpx;
          }
        }
      }

      .content {
        margin: 10rpx 0;

        .title {
          font-size: 33rpx;
          color: #303133;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .text {
          font-size: 33rpx;
          color: #909399;
          margin-top: 10rpx;
        }
      }
    }

    .sub-line {
      display: flex;
      justify-content: flex-start;
      padding: 10rpx 20rpx 20rpx 20rpx;
      font-size: 28rpx;

      .sub-left {
        display: flex;
        width: 200rpx;

        .gap-left {
          margin-left: 20rpx;
        }

        .info-cate {
          color: #f29100;
        }
      }

      .sub-right {
        .keywords {
          display: flex;
          justify-content: flex-start;
          width: 360rpx;

          .tag {
            height: 32rpx;
            line-height: 32rpx;
            font-size: 28rpx;
            color: #ff4c48;
            border-radius: 12rpx;
            text-align: center;
            border: 2rpx solid #2196f3;
            margin: 0 8rpx;
            padding: 5rpx 8rpx;
          }
        }
      }
    }
  }
</style>