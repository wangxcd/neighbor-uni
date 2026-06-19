<!--
* @Description: 评论列表项-a类组件
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-21 15:52:54
* @LastEditors: wangxc
* @LastEditTime: 2024-04-21 15:52:54
-->
<template>
  <view class="comment-item-box">
    <view class="auth-avtar">
      <image src="/static/images/logo/f.png" mode=""></image>
    </view>
    <view class="content">
      <view class="auth-line-b">
        <view class="auth flex start">
          <view class="auth-name mr10">{{ userInfo.nickName }}</view>
          <view class="auth-time mr10">{{ $util.timeAgo(commentInfo.replyTime) }}</view>
          <view class="auth-addr mr10">4#楼</view>
        </view>
      </view>
      <view class="replay" @click="gotoReply">
        <view class="text">
          <text>{{ showText }}</text>
          <text v-if="isShowAll" class="fullText"> 全文 </text>
        </view>
      </view>
      <view class="op-line flex space">
        <view class="op-reply" @click="gotoReply">
          <text v-if="commentInfo.respCount > 0" class="count">
            {{ commentInfo.respCount }}
          </text>
          <text class="reply myicon icon-xiangyou1-a">回复</text>
        </view>
        <view class="op-vote flex around">
          <view class="agree uni-icons" title="赞" :class="{ 'uniui-hand-up': op.isUserPraise !== 1, 'uniui-hand-up-filled': op.isUserPraise === 1 }" @click="praOrOppse(4)">
            <text v-if="op.praiseCount > 0">
              {{ op.praiseCount }}
            </text>
            <text v-else>赞</text>
          </view>
          <view class="oppose uni-icons" title="踩" :class="{ 'uniui-hand-down': op.isUserOppose !== 1, 'uniui-hand-down-filled': op.isUserOppose === 1 }" @click="praOrOppse(5)">
            <text v-if="op.opposeCount > 0">
              {{ op.opposeCount }}
            </text>
            <text v-else>踩</text>
          </view>
        </view>
      </view>
      <view v-if="reply.replyNum > 0" class="reply-list ft16">
        <view class="reply-item" v-for="(item, idx) in reply.replyList" :key="idx">
          <view v-if="idx < 1" class="reply-first">
            <text class="reply-name">{{ item.userInfo.nickName }}</text>
            <text class="is-author" v-if="item.isAuthor"> 作者 </text>
            <text class="reply-text">{{ item.showContent }}</text>
          </view>
        </view>
        <view v-if="commentInfo.respCount > 1" class="v-all" @click="gotoReply">
          <text>查看全部</text>
          <text>{{ commentInfo.respCount }}</text>
          <text class="myicon icon-xiangyou1-a">条回复</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

import { isuPraOrOpp } from '@/api/isuForm'
import { isuReplyCount } from '@/api/isuQuery'

