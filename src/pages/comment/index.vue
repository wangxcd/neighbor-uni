<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-23 23:26:29
* @LastEditors: wangxc
* @LastEditTime: 2024-04-23 23:26:29
-->
<template>
  <view class="index-box" :style="{ 'min-height': sysInfo.pageHeight + 'px' }">
    <!-- 评论页主体 -->
    <view class="reply-body">
      <!-- 评论人 -->
      <view class="article-sec">
        <view class="auth-line-a">
          <view class="left">
            <view class="avator">
              <image class="avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" mode=""></image>
              <image class="avatar" v-else src="/static/images/logo/f.png" mode=""></image>
            </view>
            <view class="auth">
              <view class="auth-name">{{ userInfo.nickName }}</view>
              <view class="auth-time">{{ $util.timeAgo(commReply.replyTime) }}</view>
            </view>
          </view>
          <view class="right">
            <view class="auth-op">
              <interestBtn :tagUserId="userInfo.uid"></interestBtn>
            </view>
          </view>
        </view>
        <!-- 评论内容 -->
        <view class="content">
          <view class="text">
            <text>{{ commReply.replyTxt }}</text>
          </view>
          <view class="img">
            <view class="pic">
              <image
                src="https://p3-sign.toutiaoimg.com/tos-cn-i-6w9my0ksvp/952fbcc55b3547f1abd9ae394ac209e7~noop.image?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1714274713&x-signature=%2B4dhphUgiGrfK1P2ugJgb3pbbDI%3D"
                mode="widthFix"></image>
            </view>
          </view>
        </view>
        <view class="tags">
          <view class="addr">2#楼3单元</view>
        </view>
      </view>
      <!-- 回复区部分 -->
      <view class="comment-sec">
        <view class="comment-head">
          <view class="title" v-if="commReply.respCount && commReply.respCount > 0">
            全部回复
            <text>{{ commReply.respCount }}</text>
          </view>
          <view class="title" v-else> 暂无回复 </view>
        </view>
        <view class="comment-body">
          <commentItemB v-for="rpItem in replyList" :key="rpItem.replyId" :isuReply="rpItem" @toReply="toReply"></commentItemB>
        </view>
      </view>
      <u-loadmore status="nomore" />
    </view>

    <!-- 底部评论操作 -->
    <view class="reply-bottom">
      <commentBottomOp @pubShow="toReply"></commentBottomOp>
    </view>

    <!-- 评论表单发布区 -->
    <commentPub v-if="replyForm.show" :isShow="replyForm.show" placeholder="我也来说几句..." @close="replyForm.show = false" @sendPub="addComment"></commentPub>
  </view>
</template>

<script>
import commentBottomOp from '@/common/components/comment/comment-bottom-op.vue'
import commentPub from '@/common/components/comment/comment-pub.vue'
import commentItemB from '@/common/components/comment/comment-item-b.vue'

import { mapGetters } from 'vuex'
import { ljhdCommReply, ljhdPageReplys } from '@/api/isuQuery'
import { isuAddReply } from '@/api/isuForm'
import { txtUgcSecWeixinCheck } from '@/api/public'

