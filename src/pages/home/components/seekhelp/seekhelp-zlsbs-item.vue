<!--
* @Description: 求助列表项组件
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-19 16:48:10
* @LastEditors: wangxc
* @LastEditTime: 2024-04-19 16:48:10
-->
<template>
  <view class="seekhelp-item-box" @click="gotoFull">
    <view class="item agent">
      <view class="title-line">
        <view class="tag" v-if="dyData.isUrgent && dyData.isUrgent === 1">紧急</view>
        <view class="item-title">{{ infoData.title }}</view>
        <view class="past_time">
          <text class="desc">{{ timeAgo }}</text>
        </view>
      </view>
      <view class="desc-line">
        <view class="reward" v-if="infoData.isIsuer === 1">
          <text class="lab">酬金</text>
          <text class="desc">{{ !dyData.reward || Number(dyData.reward) === 0 ? '面议' : dyData.reward + '元' }}</text>
        </view>
        <view class="reward" v-else>
          <text class="lab">酬金</text>
          <text class="desc">{{ !dyData.bCalcRecReward || Number(dyData.bCalcRecReward) === 0 ? '面议' : dyData.bCalcRecReward + '元' }}</text>
        </view>
        <view class="limit">
          <text class="lab">要求</text>
          <text class="desc">{{ dyData.gender === 0 ? '男女不限' : dyData.gender === 1 ? '男' : '女' }} / {{ dyData.minAge }} ~ {{ dyData.maxAge }}岁</text>
        </view>
      </view>
      <view class="desc-line">
        <view class="addr">
          <text class="lab">用工时间</text>
          <text class="desc">{{ dyData.laborDate }} {{ dyData.laborTimeStart }}</text>
        </view>
        <view class="state">
          <view v-if="infoData.status === infoStatus.PULL" class="opt-btn">已下架</view>
          <view v-else-if="infoData.status === infoStatus.EXPIRE" class="opt-btn">已过期</view>
          <view v-else-if="spfs.runingStatus === taskRunStatus.ZG_ING" class="opt-btn">正在招工</view>
          <view v-else-if="spfs.runingStatus === taskRunStatus.ZG_PAUSE" class="opt-btn">招工暂停</view>
          <view v-else-if="[taskRunStatus.ZG_OK, taskRunStatus.TASK_SIGN].includes(spfs.runingStatus)" class="opt-btn">招工完成</view>
          <view v-else-if="spfs.runingStatus === taskRunStatus.TASK_RUNING" class="opt-btn">用工进行中</view>
          <view v-else-if="spfs.runingStatus === taskRunStatus.TASK_FINISH" class="opt-btn">已结束</view>
        </view>
      </view>
      <view class="desc-line">
        <view class="cate-tag">
          <text class="lab">类目</text>
          <text class="desc">找临时帮手/帮工</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import { isNotEmpty } from '@/utils/validate'
import consdef from '@/common/js/constant/consdef.js'

export default {
  name: 'seekhelpItem',
  components: {},
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      mCateName: 'qzjy',
      infoData: {},
      timeAgo: '很久前',
      dyData: {
        reward: '0.00'
      },
      spfs: {},

      taskRunStatus: {
        ...consdef.issue.labourTaskRunStatus
      },

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
  watch: {
    info: {
      handler: function (newVal) {
        this.init(newVal)
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

          if (_that.dyData.laborDate && _that.dyData.laborTimeStart) {
            const timeStart = _that.dyData.laborDate + ' ' + _that.dyData.laborTimeStart + ':00'
            _that.dyData.timeStart = timeStart
          }
        }

        // 专有内容
        if (isuInfo.runingStatus) {
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
.seekhelp-item-box {
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
      justify-content: space-between;
      font-size: 24rpx;
      margin: 15rpx 0;

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
    }
  }

  .cate-tag {
    width: 300rpx;
    margin-right: 10rpx;

    .desc {
      color: #e45656;
    }
  }

  .addr {
    width: 350rpx;
    margin-right: 10rpx;

    .desc {
      color: rgb(218, 19, 142);
    }
  }

  .limit {
    margin-right: 10rpx;
    width: 400rpx;

    .desc {
      color: #398ade;
    }
  }

  .past_time {
    width: 200rpx;

    .desc {
      color: rgb(11, 134, 28);
      float: right;
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
</style>
