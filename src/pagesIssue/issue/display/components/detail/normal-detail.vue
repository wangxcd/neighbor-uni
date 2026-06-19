<!--
* @Description: 信息详情-通用型
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-07-10 21:15:26
* @LastEditors: wangxc
* @LastEditTime: 2024-07-10 21:15:26
-->
<template>
  <view class="normal-detail-box">
    <view class="article-sec">
      <view class="auth-line-a">
        <view class="left">
          <view class="avator">
            <image class="avatar" v-if="isuUserInfo.avatarUrl" :src="isuUserInfo.avatarUrl" mode=""></image>
            <image class="avatar" v-else src="/static/images/logo/f.png" mode=""></image>
          </view>
          <view class="auth">
            <view class="auth-name">{{ isuUserInfo.nickName }}</view>
            <view class="auth-time">{{ $util.timeAgo(isuInfoView.isuTime) }}</view>
          </view>
        </view>
        <view class="right">
          <view class="auth-op">
            <interestBtn tagUserId="isuUserInfo.uid"></interestBtn>
          </view>
        </view>
      </view>
      <view class="content">
        <view class="text">
          <text>{{ isuInfoView.content }}</text>
        </view>
        <view class="img" v-if="imgUrls && imgUrls.length > 0">
          <template v-if="odd === 0">
            <u-swiper :list="imgUrls" mode="number" indicator-pos="bottomRight" img-mode="aspectFit" autoplay="false" @click="previewImage"></u-swiper>
          </template>
          <template v-else>
            <view class="pic" v-for="item in imgUrls" :key="item.key">
              <image :src="`${item.url}`" mode="widthFix"></image>
            </view>
          </template>
        </view>
      </view>
      <view class="tags">
        <view class="addr">
          <text v-if="isuInfoView.buildPark">{{ isuInfoView.buildPark }}</text>
          <text v-if="isuInfoView.buildNo">{{ isuInfoView.buildNo }}楼</text>
          <text v-if="isuInfoView.buildUnit">{{ isuInfoView.buildUnit }}单元</text>
        </view>
      </view>
      <view class="info-fields">
        <view class="col" v-if="isuInfoView.contactMan">
          <view class="title">联系人</view>
          <view class="form-input">{{ isuInfoView.contactMan }}</view>
        </view>
        <view class="col" v-if="isuInfoView.phone">
          <view class="title">电话</view>
          <view class="form-input">{{ isuInfoView.phone }}</view>
          <view class="call-phone" v-if="isuInfoView.isIsuer === 0" @click="makePhone(isuInfoView.phone)">
            <text class="myicon icon-c002dianhua">拨打电话</text>
          </view>
        </view>
        <view class="col" v-if="isuInfoView.buildPark || isuInfoView.buildNo || isuInfoView.buildUnit">
          <view class="title">位置</view>
          <view class="form-input">
            <text v-if="isuInfoView.buildPark">{{ isuInfoView.buildPark }}园区</text>
            <text class="field" v-if="isuInfoView.buildNo">{{ isuInfoView.buildNo }}楼</text>
            <text class="field" v-if="isuInfoView.buildUnit">{{ isuInfoView.buildUnit }}单元</text>
            <text class="field" v-if="isuInfoView.buildRoom">{{ isuInfoView.buildRoom }}室</text>
          </view>
        </view>
        <view class="col" v-for="(value, key) in dyData" :key="key">
          <view class="title">{{ value.label }}</view>
          <view class="form-input">{{ value.val }}</view>
        </view>
      </view>
    </view>

      <view class="audit-status">
        <view class="audit-ing" v-if="isuInfoView.status === 2 && isuInfoView.auditStatus === 0">
          <view class="result">
            <text class="desc">内容正在审核中...</text>
          </view>
        </view>
        <view class="audit-refuse" v-else-if="isuInfoView.status === 3 && (isuInfoView.auditStatus === 2 || isuInfoView.auditStatus === 4)">
          <view class="result">
            <text class="desc">内容审核不通过</text>
          </view>
          <view class="memo" v-if="isuInfoView.auditExplain">
            <text class="lab">不通过原因</text>
            <text class="desc">{{ isuInfoView.auditExplain || ''}}</text>
          </view>
        </view>
      </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { isNotEmpty } from '@/utils/validate'

