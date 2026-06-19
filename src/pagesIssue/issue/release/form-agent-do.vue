<!--
* @Description: 打赏跑腿：代取、代购
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-09-22 11:02:37
* @LastEditors: wangxc
* @LastEditTime: 2024-09-22 11:02:37
-->
<template>
  <view class="form-box">
    <u-navbar height="44" :fixed="true" leftText="返回" :autoBack="true" :title="`信息发布-${infoCate.cateTitle}`"
      titleStyle="font-size: 15px;" bgColor="#0AB27D" :border="true"></u-navbar>
    <view class="page-body" :style="{ 'padding-top': `${sysInfo.statusBarHeight + 48}px` }">
      <form @submit="formSubmit1" report-submit="true">
        <view class="form-section action" v-if="infoCate.releaseNoteList && infoCate.releaseNoteList.length > 0">
          <view class="desc">
            <view class="action-title">注意事项:</view>
            <view class="notes-item" style="color: #fa3534" v-for="(item, idx) in infoCate.releaseNoteList" :key="idx">
              {{ item }}
            </view>
          </view>
        </view>
        <u-tabs :list="tabList" :current="curTabIdx" @change="chgTabs"></u-tabs>
        <!-- 隐藏域 -->
        <view class="form-hidden" v-show="false">
          <view class="hidden">
            <input type="text" name="bizType" :value="formData.bizType" />
            <input type="text" name="arriveAsk" :value="formData.arriveAsk" />
            <input type="text" name="workerLimit" :value="formData.workerLimit" />
            <input type="text" name="isUrgent" :value="formData.isUrgent" />
          </view>
        </view>
        <view v-if="dispRule.is_need_title === 'Y'" class="form-section action">
          <view class="col">
            <view class="col-body">
              <view class="title">标题(选填)</view>
              <view class="form-input">
                <input type="text" name="title" :value="formData.title" placeholder="代办事项标题" maxlength="40" />
              </view>
            </view>
          </view>
        </view>
        <view class="form-section">
          <view class="bottom-line title">内容描述</view>
          <view class="content">
            <textarea v-if="curTab === 'do'" name="content" maxlength="-1" v-model="formData.content" class="margin-top"
              placeholder="代办事项的具体要求、细节等(最多600字符)"></textarea>
            <textarea v-if="curTab === 'buy'" name="content" maxlength="-1" v-model="formData.content"
              class="margin-top" placeholder="代购物品信息、要求、注意事项等(最多600字符)"></textarea>
            <view class="flex end" style="font-size: 32rpx" v-if="formData.content.length > 0">
              <view> {{ formData.content.length }} / 600 </view>
            </view>
            <view class="attr-f" v-if="attrType && attrType !== 'none'">
              <view class="flex" v-if="attrType == 'video'">
                <view class="preview" v-for="(item, index) in upVideo.files" :key="index">
                  <video class="add-img margin-right" :src="item.url"></video>
                  <text @tap="delVideo(index)" :data-index="index" class="myicon icon-shanchu1 close"></text>
                </view>
                <image v-if="upVideo.num < upVideo.maxNum" @tap="chooseUpload" class="add-img"
                  src="/static/images/logo/add.png"></image>
              </view>
              <view class="flex" v-else-if="attrType == 'image'">
                <view class="preview" v-for="(item, index) in upImg.files" :key="index">
                  <image class="add-img margin-right" :src="picUrl(item.url, item.path)" @tap="previewImage(index)">
                  </image>
                  <text @tap="delImage(index)" :data-index="index" class="myicon icon-shanchu1 close"></text>
                </view>
                <image v-if="upImg.num < upImg.maxNum" @tap="chooseUpload" class="add-img"
                  src="/static/images/logo/add.png"></image>
              </view>
              <image v-else @tap="chooseUpload" class="add-img" src="/static/images/logo/add.png"></image>
            </view>
          </view>
        </view>
        <view class="alert">
          <view class="price" v-if="fee.issueFee.priceName">
            <text class="title">你本次发布信息</text>
            <text class="price-name">{{ fee.issueFee.priceName }}</text>
            <template v-if="fee.issueFee.isActivity">
              <text class="price-name">(</text>
              <text class="price-name del-line">{{ fee.issueFee.orgPriceName }}</text>
              <text class="price-name">)</text>
            </template>
          </view>
          <template v-else>
            <template v-if="['new', 'again'].includes(editType)">
              <view class="price">
                <text class="title">你本次发布信息需暂时冻结</text>
                <text class="price-name">{{ formData.reward }}元</text>
                <text class="title">打赏费</text>
              </view>
            </template>
            <template v-if="'edit' === editType">
              <view class="price" v-if="orgFormData.reward !== formData.reward">
                <text class="title">本次编辑调整冻结打赏费为:</text>
                <text class="price-name">{{ formData.reward }}元</text>
              </view>
            </template>
          </template>
        </view>
        <view class="form-section action" v-if="dispRule.is_need_contact_info === 'Y'">
          <view class="col" v-if="dispRule.is_need_contact_man === 'Y'">
            <view class="title">联系人</view>
            <view class="form-input">
              <input type="text" name="contactMan" :value="formData.contactMan" placeholder="请填写联系人" />
            </view>
          </view>
          <view class="col" v-if="dispRule.is_need_contact_phone === 'Y'">
            <text class="title">联系电话</text>
            <view class="form-input">
              <input type="number" name="phone" :value="formData.phone" placeholder="请输入您的联系电话" />
            </view>
          </view>
        </view>
        <view class="form-section action">
          <view class="col">
            <view class="col-body">
              <view class="title">跑腿赏金</view>
              <view class="form-input flex">
                <template v-if="editType === 'edit'">
                  <template v-if="subEditType && subEditType === 'rPush'">
                    <input type="digit" name="reward" :value="formData.reward" placeholder="跑腿赏金" maxlength="10"
                      style="width: 200rpx" @blur="chgReward" />
                  </template>
                  <template v-else>
                    <input type="digit" name="reward" :value="formData.reward" placeholder="跑腿赏金" maxlength="10"
                      style="width: 200rpx" :disabled="true" @blur="chgReward" />
                  </template>
                </template>
                <template v-else>
                  <input type="digit" name="reward" :value="formData.reward" placeholder="跑腿赏金" maxlength="10"
                    style="width: 200rpx" @blur="chgReward" />
                </template>
                <text>元(最低{{ isuPricePlan.minRewardAmount }}元)</text>
              </view>
            </view>
            <view class="col-tips">
              <view class="tips">
                <text>说明：</text>
                <text>如果需要调整赏金额，请先在任务详情页面中取消(下架)任务，然后重新上架任务进行修改</text>
              </view>
            </view>
          </view>
          <template v-if="curTab === 'buy'">
            <view class="col">
              <view class="col-body">
                <text class="title">送达地址</text>
                <view class="form-input">
                  <input type="text" name="putAddr" :value="formData.putAddr" maxlength="50" placeholder="请输入送达地址" />
                </view>
              </view>
            </view>
            <view class="col">
              <view class="col-body">
                <text class="title">期望送达</text>
                <view class="form-input">
                  <picker mode="selector" :range="askSpeed" range-key="t" :value="pickAskSpeedIdx"
                    @change="askSpeedChg">
                    <view class="pick-input">
                      <text>{{ pickAskSpeed.t }}</text>
                      <text class="myicon icon-xiangyou1-a"></text>
                    </view>
                  </picker>
                </view>
              </view>
            </view>
          </template>
          <view class="col">
            <view class="col-body">
              <text class="title">人员限制</text>
              <view class="form-input">
                <picker mode="selector" :range="workerRange" range-key="t" :value="pickWorkerIdx"
                  @change="workerRangeChg">
                  <view class="pick-input">
                    <text>{{ pickWorker.t }}</text>
                    <text class="myicon icon-xiangyou1-a"></text>
                  </view>
                </picker>
              </view>
            </view>
          </view>
          <view class="col">
            <view class="col-body">
              <text class="title">代办备注</text>
              <view class="form-input">
                <input type="text" name="remark" :value="formData.remark" maxlength="50"
                  placeholder="代办事项简要备注(30个字以内)" />
              </view>
            </view>
          </view>
        </view>
        <view class="form-section action">
          <view class="col">
            <view class="col-body">
              <text class="title">是否加急</text>
              <view class="form-input flex">
                <checkbox-group name="urgent" @change="chkUrgent">
                  <label>
                    <checkbox value="1" :checked="formData.isUrgent === 1" />
                    <text style="margin-left: 10rpx">加急</text>
                  </label>
                </checkbox-group>
              </view>
            </view>
          </view>
        </view>
        <view class="fix_bottom">
          <view class="downButton justify-center">
            <button class="btn_pub" form-type="submit" :style="{ background: color }">
              <template v-if="editType === 'edit'">
                <!-- 下架后重新上架需重新支付酬金(任务下架取消时会退还酬金)  -->
                <template v-if="subEditType && subEditType === 'rPush'">
                  <text>保存并上架</text>
                  <text v-if="fee.total > 0">(需支付费用¥{{ fee.total }}元)</text>
                  <text v-else-if="orgFormData.reward !== formData.reward">(调整赏金额为¥{{ formData.reward }}元)</text>
                  <text v-else>(预支付赏金¥{{ formData.reward }}元)</text>
                </template>
                <template v-else>
                  <text>编辑保存</text>
                  <text v-if="orgFormData.reward !== formData.reward">(调整赏金额为¥{{ formData.reward }}元)</text>
                </template>
              </template>
              <template v-else>
                <text>立即发布</text>
                <text v-if="fee.total > 0">(支付费用¥{{ fee.total }}元)</text>
                <text v-else>(预支付赏金¥{{ formData.reward }}元)</text>
              </template>
            </button>
          </view>
        </view>
      </form>
    </view>

    <payment ref="payPop" :payChannelAry="payChannelAry" :isCoupon="true" :canUseCouponAmount="canUseCouponAmount"
      @checkPay="checkPay" @closePayment="closePayment"></payment>
  </view>
