<!--
* @Description: 评论区显示块
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-23 16:16:17
* @LastEditors: wangxc
* @LastEditTime: 2024-04-23 16:16:17
-->
<template>
  <view class="comment-block-box">
    <view class="comment-head">
      <view class="title" v-if="commentCount > 0">
        评论区
        <text>{{ commentCount }}</text>
      </view>
      <view class="title" v-else> 暂无评论 </view>
    </view>
    <view class="comment-list">
      <commentItemA v-for="item in commentList" :key="item.replyId" :isuComment="item" :rectRpxWidth="contentRpxWidth" @toReply="toReply"></commentItemA>
      <!--
      <commentItemA :rectRpxWidth="contentRpxWidth" @toReply="toReply"></commentItemA>
      -->
    </view>
  </view>
</template>

<script>
import commentItemA from './comment-item-a.vue'

export default {
  name: 'comment-block',
  components: {
    commentItemA
  },
  props: {
    commentList: {
      type: Array,
      default: () => []
    },
    commentCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    const sysInfo = this.$store.getters.sysInfo
    const rectPxWidth = sysInfo.screenWidth

    return {
      contentRpxWidth: rectPxWidth * sysInfo.rpxPxRatio, // content部分的宽度值(rpx单位)
      reply: {
        show: false
      }
    }
  },
  computed: {},
  created() {},
  updated() {},
  watch: {},
  methods: {
    toReply() {
      this.reply.show = true
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-block-box {
  background: #fff;
  padding: 10rpx 0;

  .comment-head {
    padding: 10rpx 20rpx;

    .title {
      font-size: 32rpx;
      font-weight: 700;
    }
  }
  .comment-list {
  }
}
</style>
