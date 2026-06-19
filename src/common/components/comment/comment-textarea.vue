<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-22 15:22:12
* @LastEditors: wangxc
* @LastEditTime: 2024-04-22 15:22:12
-->
<template>
  <view class="comment-textarea-box">
    <!-- 蒙层 -->
    <view
      class="c-mask"
      v-if="showInputPop"
      @click.stop="closeInputPop"
      @touchmove.stop.prevent="disableScroll"></view>

    <view
      class="popup-comment"
      v-if="showInputPop">
      <view class="comment-input-wrap">
        <view
          class="comment-textarea-box"
          @touchmove.stop.prevent="disableScroll">
          <textarea
            v-model="commentParams.content"
            class="comment-textarea"
            :maxlength="600"
            :focus="replyFocus"
            :placeholder="customPlaceholder"
            :show-confirm-bar="false"
            @focus="commentInputFocus"
            @blur="commentInputBlur"
            :adjust-position="true"
            :cursor-spacing="400"
            :cursor="cursorIndex"
            @input="inputFocusChange"
            :fixed="true" />
          <view class="limit">{{ commentParams.content.length || 0 }} / 600</view>
        </view>
      </view>

      <!--
      <view class="image-list">
        <view
          class="image-item"
          v-for="(item, index) in commentImages"
          :key="index">
          <image
            class="image"
            :src="item"
            mode="aspectFill"
            @click.stop="previewCommentImage(item)"></image>
          <uni-icons
            class="icon-close"
            @click.stop="deleteOneCommentImage(index)"
            type="clear"
            size="20"
            color="#red"></uni-icons>
        </view>
      </view>
-->
      <view class="relase-btn">
        <!-- 表情 和 图片 -->
        <view class="emoji-image">
          <!-- 选择上传图片 -->
          <view
            class="uni-icons uniui-hand-up"
            hover-class="checkActive"
            :hover-stay-time="100"
            @click="selectMediaImage"></view>
          <!-- 表情 -->
          <view
            class="uni-icons uniui-hand-up"
            hover-class="checkActive"
            :hover-stay-time="100"
            @click="openEmoji"
            v-if="!showEmoji"></view>
          <!-- 键盘 -->
          <view
            v-else
            class="uni-icons uniui-hand-up"
            hover-class="checkActive"
            :hover-stay-time="100"
            @click="openKeyboard"></view>
        </view>
        <!-- 发布 -->
        <view
          class="relase"
          @click.stop="commentCommit"
          hover-class="button-hover"
          :hover-stay-time="100">
          发布
        </view>
      </view>

      <list
        class="emoji-data"
        :show-scrollbar="false"
        v-if="showEmoji">
        <view
          v-for="(item, index) in emojiDataList"
          :key="index"
          class="emoji-item"
          hover-class="checkActive"
          :hover-stay-time="100"
          @click.stop="tuchCurrentEmoji(item)">
          <text class="emoj_conn">{{ item }}</text>
        </view>
      </list>
    </view>
  </view>
</template>

