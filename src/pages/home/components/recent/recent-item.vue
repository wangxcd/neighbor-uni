<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-10-18 12:58:10
* @LastEditors: wangxc
* @LastEditTime: 2024-10-18 12:58:10
-->
<template>
  <view class="recent-item-box list-box">
    <view class="flex-row item" @click="gotoFull">
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
          <view class="keywords flex" v-if="keyWords.length && keyWords.length > 0">
            <text class="lab">关键字</text>
            <view class="word-list justify-start">
              <text class="tag" v-for="(kw, idx) in keyWords" :key="idx">{{ kw }}</text>
            </view>
          </view>
        </view>
        <view class="desc-line">
          <view class="addr">{{ address }}</view>
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
  name: 'recent-item',
  components: {},
  props: {
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
@import '../../../../common/scss/home-block.scss';

.recent-item-box {
}
</style>
