<!--
* @Description: 通用信息发布
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-07-13 11:14:41
* @LastEditors: wangxc
* @LastEditTime: 2024-07-13 11:14:41
-->
<template>
  <view class="form-box">
    <u-navbar height="44" :fixed="true" leftText="返回" :autoBack="true" title="信息发布" bgColor="#0AB27D"
      :border="true"></u-navbar>
    <view class="page-body" :style="{ 'padding-top': `${sysInfo.statusBarHeight + 48}px` }">
      <form @submit="formSubmit1" report-submit="true">
        <view v-if="dispRule.is_need_title === 'Y'" class="form-section action">
          <view class="col">
            <view class="title">标题</view>
            <view class="form-input">
              <input type="text" name="title" :value="formData.title" placeholder="请填写信息标题" maxlength="40" />
            </view>
          </view>
        </view>
        <view class="form-section">
          <view class="bottom-line title">内容描述</view>
          <view class="content">
            <textarea name="content" maxlength="-1" v-model="formData.content" class="margin-top"
              placeholder="请输入内容描述(最多600字符)"></textarea>
            <view class="flex end" style="font-size: 32rpx" v-if="formData.content.length > 0">
              <view style="char-count"> {{ formData.content.length }} / 600 </view>
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
        <view class="form-section action" v-if="dispRule.is_need_keywords === 'Y'">
          <view class="col">
            <view class="title">关键字</view>
            <view class="form-input">
              <input type="text" name="keyWords" value="" placeholder="可以输入最多3个多键字" />
            </view>
          </view>
          <view class="desc">
            <view style="color: #18b566">关键字可增加信息的辩识度，利于他人快速了解信息内容概要。</view>
            <view style="color: #18b566">关键字为1-4个字符，关键字之间以空格或逗号分隔。 </view>
            <view style="color: #dd6161">示例：出售 二手 洗衣机</view>
          </view>
        </view>
        <view class="alert">
          <view class="price">
            <text class="title">你本次发布信息</text>
            <text class="price">{{ fee.issueFee.priceName }}</text>
          </view>
          <view class="term">
            <text class="title">有效期</text>
            <text class="term">{{ fee.issueFee.termName }}</text>
          </view>
        </view>
        <view class="form-section action" v-if="dispRule.is_need_contact_info === 'Y'">
          <view class="col" v-if="dispRule.is_need_contact_man === 'Y'">
            <view class="title">联系人</view>
            <view class="form-input">
              <input type="text" name="contactMan" :value="userInfo.nickName" placeholder="请填写联系人" />
            </view>
          </view>
          <view class="col" v-if="dispRule.is_need_contact_phone === 'Y'">
            <text class="title">联系电话</text>
            <view class="form-input">
              <input type="number" name="phone" :value="userInfo.mobile" placeholder="请输入您的联系电话" />
            </view>
          </view>
        </view>
        <view class="form-section action" v-if="dispRule.is_need_build_pos === 'Y'">
          <view class="col">
            <text class="title">具体位置</text>
            <view class="form-input">
              <template v-if="localComm.comm.comType === '2'">
                <view class="input-row">
                  <view class="input-item-2" v-if="dispRule.is_need_build_park === 'Y'">
                    <input style="width: 150rpx" type="text" name="buildPark" value="" placeholder="自然村" />村
                  </view>
                  <view class="input-item-2" v-if="dispRule.is_need_build_no === 'Y'">
                    <input style="width: 150rpx" type="text" name="buildNo" value="" placeholder="生产小组" />
                  </view>
                </view>
              </template>
              <template v-else>
                <view class="input-row">
                  <view class="input-item-2" v-if="dispRule.is_need_build_park === 'Y'">
                    <input type="text" name="buildPark" value="" placeholder="园区名" />
                  </view>
                  <view class="input-item-2" v-if="dispRule.is_need_build_no === 'Y'">
                    <input style="width: 150rpx" type="text" name="buildNo" value="" placeholder="楼栋(幢)" />楼
                  </view>
                  <view class="input-item-2" v-if="dispRule.is_need_build_unit === 'Y'">
                    <input style="width: 120rpx" type="text" name="buildUnit" value="" placeholder="楼单元" />单元
                  </view>
                  <view class="input-item-2" v-if="dispRule.is_need_build_room === 'Y'">
                    <input style="width: 150rpx" type="text" name="buildRoom" value="" placeholder="门牌号" />室
                  </view>
                </view>
              </template>
            </view>
          </view>
        </view>
        <view class="form-section action">
          <view class="col">
            <view class="title">我要置顶</view>
            <view class="form-input">
              <switch class="rt" :color="topCtrl.color" @change="switchTopChange" :checked="topCtrl.open"></switch>
            </view>
          </view>
          <template v-if="topPricePlan.isLadder">
            <view class="top_picker" v-if="topCtrl.open">
              <view class="picker-title">
                <text>选择置顶时间</text>
              </view>
              <view class="picker-list">
                <block v-for="item in topPricePlan.ladderPriceStep" :key="item.stepId">
                  <view :class="{ top_item: true, item_checked: item.stepId === topCtrl.usePrice.stepId }"
                    @click="checkTopPrice(item)">
                    <view class="term">{{ item.stepName }}</view>
                    <view class="real_price">¥{{ item.stepPayPrice }}</view>
                    <view class="org_price" v-if="item.orginPayPrice > item.stepPayPrice"> 原价¥{{ item.orginPayPrice }}
                    </view>
                  </view>
                </block>
              </view>
              <view class="clear" style="clear: both"></view>
            </view>
          </template>
          <template v-else>
            <view class="item" v-if="topCtrl.open">
              <text>我要置顶</text>
              <text class="rt" style="color: #f00">¥{{ topPricePlan.payBasePrice }}</text>
            </view>
          </template>
        </view>
        <view class="fix_bottom">
          <view class="downButton justify-center">
            <button class="btn_pub" form-type="submit" :style="{ background: color }">
              <text>立即发布</text>
              <text v-if="fee.total > 0">(需支付费用¥{{ fee.total }}元)</text>
            </button>
          </view>
        </view>
      </form>
    </view>

    <payment ref="payPop" :payChannelAry="payChannelAry" :isCoupon="true" @checkPay="checkPay"
      @closePayment="closePayment">
    </payment>
  </view>
</template>

<script>
  import releaseForm from '../release-form'
  import payment from '@/common/components/Payment'

  export default {
    name: 'form-normal',
    components: {
      payment
    },
    props: {
      sCateId: {
        type: Number,
        default: 0
      }
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
          buildPark: '',
          buildNo: '',
          buildUnit: '',
          buildRoom: ''
        }
      }
    },
    computed: {
      ...releaseForm.computed
    },
    created() {},
    watch: {
      sCateId: {
        handler(newVal, oldVal) {
          this.cateId = newVal
          this.initData()
        }
      }
    },
    methods: {
      ...releaseForm.methods,

      initData() {
        this.formInit()
      },

      /**
       * 表单初始化后处理
       */
      formInitAfter(initForm, orgForm) {
        const _that = this 
        if (orgForm.contactMan) {
          _that.formData.contactMan = orgForm.contactMan
        } else if(initForm.contactMan) {
          _that.formData.contactMan = initForm.contactMan
        }

        if (orgForm.phone) {
          _that.formData.phone = orgForm.phone
        } else if(initForm.phone) {
          _that.formData.phone = initForm.phone
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../../common/scss/release/release-form.scss';
</style>