export default {
  name: 'normal-detail',
  components: {},
  props: {
    infoDetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      infoData: {},

      // 原信息
      isuInfoView: {},
      isuUserInfo: {},
      commLive: {},

      // 信息附件图片
      imgUrls: [],

      odd: 0 // 随机奇偶数
    }
  },
  computed: {
    ...mapGetters({
      sysInfo: 'app/sysInfo',
      localComm: 'app/localComm',
      uid: 'user/uid',
      isLogin: 'user/isLogin',
      locIsuPreUrl: 'app/locIsuPreUrl',
      locComPreUrl: 'app/locComPreUrl'
    })
  },
  created() {},
  mounted() {},
  watch: {
    infoDetail: {
      handler: function (newVal) {
        this.infoData = newVal
        this.init()
      },
      deep: true
    }
  },
  methods: {
    init() {
      const _that = this
      if (this.infoData) {
        const { userLiveInfo, ...isuInfo } = { ...this.infoData }
        if (isuInfo) {
          _that.isuInfoView = isuInfo

          if (isNotEmpty(isuInfo.imgUrls)) {
            const infoImgs = JSON.parse(isuInfo.imgUrls)
            this.imgUrls = infoImgs.map((el) => {
              if (!this.$util.isRemoteUrl(el.url) && this.$util.startWith(el.url, 'f/')) {
                return _that.locIsuPreUrl + el.url
              } else {
                return el.url
              }
            })
          }
        }
        if (userLiveInfo) {
          const { userInfo, commLive } = { ...userLiveInfo }
          _that.isuUserInfo = userInfo
          _that.commLive = commLive
          if (_that.isuUserInfo) {
            const avatarUrl = _that.isuUserInfo.avatarUrl
            if (avatarUrl && !this.$util.isRemoteUrl(avatarUrl) && this.$util.startWith(avatarUrl, 'f/')) {
              this.isuUserInfo.avatarUrl = this.locComPreUrl + avatarUrl
            }
          }
        }

        debuger
        const odd = Math.floor(Math.random() * (2))
        _that.odd = odd
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.normal-detail-box {
  .article-sec {
    padding: 10px;
    background: #fff;
    margin-bottom: 20rpx;

    .auth-line-a {
      display: flex;
      justify-content: space-between;
      padding: 0 20rpx;

      .left {
        display: flex;

        .avator {
          width: 80rpx;
          height: 80rpx;

          image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        .auth {
          margin-left: 20rpx;

          .auth-name {
            font-size: 28rpx;
            font-weight: 700;
          }

          .auth-time {
            font-size: 20rpx;
            margin: 10rpx 0;
          }
        }
      }
      .right {
        .auth-op {
        }
      }
    }

    .content {
      margin: 20rpx 0;

      .text {
        font-size: 33rpx;
      }

      .img {
        margin: 20rpx 0;

        .pic {
          width: 700rpx;
          margin: 20rpx 0;

          image {
            max-width: 576rpx;
            height: auto;
            border-radius: 4%;
          }
        }
      }
    }

    .tags {
      .addr {
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
      }
    }
  }

    .audit-status {
      padding: 8rpx 12rpx;

      .audit-ing {
        .result {
          .desc {
            color: #e2ac49;
          }
        }
      }

      .audit-refuse {
        .result {
          .desc {
            color: #ec4542;
          }
        }

        .memo {
          .lab {
            &::after {
              content: ': ';
            }
          }

          .desc {
            color: #612bb6;
          }
        }
      }
    }
}
</style>
