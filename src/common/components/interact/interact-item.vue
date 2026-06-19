<!--
* @Description: 互动列表项组件
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-19 16:44:46
* @LastEditors: wangxc
* @LastEditTime: 2024-04-19 16:44:46
-->
<template>
  <view class="interact-item-box">
    <view class="auth-line">
      <view class="avator">
        <image class="avatar" src="/static/images/logo/f.png" mode=""></image>
      </view>
      <view class="auth">
        <view class="auth-name">{{ interact.userLiveInfo.userInfo.nickName }}</view>
        <view class="auth-time">{{ timeAgo }}</view>
      </view>
    </view>
    <view class="content">
      <view class="text" @click="gotoFull">
        <text>{{ showText }}</text>
        <text v-if="isShowAll" class="fullText"> 全文 </text>
      </view>
      <view class="img">
        <view class="pic" v-for="item in imgUrls" :key="item.key">
          <image :src="`${item.url}`" mode="scaleToFill"></image>
        </view>
      </view>
    </view>
    <view class="item-opera">
      <view class="opa-note uni-icons uniui-redo">转发</view>
      <view class="opa-note uni-icons uniui-chat" @click="gotoFull">{{ interact.commentCount > 0 ? interact.commentCount + '' : '评论' }}</view>
      <view class="opa-note uni-icons" :class="{ 'uniui-hand-up': reply.isUserPraise !== 1, 'uniui-hand-up-filled': reply.isUserPraise === 1 }" @click="praOrOppse(4)">{{
        reply.praiseCount > 0 ? reply.praiseCount + '' : '赞'
      }}</view>
      <view class="opa-note uni-icons uniui-eye">{{ interact.readCount || 0 }}</view>
    </view>
    <view class="talk-about" v-if="interact && interact.replyList && interact.replyList.length">
      <view class="talk-item" v-for="(item, index) in interact.replyList" :key="index">
        <text class="talk-name">{{ item.userLiveInfo.userInfo.nickName }}</text>
        <text class="talk-txt">{{ item.replyTxt }}</text>
      </view>
      <view class="read-all myicon icon-xiangyou1-a" @click="gotoFull"> 查看全部评论 </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { isNotEmpty } from '@/utils/validate'
import { isuPraOrOpp } from '@/api/isuForm'
import { isuReplyCount } from '@/api/isuQuery'

export default {
  name: 'interactItem',
  components: {},
  props: {
    rectRpxWidth: {
      type: Number,
      default: 750
    },
    interact: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      originalText: '示例：说两句吧',
      showText: '',
      timeAgo: '',
      maxShowCharCount: 20 * 3 - 6,
      isShowAll: false,
      // 信息附件图片
      imgUrls: [],

      // 信息响应
      reply: {
        praiseCount: 0,
        opposeCount: 0,
        isUserPraise: 0,
        isUserOppose: 0
      }
    }
  },
  computed: {
    ...mapGetters({
      localComm: 'app/localComm',
      locIsuPreUrl: 'app/locIsuPreUrl',
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
      const rectRpxWidth = this.rectRpxWidth - 40
      const textLineCharNum = Math.floor(rectRpxWidth / 33) // 每行字数
      this.maxShowCharCount = textLineCharNum * 3 - 6

      this.replyCount()
    },
    getShowText() {
      if (this.interact) {
        this.originalText = this.interact.content
        this.timeAgo = this.$util.timeAgo(this.interact.isuTime)

        if (isNotEmpty(this.interact.imgUrls)) {
          this.imgUrls = JSON.parse(this.interact.imgUrls)
        }
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
      this.$Router.push({
        name: 'interactMain',
        params: {
          isuId: _that.interact.isuId,
          cateId: _that.interact.cateId,
          comId: _that.localComm.comm.comId
        }
      })
    },
    // 点赞或取消点赞, 反对或取消反对
    praOrOppse(rpyType) {
      const _that = this
      const req = {
        isuCateId: _that.interact.cateId,
        isuId: _that.interact.isuId,
        comId: _that.interact.comId,
        uid: _that.uid,
        replyType: rpyType, // 4-点赞,5-反对
        commReplyId: -1,
        tagReplyId: -1,
        isReplyCancel: _that.reply.isUserPraise === 1 ? 1 : 0
      }

      if (rpyType === 4) {
        req.isReplyCancel = _that.reply.isUserPraise === 1 ? 1 : 0
      } else if (rpyType === 5) {
        req.isReplyCancel = _that.reply.isUserOppose === 1 ? 1 : 0
      }

      isuPraOrOpp(req).then((res) => {
        if (res.code === 0) {
          _that.replyCount()
        }
      })
    },

    // 统计点赞或反对数
    replyCount() {
      const _that = this
      const req = {
        isuCateId: _that.interact.cateId,
        isuId: _that.interact.isuId,
        comId: _that.interact.comId,
        uid: _that.uid,
        commReplyId: -1,
        tagReplyId: -1
      }

      isuReplyCount(req).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          _that.reply = {
            praiseCount: _res.praiseCount,
            opposeCount: _res.opposeCount,
            isUserPraise: _res.isUserPraise,
            isUserOppose: _res.isUserOppose
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.interact-item-box {
  background: #fff;
  padding: 20rpx;

  .auth-line {
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

    .uniui-hand-up-filled,
    .uniui-hand-down-filled {
      &::before {
        color: deeppink;
      }
    }
  }

  .talk-about {
    margin: 20rpx 0;

    .talk-item {
      margin: 20rpx 0;
      font-size: 28rpx;

      .talk-name {
        font-weight: 700;

        &::after {
          content: ': ';
        }
      }

      .talk-txt {
        padding: 0 20rpx;
      }
    }

    .read-all {
      font-size: 28rpx;
      color: blue;
    }
  }
}
</style>
