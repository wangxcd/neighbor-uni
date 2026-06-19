<!--
* @Description: 回复项
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-23 19:09:36
* @LastEditors: wangxc
* @LastEditTime: 2024-04-23 19:09:36
-->
<template>
  <view class="comment-item-b-box">
    <view class="auth-avtar">
      <image class="avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" mode=""></image>
      <image class="avatar" v-else src="/static/images/logo/f.png" mode=""></image>
    </view>
    <view class="content">
      <view class="auth-line-b">
        <view class="auth flex start">
          <view class="auth-name mr10">{{ userInfo.nickName }}</view>
          <view class="auth-time mr10">{{ $util.timeAgo(replyInfo.replyTime) }}</view>
          <view class="auth-addr mr10">4#楼</view>
        </view>
      </view>
      <view class="replay">
        <view class="text">
          <text>{{ replyInfo.replyTxt }}</text>
        </view>
      </view>
      <view class="op-line flex space">
        <view class="op-reply" @click="gotoReply">
          <text v-if="op.replyNum > 0" class="count">
            {{ op.replyNum }}
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
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

import { isuPraOrOpp } from '@/api/isuForm'
import { isuReplyCount } from '@/api/isuQuery'

export default {
  name: 'comment-item-b',
  components: {},
  props: {
    isuReply: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      replyInfo: {},
      userInfo: {}, // 回复人
      commLive: {}, // 回复人住所

      originalText: '出了万丰来你这边，',
      showText: '',
      maxShowCharCount: 20 * 3 - 6,
      isShowAll: false,
      op: {
        replyNum: 0,

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
      uid: 'user/uid'
    })
  },
  created() {
    this.init()
  },
  mounted() {
    if (this.isuReply) {
      const { userLiveInfo, ...replyInfo } = { ...this.isuReply }
      if (replyInfo) {
        this.replyInfo = replyInfo
      }
      if (userLiveInfo) {
        const { userInfo, commLive } = { ...userLiveInfo }
        this.userInfo = userInfo
        this.commLive = commLive
      }
      this.replyCount()
    }
  },
  watch: {},
  methods: {
    init() {},

    gotoReply() {
      this.$emit('toReply', this.replyInfo.replyId)
    },

    // 点赞或取消点赞, 反对或取消反对
    praOrOppse(rpyType) {
      const _that = this
      const req = {
        isuCateId: _that.replyInfo.isuCateId,
        isuId: _that.replyInfo.isuId,
        comId: _that.replyInfo.comId,
        uid: _that.uid,
        replyType: rpyType, // 4-点赞,5-反对
        commReplyId: _that.replyInfo.commReplyId,
        tagReplyId: _that.replyInfo.tagReplyId,
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
        isuCateId: _that.replyInfo.isuCateId,
        isuId: _that.replyInfo.isuId,
        comId: _that.replyInfo.comId,
        uid: _that.uid,
        commReplyId: _that.replyInfo.commReplyId,
        tagReplyId: _that.replyInfo.tagReplyId
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
.comment-item-b-box {
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
        width: 100rpx;
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
  }
}
</style>