export default {
  name: 'comment-item',
  components: {},
  props: {
    rectRpxWidth: {
      type: Number,
      default: 750
    },
    isuComment: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      commentInfo: {}, // 评论
      userInfo: {}, // 评论人
      commLive: {}, // 评论人住所

      showText: '',
      maxShowCharCount: 20 * 3 - 6,
      maxReplyCharCount: 20 * 2,
      isShowAll: false,
      op: {
        replyNum: 0,

        praiseCount: 0,
        opposeCount: 0,

        isUserPraise: 0,
        isUserOppose: 0
      },
      reply: {
        replyNum: 0,
        replyList: []
      }
    }
  },
  computed: {
    ...mapGetters({
      localComm: 'app/localComm',
      uid: 'user/uid'
    })
  },
  created() {
    this.init()
  },
  mounted() {
    const _that = this
    _that.reply.replyNum = 0
    if (this.isuComment) {
      const { userLiveInfo, replyList, ...commentInfo } = { ...this.isuComment }
      if (commentInfo) {
        this.commentInfo = commentInfo
      }
      if (userLiveInfo) {
        const { userInfo, commLive } = { ...userLiveInfo }
        this.userInfo = userInfo
        this.commLive = commLive
      }

      if (replyList) {
        const rpList = replyList.map((el) => {
          return _that.getReplyInfo(el)
        })
        this.reply.replyList = rpList
        this.reply.replyNum = rpList.length
      }
    }
    // 评论项文本截取
    this.getShowText()
    this.getShowReply()
    this.replyCount()
  },
  watch: {},
  methods: {
    getReplyInfo(rp) {
      const { userLiveInfo, ...replyInfo } = { ...rp }
      let rply = {
        rpInfo: replyInfo
      }
      if (userLiveInfo) {
        const { userInfo, commLive } = { ...userLiveInfo }
        rply.userInfo = userInfo
        rply.commLive = commLive
      }
      return rply
    },

    init() {
      const avtarW = 80
      const rectRpxWidth = this.rectRpxWidth - 40 - avtarW
      const textLineCharNum = Math.floor(rectRpxWidth / 33) // 每行字数
      this.maxShowCharCount = textLineCharNum * 3 - 6
      if (!this.isuComment) {
        return
      }

      // 回复部分截取
      const recReplyRpxW = rectRpxWidth - 40
      const replyLinCharNum = Math.floor(recReplyRpxW / 33)
      const maxReplyCharCount = replyLinCharNum * 2
      this.maxReplyCharCount = maxReplyCharCount
    },

    getShowText() {
      const charCount = this.$util.countChars(this.commentInfo.replyTxt)
      if (charCount > this.maxShowCharCount) {
        this.showText = this.commentInfo.replyTxt.substr(0, this.maxShowCharCount) + '...'
        this.isShowAll = true
      } else {
        this.showText = this.commentInfo.replyTxt
        this.isShowAll = false
      }
    },
    getShowReply() {
      const maxLineCount = this.maxReplyCharCount
      if (this.reply.replyNum > 0) {
        const replyList = this.reply.replyList.map((el) => {
          let txts = el.userInfo.nickName
          if (el.userInfo.uid === this.userInfo.uid) {
            el.isAuthor = true
            txts += 'a作者a'
          }
          const charCount1 = this.$util.countChars(txts)
          const charCount2 = this.$util.countChars(el.rpInfo.replyTxt)
          if (charCount1 + charCount2 > maxLineCount) {
            el.showContent = el.rpInfo.replyTxt.substr(0, maxLineCount - charCount1) + '...'
          } else {
            el.showContent = el.rpInfo.replyTxt
          }
          return el
        })
        this.reply.replyList = replyList
      }
    },
    gotoReply() {
      const _that = this
      this.$Router.push({
        name: 'comment',
        params: {
          isuId: _that.commentInfo.isuId,
          cateId: _that.commentInfo.isuCateId,
          comId: _that.commentInfo.comId,
          commReplyId: _that.commentInfo.replyId
        }
      })
      // this.$Router.push({ name: 'comment', params: { lineIdx: 1 } })
      // this.$emit('toReply')
    },

    // 点赞或取消点赞, 反对或取消反对
    praOrOppse(rpyType) {
      const _that = this
      const req = {
        isuCateId: _that.commentInfo.isuCateId,
        isuId: _that.commentInfo.isuId,
        comId: _that.commentInfo.comId,
        uid: _that.uid,
        replyType: rpyType, // 4-点赞,5-反对
        commReplyId: _that.commentInfo.replyId,
        tagReplyId: -1,
        isReplyCancel: _that.op.isUserPraise === 1 ? 1 : 0
      }

      if (rpyType === 4) {
        req.isReplyCancel = _that.op.isUserPraise === 1 ? 1 : 0
      } else if (rpyType === 5) {
        req.isReplyCancel = _that.op.isUserOppose === 1 ? 1 : 0
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
        isuCateId: _that.commentInfo.isuCateId,
        isuId: _that.commentInfo.isuId,
        comId: _that.commentInfo.comId,
        uid: _that.uid,
        commReplyId: _that.commentInfo.replyId,
        tagReplyId: -1
      }

      isuReplyCount(req).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          _that.op.praiseCount = _res.praiseCount
          _that.op.opposeCount = _res.opposeCount
          _that.op.isUserPraise = _res.isUserPraise
          _that.op.isUserOppose = _res.isUserOppose
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-item-box {
  display: flex;
  background: #fff;
  padding: 20rpx;
  margin-bottom: 20rpx;

  .auth-avtar {
    image {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
    }
  }
  .content {
    flex-grow: 1;

    .auth-line-b {
      display: flex;

      .auth {
        margin-left: 20rpx;
        font-size: 28rpx;

        .auth-name {
          font-weight: 700;
        }

        .auth-time,
        .auth-addr {
          color: #909399;
        }
      }
    }
    .replay {
      margin: 20rpx 0;

      .text {
        font-size: 33rpx;

        .fullText {
          padding: 1em;
          color: dodgerblue;
        }
      }
    }
    .op-line {
      .op-reply {
        width: 140rpx;
        background-color: #f4f4f5;
        height: 40rpx;
        line-height: 40rpx;

        .count {
          font-size: 32rpx;
        }
        .reply {
          font-size: 32rpx;
        }
      }
      .op-vote {
        font-size: 40rpx;
        width: 260rpx;
      }

      .uni-icons {
        &::before {
          font-size: 40rpx;
        }

        text {
          padding-left: 10rpx;
        }
      }

      .uniui-hand-up-filled,
      .uniui-hand-down-filled {
        &::before {
          color: deeppink;
        }
      }
    }
    .reply-list {
      background-color: #f4f4f5;
      border-radius: 12rpx;
      margin-top: 20rpx;
      padding: 10rpx 20rpx;

      .reply-first {
        padding: 10rpx 0;
        .reply-name {
          &::after {
            content: ': ';
          }
        }
        .is-author {
          font-size: 20rpx;
          color: #2b85e4;
          background-color: #a0cfff;
        }
        .reply-text {
          margin-left: 10rpx;
        }
      }
      .v-all {
        padding: 10rpx 0;
      }
    }
  }
}
</style>