export default {
  name: 'index',
  components: {
    commentBottomOp,
    commentPub,
    commentItemB
  },
  data() {
    return {
      cateId: null,
      comId: null,
      isuId: null,
      commReplyId: null,

      // 评论信息、评论人、评论人位置
      commReply: {},
      userInfo: {},
      commLive: {},

      // 评论回复列表
      replyList: [],
      fullPageList: [],
      lastList: [],

      // 邻间互动分页信息
      replyPage: {
        sortNum: 0, // 当前页开始序号
        current: 1, // 当前位于哪页
        pageSize: 12, // 每页显示最多行数
        total: 0, // 总数
        pages: 0 // 总页数
      },

      curToReplyId: -1, // 当前回复的回复ID

      loadMoreContent: {
        contentdown: '下拉显示更多',
        contentrefresh: '正在加载...',
        contentnomore: '没有更多数据了'
      },
      loadMoreStatus: 'more',

      // 回复表单
      replyForm: {
        show: false
      }
    }
  },
  onLoad(e) {
    console.log(e)
    if (e.comId) {
      this.comId = Number(e.comId)
    }
    if (e.cateId) {
      this.cateId = Number(e.cateId)
    }
    if (e.isuId) {
      this.isuId = Number(e.isuId)
    }
    if (e.commReplyId) {
      this.commReplyId = Number(e.commReplyId)
    }
    this.initData()
  },
  onReachBottom() {
    // 加载更多
    this.getList()
  },
  computed: {
    ...mapGetters({
      sysInfo: 'app/sysInfo',
      localComm: 'app/localComm',
      uid: 'user/uid'
    })
  },
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

    initData() {
      const _that = this
      const reqData = {
        isuCateId: this.cateId,
        comId: this.comId,
        isuId: this.isuId,
        commReplyId: this.commReplyId
      }

      ljhdCommReply(reqData).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          const { userLiveInfo, replyList, ...commReply } = { ..._res }
          if (commReply) {
            _that.commReply = commReply
          }
          if (userLiveInfo) {
            const { userInfo, commLive } = { ...userLiveInfo }
            _that.userInfo = userInfo
            _that.commLive = commLive
          }

          _that.getList()
        }
      })
    },

    getList() {
      const _that = this
      _that.loadMoreStatus = 'loading'
      const params = {
        current: _that.replyPage.current,
        size: _that.replyPage.pageSize
      }
      const reqData = {
        isuCateId: this.cateId,
        comId: this.comId,
        isuId: this.isuId,
        commReplyId: this.commReplyId
      }

      ljhdPageReplys(params, reqData).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res.records.length > 0) {
            const dataList = _res.records.map((item) => {
              return item
            })

            _that.replyPage.total = Number(_res.total)
            _that.replyPage.pages = Number(_res.pages)

            if (dataList.length < _res.size) {
              _that.lastList = dataList
              _that.loadMoreStatus = 'no-more'
            } else {
              _that.lastList = []
              _that.fullPageList.push(...dataList)
              _that.replyPage.current = Number(_res.current) + 1
              if (_that.fullPageList.length === _that.replyPage.total) {
                _that.loadMoreStatus = 'no-more'
              } else {
                _that.loadMoreStatus = 'more'
              }
            }

            _that.replyList = [..._that.fullPageList, ..._that.lastList]
          } else {
            _that.loadMoreStatus = 'no-more'
          }
        }
      })
    },

    /**
     * 添加评论
     */
    addComment(bizType, content) {
      const _that = this
      const req = {
        isuId: this.isuId,
        comId: this.comId,
        isuCateId: this.cateId,
        replyType: 2, // 1-评论/2-回复
        commReplyId: this.commReplyId,
        tagReplyId: this.curToReplyId,
        uid: this.uid,
        replyTxt: content
      }
      isuAddReply(req).then((res) => {
        if (res.code === 0) {
          _that.replyForm.show = false
          _that.getList()
        }
      })
    },

    /**
     * 评论的回复
     */
    toReply(replyId) {
      if (replyId) {
        this.curToReplyId = replyId
      } else {
        this.curToReplyId = -1
      }
      this.replyForm.show = true
    }
  }
}
</script>

<style lang="scss" scoped>
.index-box {
  display: flex;
  flex-direction: column;
  width: 100%;

  .reply-body {
    flex: 1;
    height: calc(100% - 60rpx);
    overflow-x: hidden;
    overflow-y: hidden;

    .article-sec {
      padding: 10px;
      background: #fff;
      margin-bottom: 20rpx;
      border-bottom: 1px solid #d9d9d9;

      .auth-line-a {
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
        .right {
          .auth-op {
          }
        }
      }

      .content {
        margin: 20rpx 0;

        .text {
          font-size: 33rpx;
        }

        .img {
          margin: 20rpx 0;

          .pic {
            width: 700rpx;
            margin: 20rpx 0;

            image {
              max-width: 576rpx;
              height: auto;
              border-radius: 4%;
            }
          }
        }
      }

      .tags {
        .addr {
        }
      }
    }

    .comment-sec {
      .comment-head {
        padding: 10rpx 20rpx;

        .title {
          font-size: 32rpx;
          font-weight: 700;
        }
      }
    }
  }

  .reply-bottom {
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    bottom: 0;
    border-top: 1px solid #d9d9d9;
    position: sticky;
    background-color: #fff;
  }
}
</style>
