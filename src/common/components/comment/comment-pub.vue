<!--
* @Description: 评论/回复发布组件
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-23 11:26:31
* @LastEditors: wangxc
* @LastEditTime: 2024-04-23 11:26:31
-->
<template>
  <view class="comment-pub-box">
    <u-popup :show="isShow" :round="10" mode="bottom" overlayStyle="{background: 'rgba(3, 100, 219, 0.5)'}" @close="popClose" @open="popOpen">
      <view class="comment-page">
        <view class="input-wrap justify-between">
          <view class="input-form">
            <textarea
              class="comment-textarea"
              :maxlength="600"
              v-model="pubForm.content"
              :focus="replyFocus"
              :placeholder="placeholder"
              :show-confirm-bar="false"
              :fixed="true"
              :adjust-position="true"
              :hold-keyboard="true"
              :cursor-spacing="400"
              :cursor="cursorIndex"
              confirm-type="done"
              @focus="commentInputFocus"
              @blur="commentInputBlur"
              @input="commentInput"></textarea>
          </view>
          <view class="comment-op">
            <view class="unfold"></view>
            <view class="send" v-if="canSend" @click="sendPub"> {{ sendText }} </view>
            <view class="send disabled" v-else> {{ sendText }} </view>
          </view>
        </view>
        <!-- 其它操作部分-->
        <view class="op-wrap"></view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { isEmpty } from '@/utils/validate'

export default {
  name: 'comment-pub',
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '说点什么吧...'
    },
    sendText: {
      type: String,
      default: '发布'
    },
    emptyTip: {
      type: String,
      default: '请输入内容'
    },
    // 1-一级评论,2-评论的回复
    commType: {
      type: Number,
      default: 1
    },
    // 业务类型
    bizType: {
      type: String,
      default: 'interact'
    },
    // 主体对象id, 主体对象可能是信息本身、评论、回复
    tagId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      popShow: false,
      replyFocus: true,
      cursorInputIndex: -1, // 评论时鼠标光标的位置
      pubForm: {
        content: ''
      },
      canSend: true
    }
  },
  computed: {},
  created() {},
  watch: {},
  methods: {
    // 弹出层收起
    popClose() {
      this.replyFocus = false
      this.$emit('close')
    },

    // 弹出层打开
    popOpen() {
      this.replyFocus = true
    },

    // 评论框聚焦
    commentInputFocus(e) {
      this.replyFocus = true
    },
    // 评论失焦
    commentInputBlur(e) {
      this.cursorInputIndex = e.detail.cursor
      this.replyFocus = false
    },

    // 输入时光标的位置
    commentInput(e) {
      this.cursorInputIndex = e.detail.cursor
    },

    sendPub() {
      const _that = this
      if (isEmpty(this.pubForm.content)) {
        this.$uniUtil.error(_that.emptyTip)
      } else {
        // 提交服务端保存处理
        /* const form = {
          userId: 0, // 评论/回复人ID
          bizType: -1,
          commType: '',
          tagId: -1,
          content: '' // 评论内容
        } */
        _that.canSend = false
        this.$emit('sendPub', this.bizType, this.pubForm.content)
        setTimeout(() => {
          _that.canSend = true
        }, 2000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-pub-box {
  .input-wrap {
    .input-form {
      flex-grow: 1;
      height: 200rpx;
      background-color: #f4f4f5;
      margin: 20rpx;
      padding: 20rpx;

      .comment-textarea {
        width: 100%;
        font-size: 14px;
      }
    }

    .comment-op {
      width: 120rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;

      .send {
        font-size: 14px;
        color: #dd6161;
      }
      .send.disabled {
        background-color: #c8c9cc;
        color: #fff;
      }
    }
  }
}
</style>
