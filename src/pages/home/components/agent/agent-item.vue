<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-09-29 16:02:31
* @LastEditors: wangxc
* @LastEditTime: 2024-09-29 16:02:31
-->
<template>
  <view class="agent-item-box list-box">
    <view class="item agent" @click="gotoFull">
      <view class="title-line">
        <view class="tag" v-if="dyData.isUrgent === 1">紧急</view>
        <view class="item-title">{{ infoData.title }}</view>
        <view class="reward" style="text-align: right" v-if="infoData.isIsuer === 1">
          <text class="lab">打赏</text>
          <text class="desc">{{ dyData.reward }}元</text>
        </view>
        <view class="reward" style="text-align: right" v-else>
          <text class="lab">打赏</text>
          <text class="desc">{{ dyData.bCalcRecReward }}元</text>
        </view>
      </view>
      <template v-if="['take', 'sent', 'buy', 'do'].includes(dyData.bizType)">
        <view class="desc-line">
          <view class="limit">
            <text class="lab">人员要求</text>
            <text class="desc">{{ pickWorker.t }} </text>
          </view>
        </view>
        <view class="desc-line">
          <view class="limit">
            <text class="lab">时效要求</text>
            <text class="desc">{{ pickAskSpeed.t }} </text>
          </view>
          <text class="split"></text>
          <view class="addr" v-if="dyData.putAddr">
            <text class="lab">送达地址</text>
            <text class="desc">{{ dyData.putAddr }} </text>
          </view>
        </view>
      </template>

      <template v-else-if="['trash'].includes(dyData.bizType)">
        <view class="desc-line">
          <view class="limit">
            <text class="lab">垃圾大小</text>
            <text class="desc">{{ pickTrashSize.t }} </text>
          </view>
          <text class="split"> </text>
          <view class="limit">
            <text class="lab">垃圾数量</text>
            <text class="desc">{{ dyData.trashNum || 1 }} </text>
          </view>
        </view>
      </template>

      <view class="desc-line" v-else-if="dyData.bizType === 'with'">
        <view class="limit">
          <text class="lab">活动时间</text>
          <text class="desc">{{ dyData.actDate }} {{ dyData.actTimeStart }}~{{ dyData.actTimeEnd }}</text>
        </view>
      </view>

      <view class="desc-line">
        <view class="left">
          <view class="cate">
            <text class="lab">类目</text>
            <text class="desc">{{ infoCate.cateTitle }}</text>
          </view>
          <view class="past_time">
            <text class="desc">{{ timeAgo }}</text>
          </view>
        </view>
        <view class="state">
          <template v-if="[4,6,8].includes(infoData.status)">
            <view v-if="[1, 2].includes(spfs.runingStatus)" class="opt-btn" >接单中</view>
            <view v-else-if="[4, 5, 6].includes(spfs.runingStatus)" class="opt-btn" style="color: #1cb40b;">进行中</view>
            <view v-else-if="[7].includes(spfs.runingStatus)" class="opt-btn" style="color: #b22155;">已完结</view>
          </template>
          <template v-else-if="infoData.status === infoStatus.PULL">
            <view class="opt-btn" style="color: #5aa2ac;">已下架</view>
          </template>
          <template v-else-if="infoData.status === infoStatus.EXPIRE">
            <view class="opt-btn" style="color: #9e9e9e;">已过期</view>
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
import dictLib from '@/libs/dict'
import isuCate from '@/libs/isucate'

