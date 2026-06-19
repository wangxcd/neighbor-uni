<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-10-21 16:46:30
* @LastEditors: wangxc
* @LastEditTime: 2024-10-21 16:46:30
-->
<template>
  <view class="normal-item-box list-box">
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
          <view class="desc-line" v-if="showStatus === 'audit'">
            <view class="audit-ing" v-if="info.status === 2 && info.auditStatus === 0">
              <view class="result">
                <text class="desc">内容正在审核中...</text>
              </view>
            </view>
            <view class="audit-refuse" v-else-if="info.status === 3 && (info.auditStatus === 2 || info.auditStatus === 4)">
              <view class="result">
                <text class="desc">审核不通过</text>
              </view>
              <view class="memo" v-if="info.auditExplain">
                <text class="lab">不通过原因</text>
                <text class="desc">{{ info.auditExplain || ''}}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="sub-line">
          <view class="sub-left"> </view>
          <view class="sub-right">
            <view class="opt">
              <template v-if="showStatus === 'issue'">
                <!-- 求助救援类目在求助暂停状态可编辑 -->
                <template v-if="'qzjy' === mCate.cateName">
                  <view v-if="info.speclFields.runingStatus === 1" class="opt-btn" @click="editIsuThis(1, 'edit', 'modify')">编辑</view>
                </template>
                <!-- 打赏跑腿类目在任务暂停接单状态可编辑 -->
                <template v-else-if="'dspt' === mCate.cateName">
                  <view v-if="info.speclFields.runingStatus === 1" class="opt-btn" @click="editIsuThis(1, 'edit', 'modify')">编辑</view>
                  <view class="opt-btn" @click="gotoFull">任务取消</view>
                </template>
                <template v-else>
                  <view class="opt-btn" @click="editIsuThis(1, 'edit', 'modify')">编辑</view>
                  <view class="opt-btn" v-if="info.isAdvent === 1 && canGoOnCateNames.includes(mCate.cateName)" @click="editIsuThis(1, 'edit', 'goOn')">续期</view>
                  <view class="opt-btn" @click="pullOffIsu">下架</view>
                </template>
              </template>
              <template v-else-if="showStatus === 'audit'">
                <view class="opt-btn" @click="editIsuThis(1, 'edit', 'fPush')">编辑</view>
                <view class="opt-btn" @click="removeIsu">删除</view>
              </template>
              <template v-else-if="showStatus === 'finish'">
                <view class="opt-btn" @click="editIsuThis(1, 'again', 'modify')">再次发布</view>
                <view class="opt-btn" @click="removeIsu">删除</view>
              </template>
              <template v-else-if="showStatus === 'pull'">
                <view class="opt-btn" @click="editIsuThis(1, 'edit', 'rPush')">重新上架</view>
                <view class="opt-btn" @click="removeIsu">删除</view>
              </template>
              <template v-else-if="showStatus === 'expire'">
                <view class="opt-btn" v-if="canGoOnCateNames.includes(mCate.cateName)" @click="editIsuThis(1, 'edit', 'goOn')">续期</view>
                <template v-if="'zlsbs' === infoCate.cateName">
                  <view v-if="info.status === 5" class="opt-btn" @click="editIsuThis(1, 'edit', 'modify')">编辑</view>
                </template>
                <view class="opt-btn" @click="removeIsu">删除</view>
              </template>
              <template v-else-if="showStatus === 'top'">
                <view class="opt-btn disabled">{{ topStatus }}</view>
              </template>
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
import { isuPullOff, isuRemove } from '@/api/isuForm'

export default {
  name: 'normal-item',
  components: {},
  props: {
    info: {
      type: Object,
      default: () => {}
    },
    showStatus: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      canGoOnCateNames: ['jhqx', 'shfw', 'zrzs', 'hzzt', 'fwfc', 'clcw', 'zpqz', 'qtxx', 'tcxx'],
      isCanEdit: true, // 是否可编辑

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
    },

    editIsuThis(flag, editType, subEditType) {
      const _that = this
      if (flag === 0) {
        _that.$uniUtil.tips({ title: '重新编辑前请先暂停代办', endtime: 3000 })
        return false
      }

      this.$Router.push({
        path: _that.infoCate.isuPagePath,
        query: {
          sCateId: _that.infoCate.cateId,
          editType: editType,
          subEditType: subEditType,
          orgIsuId: _that.info.isuId
        }
      })
    },

    // 删除发布的信息
    removeIsu() {
      const _that = this
      const reqvo = {
        isuId: _that.info.isuId,
        isuCateId: _that.info.cateId,
        mCateName: _that.mCate.cateName,
        comId: _that.localComm.comm.comId
      }
      isuRemove(reqvo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res) {
            _that.$emit('refersh')
          }
        }
      })
    },
    
    // 下架发布的信息
    pullOffIsu() {
      const _that = this
      const reqvo = {
        isuId: _that.info.isuId,
        isuCateId: _that.info.cateId,
        mCateName: _that.mCate.cateName,
        comId: _that.localComm.comm.comId
      }
      isuPullOff(reqvo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res) {
            _that.$emit('refersh')
          }
        }
      })
    }

  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/scss/home-block.scss';

.normal-item-box {
  background-color: #fff;

  .desc-line {
    .audit-ing {
      .result {
        .desc {
          color: #e2ac49;
        }
      }
    }

    .audit-refuse {
      .result {
        .desc {
          color: #ec4542;
        }
      }

      .memo {
        .desc {
          color: #612bb6;
        }
      }
    }
  }

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
