<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2025-12-15 14:33:40
* @LastEditors: wangxc
* @LastEditTime: 2025-12-15 14:33:40
-->
<template>
  <view class="join-isu-item-box list-box">
    <view class="flex-row item">
      <view class="info-sufx">
        <view class="info-main" @click="gotoFull">
          <view class="title-line">
            <view class="tag" v-if="tagTxt.length > 0">{{ tagTxt }}</view>
            <view class="title-txt">
              <view class="item-title">{{ title }}</view>
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
            <view class="keywords flex" v-if="keyWords.length && keyWords.length > 0">
              <text class="lab">关键字</text>
              <view class="word-list justify-start">
                <text class="tag" v-for="(kw, idx) in keyWords" :key="idx">{{ kw }}</text>
              </view>
            </view>
          </view>
          <view class="desc-line">
            <view class="expire-time">
              <template v-if="showStatus === 'top'">
              <text class="lab">置顶结束日</text>
              <text class="desc">{{ info.topEndDate }}</text>
              </template>
              <template v-else>
              <text class="lab">有效期至</text>
              <text class="desc">{{ info.isuExpirDate }}</text>
              </template>
            </view>
          </view>
        </view>
        <view class="sub-line">
          <view class="sub-left"> </view>
          <view class="sub-right">
            <!-- 参与状态 -->
            <view class="opt">
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { isNotEmpty, isEmpty } from '@/utils/validate'
import isuCate from '@/libs/isucate'

export default {
  name:'join-isu-item',
  components: {
  },
  data(){
    return {
      title: '',
      originalText: '',
      tagTxt: '',
      timeAgo: '',
      infoCate: {},
      mCate: {},
      cateTitleWin: 160,
      imgUrls: [],
      keyWords: [],
      topStatus: ''
    }
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  onLoad(e) {
    console.log(e)
  },
  onShow(e) {
    console.log(e)
  },
  onReachBottom(e) {
    console.log(e)
  },
  computed: {
    ...mapGetters({
      localComm: 'app/localComm',
      locIsuPreUrl: 'app/locIsuPreUrl'
    })
  },
  created() {
  },
  mounted() {
    this.getShowText()
  },
  watch: {
  },
  methods: {
    getShowText() {
      const _that = this
      if (this.info) {
        this.originalText = this.info.content
        this.title = this.info.title
        if (isEmpty(this.title)) {
          this.title = this.originalText.substr(0, 60)
        }
        this.timeAgo = this.$util.timeAgo(this.info.isuTime)

        if (isNotEmpty(this.info.imgUrls)) {
          this.imgUrls = JSON.parse(this.info.imgUrls)
        }

        if (isNotEmpty(this.info.keyWords)) {
          this.keyWords = this.info.keyWords.split(',')
        }

        if (this.info.isListTop === 1) {
          const sr = this.$util.timeAgoMillion(this.info.topBeginDate)
          const edr = this.$util.timeAgoMillion(this.info.topEndDate)
          if (sr < 0) {
            this.topStatus = '待置顶'
          } else if (sr >= 0 && edr <= 0) {
            this.topStatus = '置顶中'
          } else {
            this.topStatus = '已过期'
          }
        }

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
  @import '../../../common/scss/home-block.scss';
  .join-isu-item-box {
    background-color: #fff;

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

        .opt {
            display: flex;

            .opt-btn {
            font-size: 28rpx;
            width: 150rpx;
            height: 54rpx;
            border-radius: 27rpx;
            background-color: #19be6b;
            color: #fff;
            text-align: center;
            line-height: 54rpx;
            margin-right: 10rpx;
            }

            .disabled {
            background-color: #c8c9cc;
            color: #fff;
            }

            .width100 {
            width: 100rpx;
            }
        }
        }
    }
  }
</style>
