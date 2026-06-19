<!--
* @Description: 社区发布消息项
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-24 12:00:56
* @LastEditors: wangxc
* @LastEditTime: 2024-04-24 12:00:56
-->
<template>
  <view class="comminfo-item-box">
    <view class="flex-row" @click="gotoFull">
      <view class="info-sufx">
        <view class="title-line">
          <view class="tag" v-if="tagTxt.length > 0">{{ tagTxt }}</view>
          <view class="title-txt">
            <view class="item-title">{{ info.title }}</view>
            <view class="past_time">
              <text class="desc">{{ timeAgo }}</text>
            </view>
          </view>
        </view>
        <view class="desc-line">
          <view class="cate" :style="{ width: `${cateTitleWin}rpx` }">
            <text class="lab">类型</text>
            <text class="desc">{{ infoCate.cateTitle }}</text>
          </view>
          <view class="addr">{{ address }}</view>
          <view class="keywords flex" v-if="keyWords.length && keyWords.length > 0">
            <text class="lab">关键字</text>
            <view class="word-list justify-start">
              <text class="tag" v-for="(kw, idx) in keyWords" :key="idx">{{ kw }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { isNotEmpty } from '@/utils/validate'
import isuCate from '@/libs/isucate'

export default {
  name: 'comminfo-item',
  components: {},
  props: {
    rectRpxWidth: {
      type: Number,
      default: 750
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      originalText: '',
      tagTxt: '',
      timeAgo: '',
      infoCate: {},
      mCate: {},
      cateTitleWin: 160,
      address: '',
      imgUrls: [],
      keyWords: []
    }
  },
  computed: {
    ...mapGetters({
      localComm: 'app/localComm',
      locIsuPreUrl: 'app/locIsuPreUrl'
    })
  },
  created() {},
  mounted() {
    this.getShowText()
  },
  watch: {},
  methods: {
    getShowText() {
      const _that = this
      if (this.info) {
        this.originalText = this.info.content
        this.timeAgo = this.$util.timeAgo(this.info.isuTime)

        if (isNotEmpty(this.info.imgUrls)) {
          this.imgUrls = JSON.parse(this.info.imgUrls)
        }

        if (isNotEmpty(this.info.keyWords)) {
          this.keyWords = this.info.keyWords.split(',')
        }

        if (this.info.isListTop === 1) {
          this.tagTxt = '置顶'
        }

        this.address = ''
        this.address += this.info.buildPark || ''
        this.address += this.info.buildNo ? '  ' + this.info.buildNo + '楼' : ''
        this.address += this.info.buildUnit ? '  ' + this.info.buildUnit + '单元' : ''

        // 菜单类目
        isuCate.getIsuCateById(this.info.cateId).then((r) => {
          _that.infoCate = r
          _that.cateTitleWin = r.cateTitle.length * 20 + 80
          if (r.parCateId !== -1) {
            isuCate.getIsuCateById(r.parCateId).then((r2) => {
              _that.mCate = r2
            })
          }
        })
      }
    },

    gotoFull() {
      const _that = this
      this.$Router.push({
        name: 'isuInfoDetail',
        params: {
          isuId: _that.info.isuId,
          cateId: _that.info.cateId,
          mCateName: _that.mCate.cateName,
          comId: _that.localComm.comm.comId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.comminfo-item-box {
  border-bottom: 1px dashed #eceaea;
  margin: 20rpx 0;
  padding: 0 10rpx;

  .info-sufx {
    flex: 1;
  }

  .title-line {
    display: flex;
    justify-content: flex-start;
    font-size: 26rpx;
    margin: 10rpx;

    .tag {
      width: 64rpx;
      height: 26rpx;
      line-height: 26rpx;
      font-size: 20rpx;
      color: #ff4c48;
      border-radius: 10rpx;
      text-align: center;
      border: 2rpx solid #ff4947;
      margin-right: 10rpx;
    }

    .title-txt {
      display: flex;
      justify-content: space-between;
      flex: 1;

      .item-title {
        width: 480rpx;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .past_time {
        .lab {
          color: #999;
        }

        .desc {
          color: rgb(11, 134, 28);
          float: right;
        }
      }
    }
  }

  .desc-line {
    display: flex;
    font-size: 24rpx;
    margin: 10rpx;

    .lab {
      &::after {
        content: ': ';
      }
    }
    .desc {
    }

    .cate {
      margin-right: 20rpx;
    }
    .addr {
      width: 200rpx;
    }
    .keywords {
      width: 290rpx;
      .tag {
        height: 26rpx;
        line-height: 26rpx;
        font-size: 18rpx;
        color: #ff4c48;
        border-radius: 10rpx;
        text-align: center;
        border: 2rpx solid #2196f3;
        margin: 0 3rpx;
      }
    }
  }
}
</style>