<script>
export default {
  name: 'comment-textarea',
  components: {},
  props: {
    showInputPop: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 新增评论入参
      commentParams: {
        content: ''
      },
      commentImages: [], // 评论上传的图片
      replyFocus: false, // 点击回复控制textarea的聚焦
      // 默认的提示内容
      customPlaceholder: '输入评论',
      // 是否显示表情包
      showEmoji: false,
      emojiDataList: [
        '🤞',
        '👍',
        '👏',
        '❤',
        '😁',
        '🖐',
        '😀',
        '😃',
        '😄',
        '😁',
        '😆',
        '😅',
        '😂',
        '🤣',
        '😊',
        '😇',
        '🙂',
        '🙃',
        '😉',
        '😌',
        '😍',
        '🥰',
        '😘',
        '😗',
        '😙',
        '😚',
        '😋',
        '😛',
        '😝',
        '😜'
      ],
      // 记录当前光标位置
      cursorIndex: 0,
      // 评论时鼠标光标的位置
      cursorInputIndex: -1
    }
  },
  onLoad(e) {
    console.log(e)
  },
  computed: {},
  created() {},
  watch: {},
  methods: {
    disableScroll() {},
    // 评论框打开
    inputFocus(type, e) {
      const _that = this
      this.$nextTick(() => {
        _that.replyFocus = true
        _that.cursorIndex = _that.cursorInputIndex
        // 如果是根评论（当前文章直接评论而不是回复别人的评论）
        if (type === 1) {
          _that.customPlaceholder = '输入评论'
          _that.commentParams.pCode = ''
        } else {
          // 如果是回复评论
          if (e) {
            _that.commentParams.pCode = e.code
            _that.customPlaceholder = `回复${e.nickname}`
          }
        }
      })
    },

    // 评论框聚焦
    commentInputFocus(e) {
      this.replyFocus = true
      this.showEmoji = false
    },
    // 评论失焦
    commentInputBlur(e) {
      this.cursorInputIndex = e.detail.cursor
      this.replyFocus = false
    },
    // 选中表情
    tuchCurrentEmoji(item) {
      const _that = this
      if (_that.cursorInputIndex > 0) {
        const start = _that.commentParams.content?.substring(0, _that.cursorInputIndex)
        const end = _that.commentParams.content?.substring(_that.cursorInputIndex, _that.commentParams.content?.length)
        _that.commentParams.content = start + item + end
      } else {
        _that.commentParams.content += item
      }
      _that.cursorInputIndex += item.length
    },
    // 输入时光标的位置
    inputFocusChange(e) {
      this.cursorInputIndex = e.detail.cursor
    },

    // 预览评论的图片
    previewCommentImage(img) {
      const _that = this
      uni.previewImage({
        current: img,
        urls: _that.commentImages
      })
    },

    // 删除某一张评论图片
    deleteOneCommentImage(index) {
      this.commentImages.splice(index, 1)
    },

    // 选择上传媒体相册中的图片 uniapp的方法
    async selectMediaImage() {
      const res = await uni.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album'],
        camera: 'back'
      })
      const tempFilePaths = res.tempFiles.map((item) => item.tempFilePath)
      tempFilePaths.forEach(async (tempFilePath) => {
        // 封装的的上传文件方法，可以改为自己的方法，也可以查看前面发布的文章里有这个方法
        await uploadImages(tempFilePath, commentImages, 1)
      })
    },

    // 打开表情包
    openEmoji() {
      this.replyFocus = false
      this.showEmoji = true
    },

    // 打开键盘
    openKeyboard() {
      this.showEmoji = false
      this.replyFocus = true
    },

    closeInputPop() {
      this.replyFocus = false
      this.$emit('update:showInputPop', false)
      this.commentParams.pCode = ''
    },

    // 提交评论
    async commentCommit() {
      this.commentParams.content = this.commentParams.content.trim()
      // 提交评论的具体实现可根据自己的需求来改，如有需要私我即可
      if (this.commentParams.content.length > 0) {
        this.closeInputPop()
      } else {
        uni.showToast({
          title: '评论内容不能为空',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-textarea-box {
  .c-mask {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .popup-comment {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 1000;
    width: 100vw;
    background-color: #fff;

    .comment-input-wrap {
      padding: 20rpx 30rpx;
      display: flex;
      flex-direction: column;

      .comment-textarea-box {
        position: relative;

        .comment-textarea {
          border-radius: 20rpx;
          height: 160rpx;
          width: 500rpx;
          background-color: #f6f6f6;
          font-size: 26rpx;
          padding: 20rpx;
        }

        .limit {
          // 定位到textarea 的 右下角
          position: absolute;
          right: 20rpx;
          bottom: 20rpx;
          font-size: 20rpx;
          color: #767676;
        }
      }

      .image-list {
        display: flex;
        flex-wrap: wrap;
        margin: 10rpx 0;

        .image-item {
          position: relative;
          width: 90rpx;
          height: 90rpx;
          margin-right: 10rpx;
          background-color: #fff;

          .image {
            border-radius: 20rpx;
            width: 100%;
            height: 100%;
          }

          .icon-close {
            position: absolute;
            top: -10rpx;
            right: -10rpx;
          }
        }
      }

      .relase-btn {
        display: flex;
        justify-content: space-between;
        // align-items: center;
        margin-top: 10rpx;

        // padding: 0 20rpx;
        .emoji-image {
          display: flex;
          align-items: center;
          font-size: 48rpx;
          color: #3d3d3d;

          .as-image,
          .emoji {
            margin-right: 20rpx;
          }
        }

        .limit {
          font-size: 24rpx;
          color: #767676;
        }

        .relase {
          background-color: $uni-color-primary;
          border-radius: 10rpx;
          font-size: 26rpx;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10rpx 20rpx;
        }
      }

      .emoji-data {
        display: flex;
        flex-wrap: wrap;
        height: 300rpx;
        overflow: scroll;
        margin-top: 16rpx;

        .emoji-item {
          padding: 10rpx;
        }

        .emoj_conn {
          font-size: 40rpx;
        }
      }
    }
  }
}
</style>