</template>

<script>
  import releaseForm from './release-form1'
  import payment from '@/common/components/Payment'
  import {
    isEmpty,
    isNotEmpty
  } from '@/utils/validate'
  import dictLib from '@/libs/dict'
  import {
    agentAPaidAfter
  } from '@/api/isuJoin'

  export default {
    name: 'form-agent-take',
    components: {
      payment
    },
    data() {
      const $d = releaseForm.data()
      return {
        ...$d,
        formData: {
          title: '',
          content: '',
          keyWords: '',
          contactMan: '',
          phone: '',
          bizType: 'buy',
          reward: 2,
          takeAddr: '',
          putAddr: '',
          remark: '',
          arriveAsk: '0',
          workerLimit: '0',
          isUrgent: 0
        },

        fixDyFields: ['bizType', 'reward', 'takeAddr', 'putAddr', 'remark', 'arriveAsk', 'workerLimit', 'isUrgent'],

        tabList: [{
            name: '代购',
            tabLab: 'buy'
          },
          {
            name: '代办',
            tabLab: 'do'
          }
        ],
        bizType: {},
        curTab: 'buy',
        curTabIdx: 0,
        askSpeed: [...dictLib.askSpeed1],
        pickAskSpeed: dictLib.askSpeed1[0],
        pickAskSpeedIdx: 0,

        workerRange: [...dictLib.workerRange2],
        pickWorker: dictLib.workerRange2[0],
        pickWorkerIdx: 0
      }
    },
    onLoad(e) {
      this.pageOnLoad(e)
    },
    onShow(e) {
      console.log(e)
    },
    onReachBottom(e) {
      console.log(e)
    },
    computed: {
      ...releaseForm.computed
    },
    created() {},
    mounted() {},
    watch: {},
    methods: {
      ...releaseForm.methods,

      initData() {
        this.formInit()
        this.initDict()
        this.chgTabs(this.tabList[0])
      },
      initDict() {},

      /**
       * 表单初始化后处理
       */
      formInitAfter(initForm, orgForm) {
        const _that = this
        if (orgForm && orgForm.contactMan) {
          _that.formData.contactMan = orgForm.contactMan
        } else if (initForm && initForm.contactMan) {
          _that.formData.contactMan = initForm.contactMan
        }

        if (orgForm && orgForm.phone) {
          _that.formData.phone = orgForm.phone
        } else if (initForm && initForm.phone) {
          _that.formData.phone = initForm.phone
        }

        if (orgForm) {
          if (!orgForm.reward) {
            // 佣金最小值
            this.formData.reward = this.isuPricePlan.minRewardAmount
          }
          if (orgForm.bizType) {
            const idx = this.tabList.findIndex((el) => el.tabLab === orgForm.bizType)
            this.curTabIdx = idx === -1 ? 0 : idx
          }
          if (orgForm.arriveAsk) {
            const pickIdx = this.askSpeed.findIndex((el) => el.v === orgForm.arriveAsk)
            this.pickAskSpeedIdx = pickIdx == -1 ? 0 : pickIdx
            this.pickAskSpeed = this.askSpeed[this.pickAskSpeedIdx]
          }
          if (orgForm.workerLimit) {
            const pickIdx = this.workerRange.findIndex((el) => el.v === orgForm.workerLimit)
            this.pickWorkerIdx = pickIdx == -1 ? 0 : pickIdx
            this.pickWorker = this.workerRange[this.pickWorkerIdx]
          }
        } else {
          // 佣金最小值
          this.formData.reward = this.isuPricePlan.minRewardAmount
        }
      },

      chgTabs(e) {
        this.curTabIdx = e.curTabIdx
        this.curTab = e.tabLab
        this.formData.bizType = e.tabLab

        if (this.curTab === 'do') {
          this.workerRange = [...dictLib.workerRange2]
          this.pickWorker = dictLib.workerRange2[0]
        } else {
          this.workerRange = [...dictLib.workerRange3]
          this.pickWorker = dictLib.workerRange3[0]
        }
      },

      /**
       * 改变赏金事件
       */
      chgReward(e) {
        if (isNotEmpty(e.detail.value)) {
          this.formData.reward = Number(e.detail.value)
        }
      },

      askSpeedChg(e) {
        const val = e.detail.value
        this.formData.arriveAsk = val
        const pickObj = this.askSpeed.find((el) => el.v === val)
        this.pickAskSpeed = pickObj
      },

      workerRangeChg(e) {
        const val = e.detail.value
        this.formData.workerLimit = val
        const pickObj = this.workerRange.find((el) => el.v === val)
        this.pickWorker = pickObj
      },

      chkUrgent(e) {
        const v = e.detail.value
        if (v && Array.isArray(v)) {
          this.formData.isUrgent = v[0]
        } else {
          this.formData.isUrgent = 0
        }
      },

      /**
       * 具体业务其它待打包表单数据
       * @param {*} reqData
       */
      bizPackData(reqData) {
        reqData.serutyAmount = this.formData.reward
        return reqData
      },

      /**
       * 表单检查
       * @param {*} formData
       */
      speclCheck(formData) {
        if (this.curTab === 'buy' && isEmpty(formData.putAddr)) {
          this.$uniUtil.tips({
            title: '请输入送达地址'
          })
          return false
        }
        if (this.formData.reward < this.isuPricePlan.minRewardAmount) {
          this.$uniUtil.tips({
            title: `赏金最低${this.isuPricePlan.minRewardAmount}元起`
          })
          return false
        }

        /*if (_that.payMode[1].amount < this.formData.reward) {
          this.$uniUtil.tips({
            title: `请保证当前账户可用余额不低于${this.formData.reward}元`
          })
          return false
        }*/
        return true
      },

      /**
       * 获取发布时保证金事由title
       * @returns 
       */
      getSuretyTitle() {
        return '代办任务预付赏金'
      }

      /**
       * 支付完成后操作，具体业务重新定义
       */
      /*  
        payAfterProc(isuId) {
          const _that = this
          const reqVo = {
            isuId: isuId,
            cateName: _that.infoCate.cateName
          }
          return agentAPaidAfter(reqVo).then((res) => {
            if (res.code === 0) {
              const _res = res.data
              return _res
            }
            return false
          })
        },*/
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../common/scss/release/release-form.scss';

  .form-box {
    .form-section {
      .form-input {
        .list {
          display: flex;
          justify-content: space-between;
          width: 360rpx;

          .gender {
            width: 100rpx;
            height: 50rpx;
            line-height: 50rpx;
            background-color: #eee;
            text-align: center;
            border-radius: 10%;
            margin-top: 20rpx;
          }

          .gender.on {
            background-color: #f29100;
            color: #fff;
          }
        }

        .time-split {
          width: 30rpx;
          margin-right: 20rpx;
        }
      }
    }
  }
</style>