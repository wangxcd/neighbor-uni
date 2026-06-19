<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-07-10 22:26:38
* @LastEditors: wangxc
* @LastEditTime: 2024-07-10 22:26:38
-->
<template>
  <view class="wxqun-item-box">
    <view class="item-header">
      <view class="header-left">
        <view class="avator">
          <image class="avatar" :src="imgLogo.url" mode=""></image>
        </view>
        <view class="auth">
          <view class="auth-time">{{ timeAgo }}</view>
        </view>
      </view>
      <view class="header-right" @click="gotoFull">
        <view class="title">{{ info.title }}</view>
        <view class="content">
          <text>{{ showText }}</text>
        </view>
      </view>
    </view>
    <view class="content">
      <view class="img">
        <view class="pic">
          <image :src="`${imgMgQr.url}`" mode="scaleToFill" @longpress="handleLongPress(imgMgQr.url)"></image>
          <view class="title">群主二维码</view>
        </view>
        <view class="pic">
          <image :src="imgQunQr.url" mode="scaleToFill" @longpress="handleLongPress(imgQunQr.url)"></image>
          <view class="title">群二维码</view>
        </view>
      </view>
    </view>
    <view class="sub-line">
      <view class="sub-left">
        <view class="info-cate">{{ infoCate.cateTitle }}</view>
        <view class="gap-left isu-time">{{ timeAgo }}</view>
        <view class="gap-left isu-op"></view>
      </view>
      <view class="sub-right">
        <view v-if="info.phone" class="call-phone" @click="makePhone(info.phone)">
          <text class="myicon icon-c002dianhua">拨打电话</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { isNotEmpty } from '@/utils/validate'
import isuCate from '@/libs/isucate'
import consdef from '@/common/js/constant/consdef.js'

export default {
  name: 'wxqun-item',
  components: {},
  props: {
    rectRpxWidth: {
      type: Number,
      default: 750
    },
    /* mCateName: {
      type: String,
      default: ''
    }, */
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      imgBasePath: this.$config.HTTP_REQUEST_URL + '/api/pcom/',

      infoCate: {},
      originalText: '',
      showText: '',
      timeAgo: '',
      maxShowCharCount: 20 * 3 - 6,
      isShowAll: false,
      // 信息附件图片
      imgLogo: '',
      imgMgQr: '',
      imgQunQr: '',

      infoStatus: {
        ...consdef.issue.infoStatus
      }
    }
  },
  onLoad(e) {
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
  created() {},
  mounted() {
    this.init()
    this.initInfo()
    this.getShowText()
  },
  watch: {},
  methods: {
    init() {
      const rectRpxWidth = this.rectRpxWidth - 40
      const textLineCharNum = Math.floor(rectRpxWidth / 28) // 每行字数
      this.maxShowCharCount = textLineCharNum * 2 - 6
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
          if (infoImgs && Array.isArray(infoImgs)) {
            infoImgs.forEach((el) => {
              if (el.url && !_that.$util.isRemoteUrl(el.url) && _that.$util.startWith(el.url, 'f/')) {
                el.url = _that.locIsuPreUrl + el.url
              }
              if (el.key === 'qLogo') {
                _that.imgLogo = el
              } else if (el.key === 'mgQr') {
                _that.imgMgQr = el
              } else if (el.key === 'qunQr') {
                _that.imgQunQr = el
              }
            })
          }

          if (!_that.imgLogo || !_that.imgLogo.url) {
            _that.imgLogo = { url: _that.imgBasePath + 'images/icon/weixinqun.png' }
          }
        }
      }
    },

    getShowText() {
      if (this.info) {
        this.originalText = this.info.content
        this.timeAgo = this.$util.timeAgo(this.info.isuTime)
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
    gotoFull() {
      const _that = this
      // 非发布者本人不能看到已下架、已过期的信息
      if (_that.uid != _that.info.uid && (_that.info.status === _that.infoStatus.PULL || _that.info.status === _that.infoStatus.EXPIRE)) {
        this.$uniUtil.tips({
          title: _that.info.status === _that.infoStatus.PULL ? '信息已下架' : '信息已过期'
        })
        return false
      }
      
      this.$Router.push({
        name: 'isuInfoDetail',
        params: {
          isuId: _that.info.isuId,
          cateId: _that.info.cateId,
          // mCateName: _that.mCateName,
          comId: _that.localComm.comm.comId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wxqun-item-box {
  background: #fff;
  padding: 20rpx;
  border-radius: 3%;

  .item-header {
    display: flex;

    .header-left {
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

    .header-right {
      margin-left: 20rpx;

      .title {
        width: 580rpx;
        font-size: 33rpx;
        color: #606266;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .content {
        font-size: 28rpx;
        color: #909399;
      }
    }
  }

  .content {
    margin: 20rpx 0;

    .text {
      font-size: 33rpx;

      .fullText {
        padding: 1em;
        color: dodgerblue;
      }
    }

    .img {
      display: flex;
      justify-content: flex-start;
      margin: 10rpx 80rpx;

      .pic {
        width: 180rpx;
        height: 210rpx;
        text-align: center;

        image {
          width: 160rpx;
          height: 160rpx;
        }
        .title {
          margin-top: 10rpx;
          font-size: 28rpx;
        }
      }
    }
  }

  .sub-line {
    display: flex;
    justify-content: space-between;
    padding: 10rpx 20rpx 20rpx 20rpx;
    font-size: 28rpx;

    .sub-left {
      display: flex;

      .gap-left {
        margin-left: 20rpx;
      }

      .info-cate {
        color: #f29100;
      }
    }
    .sub-right {
      .call-phone {
        background-color: #e83323;
        font-size: 28rpx;
        text-align: center;
        color: #fff;
        border-radius: 5%;
        padding: 10rpx;
      }
    }
  }

  .item-opera {
    margin: 20rpx 0;
    display: flex;
    justify-content: space-between;
    font-size: 40rpx;

    .opa-note {
      font-size: 32rpx;
      &::before {
        font-size: 42rpx;
        vertical-align: middle;
      }
    }
  }
}
</style>
