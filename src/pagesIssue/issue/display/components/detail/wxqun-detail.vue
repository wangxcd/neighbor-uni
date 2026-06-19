<!--
* @Description: 微信群详情
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-07-11 13:14:32
* @LastEditors: wangxc
* @LastEditTime: 2024-07-11 13:14:32
-->
<template>
  <view class="wxqun-detail-box">
    <view class="article-sec">
      <view class="info-header">
        <view class="left">
          <view class="avator">
            <image class="avatar" :src="imgLogo.url" mode=""></image>
          </view>
        </view>
        <view class="right">
          <view class="title">{{ isuInfoView.title }}</view>
          <view class="note">
            <view class="auth-name">发布人: {{ isuUserInfo.nickName }}</view>
            <view class="isu-time">发布时间：{{ $util.timeAgo(isuInfoView.isuTime) }}</view>
          </view>
          <view class="info-op">
            <interestBtn tagUserId="isuUserInfo.uid"></interestBtn>
          </view>
        </view>
      </view>
      <view class="info-body">
        <view class="col" v-if="dyData.mgrWeixin">
          <view class="title">群主微信</view>
          <view class="form-input">{{ dyData.mgrWeixin }}</view>
        </view>
        <view class="col" v-if="dyData.joinKnows">
          <view class="title">加群须知</view>
          <view class="form-input">{{ dyData.joinKnows }}</view>
        </view>
        <view class="col2">
          <view class="title">群简介</view>
          <view class="content">
            <text>{{ isuInfoView.content }}</text>
          </view>
        </view>
        <view class="img">
          <view class="pic">
            <image :src="imgMgQr.url" mode="widthFix" @longpress="handleLongPress(imgMgQr.url)"></image>
            <view class="title">群主二维码</view>
          </view>
          <view class="pic">
            <image :src="imgQunQr.url" mode="widthFix" @longpress="handleLongPress(imgQunQr.url)"></image>
            <view class="title">群二维码</view>
          </view>
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
  name: 'wxqun-detail',
  components: {},
  props: {
    infoDetail: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      imgBasePath: this.$config.HTTP_REQUEST_URL + '/api/pcom/',

      infoData: {},
      // 原信息
      isuInfoView: {},
      isuUserInfo: {},
      commLive: {},
      dyData: {},

      // 信息附件图片
      imgLogo: '',
      imgMgQr: '',
      imgQunQr: ''
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
        const { userLiveInfo, dyFormData, ...isuInfo } = { ...this.infoData }
        if (isuInfo) {
          _that.isuInfoView = isuInfo

          if (isNotEmpty(isuInfo.imgUrls)) {
            const imgUrls = JSON.parse(isuInfo.imgUrls)
            if (imgUrls && Array.isArray(imgUrls)) {
              this.imgLogo = imgUrls.find((el) => el.key === 'qLogo')
              this.imgMgQr = imgUrls.find((el) => el.key === 'mgQr')
              this.imgQunQr = imgUrls.find((el) => el.key === 'qunQr')
              if (!this.imgLogo) {
                this.imgLogo = { url: this.imgBasePath + 'images/icon/weixinqun.png' }
              } else {
                if (!this.$util.isRemoteUrl(this.imgLogo.url)) {
                  this.imgLogo.url = this.locIsuPreUrl + this.imgLogo.url
                }
              }
            }
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

        if (dyFormData) {
          _that.dyData = dyFormData
        }
      }
    },
    handleLongPress(e) {
      uni.previewImage({
        urls: [e],
        longPressActions: {
          itemList: ['发送给朋友', '保存图片', '收藏'],
          success: (res) => {
            console.log(res)
          },
          fail: (res) => {
            console.log(res.errMsg)
          }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.wxqun-detail-box {
  .article-sec {
    padding: 10px;
    background: #fff;
    margin-bottom: 20rpx;

    .info-header {
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
      }
      .right {
        margin-left: 20rpx;

        .title {
          width: 580rpx;
          font-size: 33rpx;
          color: #606266;
          font-weight: 600;
          white-space: pre-wrap;
        }
        .note {
          margin-top: 10rpx;
          color: #909399;
          font-size: 28rpx;
          display: flex;

          .isu-time {
            margin-left: 30rpx;
          }
        }
      }
    }

    .info-body {
      margin: 20rpx 0;
      .col {
        display: flex;
        justify-content: space-between;
        line-height: 80rpx;
        background: #fff;
        border-bottom: 1px solid #f5f5f5;
        font-size: 33rpx;

        .title {
          width: 150rpx;

          &::after {
            content: ':';
          }
        }
        .form-input {
          flex: 1;
          margin-left: 20rpx;
        }
      }

      .col2 {
        line-height: 80rpx;
        background: #fff;
        border-bottom: 1px solid #f5f5f5;
        font-size: 33rpx;

        .bottom-line {
          border-bottom: 2rpx solid #eeeeee;
        }
        .title {
          font-weight: 600;
        }

        .content {
          text-indent: 2em;
          line-height: 50rpx;
        }
      }

      .img {
        margin: 20rpx 0;
        display: flex;
        justify-content: space-between;

        .pic {
          width: 360rpx;
          margin: 20rpx 0;
          text-align: center;

          image {
            max-width: 280rpx;
            height: auto;
          }
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
