<!--
* @Description: 生活服务类列表项显示
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-07-12 09:59:44
* @LastEditors: wangxc
* @LastEditTime: 2024-07-12 09:59:44
-->
<template>
  <view class="shfw-item-box">
    <template v-if="imgUrls.length > 0">
      <view class="body flex">
        <view class="info-left" @click="gotoFull">
          <view class="logo-img">
            <image :src="imgUrls[0]" mode="scaleToFill"></image>
          </view>
        </view>
        <view class="info-right">
          <view class="info-txt" @click="gotoFull">
            <view class="info-title">{{ info.title }}</view>
            <view class="info-content">{{ showText }}</view>
          </view>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="body">
        <view class="item-header">
          <view class="header-left flex">
            <view class="avator">
              <image class="avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" mode=""></image>
              <image class="avatar" v-else src="/static/images/logo/f.png" mode=""></image>
            </view>
            <view class="auth">
              <view class="auth-name">{{ userInfo.nickName }}</view>
            </view>
          </view>
          <view class="header-right" @click="gotoFull"></view>
        </view>
        <view class="content">
          <view v-if="info.title" class="title" @click="gotoFull">{{ info.title }}</view>
          <view class="text" @click="gotoFull">
            <text>{{ showText }}</text>
          </view>
        </view>
      </view>
    </template>

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
  name: 'shfw-item',
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
      infoCate: {},
      originalText: '',
      showText: '',
      timeAgo: '',
      maxShowCharCount: 20 * 3 - 6,
      isShowAll: false,
      // 信息附件图片
      imgUrls: [],
      userInfo: {},

      infoStatus: {
        ...consdef.issue.infoStatus
      }
    }
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

        this.userInfo = { ...this.info.userLiveInfo.userInfo }
        const avatarUrl = this.userInfo.avatarUrl
        if (avatarUrl && !this.$util.isRemoteUrl(avatarUrl) && this.$util.startWith(avatarUrl, 'f/')) {
          this.userInfo.avatarUrl = this.locComPreUrl + avatarUrl
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
.shfw-item-box {
  background-color: #fff;
  margin: 10rpx 0;

  .body {
    margin: 10rpx;
    padding: 10rpx;

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

      .info-txt {
        .info-title {
          font-size: 33rpx;
          color: #606266;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .info-content {
          font-size: 28rpx;
          color: #909399;
          margin-top: 10rpx;
        }
      }
    }

    .item-header {
      display: flex;
      padding: 10rpx;

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
          display: flex;
          align-items: center;

          .auth-name {
            font-size: 28rpx;
            font-weight: 700;
          }
        }
      }

      .header-right {
        margin-left: 20rpx;
      }
    }

    .content {
      margin: 20rpx 0;

      .title {
        font-size: 33rpx;
        color: #606266;
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
}
</style>
