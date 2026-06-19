<!--
* @Description: 小店、工作室详情
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2025-11-30 12:08:10
* @LastEditors: wangxc
* @LastEditTime: 2025-11-30 12:08:10
-->
<template>
  <view class="detail-box"
    :style="{ 'min-height': sysInfo.pageHeight + 'px', 'padding-top': `${sysInfo.statusBarHeight + 48}px` }">
    <u-navbar height="44" :fixed="true" leftText="返回" :autoBack="true" :title="pageTitle" titleStyle="font-size: 15px;"
      bgColor="#0AB27D" :border="true"></u-navbar>
    <view class="body">
      <view class="detail">
        <view class="m-header">
          <view class="title-box">
            <view class="title">{{ isuInfoView.title }}</view>
            <view class="biz-status" :class="{
                'biz-run': curBizStatusIdx === 0,
                'biz-rest': curBizStatusIdx == 1,
                'biz-stop': curBizStatusIdx === 2
            }">{{ bizStaus[curBizStatusIdx].statusName }}</view>
            <view class="keywords flex" v-if="keyWords.length && keyWords.length > 0">
              <view class="word-list justify-start">
                <text class="tag" v-for="(kw, idx) in keyWords" :key="idx">{{ kw }}</text>
              </view>
            </view>
          </view>
          <view class="logo">
            <image class="mlogo" :src="mLogo.url" mode=""></image>
          </view>
        </view>
        <view class="content">
          <text>{{ isuInfoView.content }}</text>
        </view>
        <view class="imgs" v-if="mImgs.length > 0">
          <view class="imgview" v-for="(mmg, idx) in mImgs" :key="idx">
            <image class="mimg" :src="mmg.url" mode="widthFix"></image>
          </view>
        </view>

        <view class="info-fields">
          <view class="col" v-if="isuInfoView.contactMan">
            <view class="title">联系人</view>
            <view class="form-input">{{ isuInfoView.contactMan }}</view>
          </view>
          <view class="col" v-if="isuInfoView.phone">
            <view class="title">电话</view>
            <view class="form-input">
              <text :user-select="true">{{ isuInfoView.phone }}</text>
            </view>
            <view class="call-phone" @click="makePhone(isuInfoView.phone)">
              <text class="myicon icon-c002dianhua">拨打电话</text>
            </view>
          </view>
        </view>
        <view class="info-fields">
          <view class="col" v-if="isuInfoView.buildPark || isuInfoView.buildNo || isuInfoView.buildUnit">
            <view class="title">小店位置</view>
            <view class="form-input">
              <text :user-select="true">{{ localComm.comm.title }}</text>
              <text class="field" v-if="isuInfoView.buildPark" :user-select="true">{{ isuInfoView.buildPark }}园区</text>
              <text class="field" v-if="isuInfoView.buildNo" :user-select="true">{{ isuInfoView.buildNo }}楼</text>
              <text class="field" v-if="isuInfoView.buildUnit" :user-select="true">{{ isuInfoView.buildUnit }}单元</text>
              <text class="field" v-if="isuInfoView.buildRoom" :user-select="true">{{ isuInfoView.buildRoom }}室</text>
            </view>
          </view>
        </view>
      </view>

      <view class="goods">
        <!-- 小店商品或服务项 -->
      </view>
    </view>

    <view class="footer" v-if="isuInfoView.isIsuer === 1">
      <!-- 店主操作区 -->
      <view class="op">
        <template v-if="spfs.runingStatus === 0">
          <view class="op-btn" @click="editIsuThis(1)">编辑</view>
          <view class="op-btn" @click="chgRunStatus(1)">继续营业</view>
        </template>
        <template v-else-if="spfs.runingStatus === 1">
          <view class="op-btn" @click="chgRunStatus(0)">暂停营业</view>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import isuCate from '@/libs/isucate'
  import {
    isNotEmpty
  } from '@/utils/validate'
  import {
    isuDetail,
    isuReadCount
  } from '@/api/isuQuery'

  import {
    isuUpdSpecl
  } from '@/api/isuForm'

  export default {
    name: 'detail',
    components: {},
    data() {
      return {
        cateId: null,
        comId: null,
        isuId: null,

        infoCate: {}, // 信息类目
        sCateName: '',
        infoData: {},
        pageTitle: '小店详情',

        // 原信息
        isuInfoView: {},
        commLive: {},
        dyData: {},
        spfs: {},

        // 信息附件图片
        mLogo: {},
        mImgs: [],

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
      if (e.comId) {
        this.comId = Number(e.comId)
      }
      if (e.cateId) {
        this.cateId = Number(e.cateId)
      }
      if (e.isuId) {
        this.isuId = Number(e.isuId)
      }
    },
    onShow(e) {
      this.initData()
    },
    onPullDownRefresh() {
      const _that = this
      _that.initData()
      setTimeout(() => {
        // 停止下拉刷新
        uni.stopPullDownRefresh()
      }, 1000)
    },
    onReachBottom(e) {},
    computed: {
      ...mapGetters({
        sysInfo: 'app/sysInfo',
        localComm: 'app/localComm',
        uid: 'user/uid',
        locIsuPreUrl: 'app/locIsuPreUrl',
        locComPreUrl: 'app/locComPreUrl'
      })
    },
    created() {},
    mounted() {},
    watch: {},
    methods: {
      initData() {
        const _that = this
        isuCate.getIsuCateById(this.cateId).then((r) => {
          _that.infoCate = r
          _that.sCateName = r.cateName
        })

        _that.getDetail()
      },

      getDetail() {
        const _that = this
        const reqData = {
          cateId: this.cateId,
          comId: this.comId,
          isuId: this.isuId,
        }
        return isuDetail(reqData).then((res) => {
          if (res.code === 0) {
            const _res = res.data
            const {
              userLiveInfo,
              keyWords,
              dyFormData,
              speclFields,
              ...isuInfo
            } = {
              ..._res
            }
            if (isuInfo) {
              _that.isuInfoView = isuInfo

              if (isNotEmpty(isuInfo.title)) {
                if (isuInfo.title.length > 9) {
                  _that.pageTitle = isuInfo.title.substr(0, 9) + '...'
                } else {
                  _that.pageTitle = isuInfo.title
                }
              } else {
                _that.pageTitle = '小店详情'
              }

              if (isNotEmpty(isuInfo.imgUrls)) {
                const imgUrls = JSON.parse(isuInfo.imgUrls)

                _that.mImgs = []
                if (imgUrls && Array.isArray(imgUrls)) {
                  imgUrls.forEach((el) => {
                    if (el.key === 'mLogo') {
                      _that.mLogo = el
                    } else {
                      if (!_that.$util.isRemoteUrl(el.url)) {
                        el.url = _that.locIsuPreUrl + el.url
                      }
                      _that.mImgs.push(el)
                    }
                  })

                  if (!_that.mLogo) {
                    _that.mLogo = {
                      url: _that.imgBasePath + 'images/icon/weixinqun.png'
                    }
                  } else if (!_that.mLogo.url) {
                    _that.mLogo.url = _that.imgBasePath + 'images/icon/weixinqun.png'
                  } else if (!_that.$util.isRemoteUrl(_that.mLogo.url)) {
                    _that.mLogo.url = _that.locIsuPreUrl + _that.mLogo.url
                  }
                }
              }
            }
            if (isNotEmpty(keyWords)) {
              _that.keyWords = keyWords.split(',')
            }

            // 专有内容
            if (speclFields) {
              _that.spfs = speclFields
            }

            if (dyFormData) {
              const dyData = dyFormData
              if (dyData.bizDayTime) {
                _that.bizDayTime = JSON.parse(dyData.bizDayTime)
                _that.intervalInfoView()
              }
            }
          }
        })
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
              if (_that.spfs.runingStatus === 1) {
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
          1000 * 60 * 1
        )
      },

      readNumCount() {
        const _that = this
        isuReadCount({
          cateId: this.cateId,
          isuId: this.isuId
        }).then((res) => {
          if (res.code === 0) {
            _that.infoDetail.readCount = _that.infoDetail.readCount + 1
          }
        })
      },

      reload() {
        this.initData()
      },

      editIsuThis(flag) {
        const _that = this
        if (flag === 0) {
          _that.$uniUtil.tips({
            title: '重新编辑前请先暂停营业',
            endtime: 3000
          })
          return false
        }

        this.$Router.push({
          path: _that.infoCate.isuPagePath,
          query: {
            sCateId: _that.cateId,
            editType: 'edit',
            orgIsuId: _that.isuId
          }
        })
      },

      /**
       * 图片预览
       * @param {*} idx
       */
      previewImage(idx) {
        const _that = this
        uni.previewImage({
          current: idx, // 当前显示图片的http链接
          urls: _that.imgUrls // 需要预览的图片http链接列表
        })
      },

      /**
       * 拨打电话
       */
      makePhone(phone) {
        uni.makePhoneCall({
          phoneNumber: phone
        })
      },

      /**
       * 更换营业状态
       */
      chgRunStatus(v) {
        const _that = this
        if (v !== 0 && v !== 1) {
          return false
        }

        const specl = {
          runingStatus: v
        }

        const reqVo = {
          isuId: _that.isuId,
          comId: _that.comId,
          isuCateId: _that.cateId,
          specl: JSON.stringify(specl)
        }
        isuUpdSpecl(reqVo).then((res) => {
          if (res.code === 0) {
            const _res = res.data
            if (_res) {
              _that.getDetail()
            } else if (res.msg) {
              _that.$uniUtil.error(res.msg)
            }
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .detail-box {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .body {
      flex: 1;
      height: calc(100% - 60rpx);
      overflow-x: hidden;
      overflow-y: hidden;
      margin: 10rpx 15rpx 60px 15rpx;

      .detail {
        background-color: #fff;

        .m-header {
          display: flex;
          justify-content: space-between;

          .title-box {
            width: 500rpx;
            padding: 15rpx 18rpx;

            .title {
              font-size: 36rpx;
              font-weight: 700;
            }

            .biz-status {
              margin: 20rpx 0;
              width: 150rpx;
              color: #fff;
              text-align: center;
              padding: 10rpx;
              border-radius: 10rpx;
            }

            .biz-run {
              background-color: #19be6b;
            }

            .biz-rest {
              background-color: #c8c9cc;
            }

            .biz-stop {
              background-color: #1135a3;
            }

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

          .logo {
            width: 200rpx;

            .mlogo {
              width: 200rpx;
              height: 200rpx;
            }
          }
        }

        .content {
          padding: 15rpx 18rpx;
          font-size: 32rpx;
        }

        .imgs {
          margin: 10rpx 15rpx;

          .imgview {
            margin-bottom: 5rpx;

            .mimg {
              border-radius: 5rpx;
              width: 100%;
            }
          }
        }

        .info-fields {
          margin: 20rpx 0;
          border-radius: 10rpx;

          .col {
            display: flex;
            justify-content: space-between;
            line-height: 50rpx;
            min-height: 50rpx;
            background: #fff;
            border-bottom: 1px dashed #f5f5f5;
            font-size: 33rpx;
            padding: 15rpx 28rpx;

            .title {
              width: 150rpx;
              font-weight: 600;

              &::after {
                content: ':';
              }
            }

            .form-input {
              flex: 1;
              margin-left: 20rpx;

              .field {
                margin-left: 10rpx;
              }

              .money {
                color: #ff9900;
                font-size: 48rpx;
              }
            }

            .op-btn {
              width: 200rpx;
              height: 56rpx;
              line-height: 56rpx;
              font-size: 28rpx;
              text-align: center;
              color: #fff;
              border-radius: 5%;
              padding: auto 10rpx;
              margin: auto 20rpx;
            }

            .call-phone {
              width: 200rpx;
              height: 56rpx;
              line-height: 56rpx;
              background-color: #e83323;
              font-size: 28rpx;
              text-align: center;
              color: #fff;
              border-radius: 5%;
              padding: auto 10rpx;
              margin: auto 20rpx;
            }

            .add-reward {
              width: 160rpx;
              border-radius: 10%;
              background-color: #18b566;
              margin-left: 40rpx;
            }
          }
        }
      }
    }

    .footer {
      width: 100%;
      height: 100rpx;
      background-color: #fff;
      padding: 0 30rpx;
      font-size: 28rpx;
      color: #333;
      box-sizing: border-box;
      position: fixed;
      bottom: 0;
      left: 0;

      .op {
        display: flex;
        justify-content: flex-end;
        margin-top: 20rpx;

        .stat-txt {
          margin-right: 50rpx;
        }

        .op-btn {
          font-size: 28rpx;
          color: #fff;
          min-width: 150rpx;
          height: 65rpx;
          line-height: 65rpx;
          background-color: $theme-color;
          border-radius: 40rpx;
          text-align: center;
          margin-right: 10rpx;
          padding: 0 20rpx;
        }

        .op-btn.disabled {
          background-color: #c8c9cc;
          color: #fff;
        }

        .op-btn.cancel {
          background-color: #3c9cff;
        }
      }
    }
  }
</style>