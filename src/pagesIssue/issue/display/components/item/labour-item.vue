<!--
* @Description: 酬劳形、计时工、临时工信息列表项
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-07-30 14:26:16
* @LastEditors: wangxc
* @LastEditTime: 2024-07-30 14:26:16
-->
<template>
  <view class="labour-item-box">
    <template v-if="imgUrls.length > 0">
      <view class="body flex">
        <view class="info-left" @click="gotoFull">
          <view class="logo-img">
            <image :src="imgUrls[0]" mode="scaleToFill"></image>
          </view>
        </view>
        <view class="info-right">
          <view class="info-txt" @click="gotoFull">
            <view class="info-title">{{ info.title }}</view>
            <view class="info-content">{{ showText }}</view>
          </view>
        </view>
      </view>
    </template>
    <template v-else>
      <view class="body">
        <view class="item-header">
          <view class="header-left flex">
            <view class="avator">
              <image class="avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" mode=""></image>
              <image class="avatar" v-else src="/static/images/logo/f.png" mode=""></image>
            </view>
            <view class="auth">
              <view class="auth-name">{{ userInfo.nickName }}</view>
            </view>
          </view>
          <view class="header-right" @click="gotoFull"></view>
        </view>
        <view class="content" @click="gotoFull">
          <view v-if="info.title" class="title">{{ info.title }}</view>
          <view class="text">
            <text>{{ showText }}</text>
          </view>
        </view>
      </view>
    </template>
    <view class="intr-line">
      <view class="item reward">
        <text class="title">酬金:</text>
        <template v-if="!dyData.reward || Number(dyData.reward) === 0">
          <text class="money">面议</text>
        </template>
        <template v-else-if="info.isIsuer === 1">
          <text class="money">{{ dyData.reward }}</text>
          <text>元/人*日(次)</text>
        </template>
        <template v-else>
          <text class="money">{{ dyData.bCalcRecReward }}</text>
          <text>元/人*日(次)</text>
        </template>
      </view>
    </view>
    <view class="intr-line">
      <view class="item gender">
        <text class="title">要求:</text>
        <text>{{ dyData.gender === 0 ? '男女不限' : dyData.gender === 1 ? '男' : '女' }}</text>
        <text> / </text>
        <text>{{ dyData.minAge }} ~ {{ dyData.maxAge }}岁</text>
      </view>
    </view>
    <view class="intr-line">
      <view class="item labor-time">
        <text class="title">用工时间:</text>
        <text>{{ dyData.laborDate }} {{ dyData.laborTimeStart }}</text>
      </view>
    </view>
    <view class="sub-line">
      <view class="sub-left">
        <view class="info-cate">{{ infoCate.cateTitle }}</view>
        <view class="gap-left isu-time">{{ timeAgo }}</view>
        <view class="gap-left isu-op"></view>
      </view>
      <view class="sub-right">
        <view class="opt" v-if="info.isIsuer === 1">
          <template v-if="spfs.runingStatus === 0">
            <view class="opt-btn width100" @click="chgHireStatus(1)">暂停</view>
            <view class="opt-btn width100" @click="gotoFull">查看</view>
          </template>
          <template v-else-if="!spfs.runingStatus || spfs.runingStatus === 1">
            <view class="opt-btn width100" @click="chgHireStatus(0)">继续</view>
            <view class="opt-btn width100" @click="gotoFull">查看</view>
          </template>
          <template v-else-if="spfs.runingStatus === 2">
            <view class="opt-btn disabled" @click="gotoFull">已招满</view>
          </template>
          <template v-else-if="spfs.runingStatus === 3">
            <view class="opt-btn disabled" @click="gotoFull">已取消</view>
          </template>
          <template v-else-if="info.status === 4 || info.status === 6">
            <view class="opt-btn disabled" style="background-color: #c8c9cc">进行中..</view>
          </template>
          <template v-else-if="info.status === 8">
            <view class="opt-btn disabled" style="background-color: #c8c9cc">已完结</view>
          </template>
        </view>
        <view class="opt" v-else @click="gotoFull">
          <template v-if="spfs.runingStatus === 0">
            <view class="opt-btn disabled" v-if="myJoin.joinTime">已报名</view>
            <view class="opt-btn" v-else>去报名</view>
          </template>
          <template v-else-if="spfs.runingStatus === 1">
            <view class="opt-btn disabled" v-if="myJoin.joinTime">已报名</view>
            <view class="opt-btn disabled" v-else style="background-color: #c8c9cc">已暂停</view>
          </template>
          <template v-else-if="spfs.runingStatus === 2">
            <view class="opt-btn disabled" v-if="myJoin.joinTime">已报名</view>
            <view class="opt-btn disabled" v-else style="background-color: #c8c9cc">已招满</view>
          </template>
          <template v-else-if="spfs.runingStatus === 3">
            <view class="opt-btn disabled" style="background-color: #c8c9cc">已取消</view>
          </template>
          <template v-else-if="info.status === 4 || info.status === 6">
            <view class="opt-btn disabled" style="background-color: #c8c9cc">进行中..</view>
          </template>
          <template v-else-if="info.status === 8">
            <view class="opt-btn disabled" style="background-color: #c8c9cc">已完结</view>
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { isNotEmpty } from '@/utils/validate'
import consdef from '@/common/js/constant/consdef.js'
import isuCate from '@/libs/isucate'
import { zlsbsJoinStat, zlsbsUpdSpecl } from '@/api/isuJoin'