export default {
  name: 'agent-item',
  components: {},
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      askSpeed: [...dictLib.askSpeed1],
      workerRange: [...dictLib.workerRange1],
      pickAskSpeed: dictLib.askSpeed1[0],
      pickWorker: dictLib.workerRange1[0],
      pickTrashSize: dictLib.trashSize1[0],

      mCateName: 'qzjy',
      infoData: {},
      infoCate: {},
      timeAgo: '很久前',
      dyData: {
        reward: '0.00'
      },
      spfs: {},

      infoStatus: {
        ...consdef.issue.infoStatus
      }
    }
  },
  computed: {
    ...mapGetters({
      sysInfo: 'app/sysInfo',
      localComm: 'app/localComm',
      uid: 'user/uid'
    })
  },
  created() {
    this.init(this.info)
  },
  mounted() {},
  watch: {
    info: {
      handler(v) {
        this.init(v)
      },
      deep: true
    }
  },
  methods: {
    init(info) {
      const _that = this
      if (info) {
        const { userLiveInfo, dyFormData, speclFields, ...isuInfo } = { ...this.info }
        this.infoData = isuInfo
        this.timeAgo = this.$util.timeAgo(this.info.isuTime)

        if (isNotEmpty(dyFormData)) {
          _that.dyData = dyFormData
          _that.pickAskSpeed = this.askSpeed.find((el) => el.v === _that.dyData.arriveAsk)

          if (_that.dyData.bizType === 'take' || _that.dyDatabizType === 'sent') {
            this.pickWorker = dictLib.workerRange1.find((el) => el.v === _that.dyData.workerLimit)
          } else if (_that.dyData.bizType === 'do') {
            this.pickWorker = dictLib.workerRange2.find((el) => el.v === _that.dyData.workerLimit)
          } else if (_that.dyData.bizType === 'buy') {
            this.pickWorker = dictLib.workerRange3.find((el) => el.v === _that.dyData.workerLimit)
          } else if (_that.dyData.bizType === 'trash') {
            this.pickTrashSize = dictLib.trashSize1.find((el) => el.v === _that.dyData.trashSize)
          } else if (_that.dyData.bizType === 'with') {
          }
        }

        // 菜单类目
        isuCate.getIsuCateById(this.infoData.cateId).then((r) => {
          _that.infoCate = r
          _that.cateTitleWin = r.cateTitle.length * 20 + 80
          if (r.parCateId !== -1) {
            isuCate.getIsuCateById(r.parCateId).then((r2) => {
              _that.mCate = r2
            })
          }
        })

        // 专有内容
        if (isuInfo.runingStatus != undefined) {
          this.spfs.runingStatus = isuInfo.runingStatus
        }
      }
    },

    gotoFull() {
      const _that = this
      // 非发布者本人不能看到已下架、已过期的信息
      if (_that.uid != _that.infoData.uid && (_that.infoData.status === _that.infoStatus.PULL || _that.infoData.status === _that.infoStatus.EXPIRE)) {
        this.$uniUtil.tips({
          title: _that.infoData.status === _that.infoStatus.PULL ? '信息已下架' : '信息已过期'
        })
        return false
      }

      this.$Router.push({
        name: 'isuInfoDetail',
        params: {
          isuId: _that.infoData.isuId,
          cateId: _that.infoData.cateId,
          mCateName: _that.mCateName,
          comId: _that.localComm.comm.comId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../common/scss/home-block.scss';

.agent-item-box {
  .item {
    margin: 20rpx 0;
    padding: 0 20rpx;
    align-items: center;
    justify-content: space-between;

    .lab {
      color: #999;

      &::after {
        content: ': ';
      }
    }

    .desc {
      color: #999;
    }

    .split {
      padding: 0 10rpx;
    }

    .limit {
      margin-right: 10rpx;

      .desc {
        color: #82848a;
      }
    }

    .cate {
      .desc {
        color: rgb(218, 19, 142);
      }
    }

    .past_time {
      .desc {
        color: rgb(11, 134, 28);
      }
    }

    .reward {
      width: 200rpx;
      padding-right: 10rpx;

      .desc {
        color: goldenrod;
      }
    }
  }

  .agent {
    border-bottom: 1px dashed #eceaea;

    .title-line {
      display: flex;
      justify-content: space-between;
      font-size: 32rpx;

      .tag {
        width: 64rpx;
        height: 26rpx;
        line-height: 26rpx;
        font-size: 20rpx;
        color: #ff4c48;
        border-radius: 26rpx;
        text-align: center;
        border: 2rpx solid #ff4947;
      }

      .item-title {
        width: 480rpx;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .desc-line {
      display: flex;
      font-size: 24rpx;
      margin: 15rpx 0;

      .left {
        flex: 1;
        display: flex;
      }

      .state {
        width: 100rpx;

        .opt-btn {
          height: 42rpx;
          line-height: 42rpx;
          text-align: center;
          background-color: aliceblue;
          color: darkblue;
          border-radius: 10rpx;
        }
      }

      .addr {
        flex: 1;
      }
    }
  }
}
</style>
