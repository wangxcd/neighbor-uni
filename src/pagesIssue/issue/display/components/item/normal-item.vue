<!--
* @Description: 一般类型的信息项
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-06-28 08:51:34
* @LastEditors: wangxc
* @LastEditTime: 2024-06-28 08:51:34
-->
<template>
  <view class="normal-item-box">
    <view class="item-header">
      <view class="header-left flex">
        <view class="avator">
          <image class="avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" mode=""></image>
          <image class="avatar" v-else src="static/images/logo/f.png" mode=""></image>
        </view>
        <view class="auth">
          <view class="auth-name">{{ userInfo.nickName }}</view>
          <view class="auth-time">{{ timeAgo }}</view>
        </view>
      </view>
      <view class="header-right" @click="gotoFull">
        <view>{{ infoCate.cateTitle }}</view>
      </view>
    </view>
    <view class="content">
      <view class="text" @click="gotoFull">
        <text v-if="info.title">{{ info.title }}</text>
        <text v-else>{{ showText }}</text>
      </view>
      <view class="img">
        <view class="pic" v-for="item in imgUrls" :key="item.key">
          <image :src="item" mode="scaleToFill"></image>
        </view>
      </view>
    </view>
    <view class="item-opera">
      <view class="opa-note uni-icons uniui-redo">转发</view>
      <view class="opa-note uni-icons uniui-chat" @click="gotoFull">{{ info.commentCount > 0 ? info.commentCount + '' : '评论' }}</view>
      <view class="opa-note uni-icons uniui-hand-up">5</view>
      <view class="opa-note uni-icons uniui-eye">{{ info.readCount || 0 }}</view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { isNotEmpty } from '@/utils/validate'
import isuCate from '@/libs/isucate'
import consdef from '@/common/js/constant/consdef.js'

export default {
  name: 'normal-item',
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
  created() {
    this.init()
  },
  mounted() {
    this.getShowText()
  },
  watch: {},
  methods: {
    init() {
      const _that = this
      const rectRpxWidth = this.rectRpxWidth - 40
      const textLineCharNum = Math.floor(rectRpxWidth / 33) // 每行字数
      this.maxShowCharCount = textLineCharNum * 3 - 6
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
.normal-item-box {
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
      margin: 10rpx 0;

      .pic {
        width: 216rpx;
        height: 236rpx;

        image {
          width: 100%;
          height: 100%;
          border-radius: 4%;
        }
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