export default {
  name: 'labour-item',
  components: {},
  props: {
    rectRpxWidth: {
      type: Number,
      default: 750
    },
    /* mCateName: {
      type: String,
      default: ''
    }, */
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      infoCate: {},
      originalText: '',
      showText: '',
      timeAgo: '',
      maxShowCharCount: 20 * 3 - 6,
      isShowAll: false,
      // 信息附件图片
      imgUrls: [],
      userInfo: {},

      dyData: {},
      spfs: {},
      myJoin: {},

      infoInterval: null,

      infoStatus: {
        ...consdef.issue.infoStatus
      }
    }
  },
  computed: {
    ...mapGetters({
      localComm: 'app/localComm',
      locIsuPreUrl: 'app/locIsuPreUrl',
      locComPreUrl: 'app/locComPreUrl',
      uid: 'user/uid'
    })
  },
  created() {},
  mounted() {
    this.init()
    this.initInfo()
    this.getShowText()
  },
  beforeDestroy() {
    const _that = this
    if (_that.infoInterval) {
      clearInterval(_that.infoInterval)
    }
  },
  watch: {},
  methods: {
    init() {
      const rectRpxWidth = this.rectRpxWidth - 40
      const textLineCharNum = Math.floor(rectRpxWidth / 33) // 每行字数
      this.maxShowCharCount = textLineCharNum * 2 - 6
    },

    initInfo() {
      const _that = this
      if (this.info) {
        this.timeAgo = this.$util.timeAgo(this.info.isuTime)

        isuCate.getIsuCateById(this.info.cateId).then((r) => {
          this.infoCate = r
        })

        if (isNotEmpty(this.info.imgUrls)) {
          const infoImgs = JSON.parse(this.info.imgUrls)
          this.imgUrls = infoImgs.map((el) => {
            if (!this.$util.isRemoteUrl(el.url) && this.$util.startWith(el.url, 'f/')) {
              return _that.locIsuPreUrl + el.url
            } else {
              return el.url
            }
          })
        }

        this.userInfo = { ...this.info.userLiveInfo.userInfo }
        const avatarUrl = this.userInfo.avatarUrl
        if (avatarUrl && !this.$util.isRemoteUrl(avatarUrl) && this.$util.startWith(avatarUrl, 'f/')) {
          this.userInfo.avatarUrl = this.locComPreUrl + avatarUrl
        }

        // 动态表单内容
        if (this.info.dyFormData) {
          _that.dyData = this.info.dyFormData
        }

        // 专有内容
        if (this.info.speclFields) {
          // this.spfs = JSON.parse(this.info.speclFields)
          this.spfs = this.info.speclFields
        }

        _that.intervalInfoView()
      }
    },

    getShowText() {
      if (this.info) {
        this.originalText = this.info.content
      }
      const charCount = this.$util.countChars(this.originalText)
      if (charCount > this.maxShowCharCount) {
        this.showText = this.originalText.substr(0, this.maxShowCharCount) + '...'
        this.isShowAll = true
      } else {
        this.showText = this.originalText
        this.isShowAll = false
      }
    },

    intervalInfoView() {
      const _that = this
      if (_that.infoInterval) {
        clearInterval(_that.infoInterval)
      }
      // 设置间隔为1分钟
      _that.infoInterval = setInterval(
        (function () {
          const fn = function () {
            _that.getInfoView()
          }
          fn()
          return fn
        })(),
        1000 * 60 * 2
      )
    },

    getInfoView() {
      const _that = this
      const reqVo = {
        isuId: this.info.isuId,
        comId: this.info.comId,
        isuCateId: this.info.cateId,
        joinListType: 2 // 列表仅用户自己
      }

      zlsbsJoinStat(reqVo).then((res) => {
        if (res.code === 0) {
          const { isuInfo, joinList } = res.data
          // 专有内容
          if (isuInfo.speclFields) {
            // _that.spfs = JSON.parse(isuInfo.speclFields)
            _that.spfs = isuInfo.speclFields

            // 招工完成后不再周期查询
            if (_that.spfs.runingStatus >= 2) {
              if (_that.infoInterval) {
                clearInterval(_that.infoInterval)
              }
            }
          }

          _that.myJoin = {}
          if (Array.isArray(joinList) && joinList.length > 0) {
            _that.myJoin = joinList[0]
          }
        }
      })
    },

    /**
     * 更换招工状态
     */
    chgHireStatus(v) {
      const _that = this
      const specl = {
        runingStatus: v
      }

      const reqVo = {
        isuId: this.info.isuId,
        comId: this.info.comId,
        isuCateId: this.info.cateId,
        specl: JSON.stringify(specl) 
      }
      zlsbsUpdSpecl(reqVo).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          // 专有内容
          _that.intervalInfoView()
        }
      })
    },

    /**
     * 拨打电话
     */
    makePhone(phone) {
      uni.makePhoneCall({
        phoneNumber: phone
      })
    },

    gotoFull() {
      const _that = this
      // 非发布者本人不能看到已下架、已过期的信息
      if (_that.uid != _that.info.uid && (_that.info.status === _that.infoStatus.PULL || _that.info.status === _that.infoStatus.EXPIRE)) {
        this.$uniUtil.tips({
          title: _that.info.status === _that.infoStatus.PULL ? '信息已下架' : '信息已过期'
        })
        return false
      }
      
      this.$Router.push({
        name: 'isuInfoDetail',
        params: {
          isuId: _that.info.isuId,
          cateId: _that.info.cateId,
          // mCateName: _that.mCateName,
          comId: _that.localComm.comm.comId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.labour-item-box {
  background-color: #fff;
  margin: 10rpx 0;

  .body {
    padding: 10rpx 20rpx;

    .info-left {
      .logo-img {
        image {
          width: 180rpx;
          height: 180rpx;
          border-radius: 10rpx;
        }
      }
    }

    .info-right {
      margin-left: 20rpx;
      padding: 10rpx;

      .info-txt {
        .info-title {
          font-size: 33rpx;
          color: #606266;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .info-content {
          font-size: 28rpx;
          color: #909399;
          margin-top: 10rpx;
        }
      }
    }

    .item-header {
      display: flex;
      padding: 10rpx;

      .header-left {
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
          display: flex;
          align-items: center;

          .auth-name {
            font-size: 28rpx;
            font-weight: 700;
          }
        }
      }

      .header-right {
        margin-left: 20rpx;
      }
    }

    .content {
      margin: 10rpx 0;

      .title {
        font-size: 33rpx;
        color: #303133;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .text {
        font-size: 33rpx;
        color: #909399;
        margin-top: 10rpx;
      }
    }
  }

  .intr-line {
    display: flex;
    align-items: flex-end;
    height: 60rpx;
    line-height: 60rpx;
    padding: 10rpx 20rpx;

    .item {
      margin-right: 30rpx;

      text {
        padding: 6rpx;
      }

      .title {
        margin-right: 10rpx;
      }
    }

    .reward {
      .money {
        font-size: 42rpx;
        font-weight: 600;
        color: #ff9900;
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
