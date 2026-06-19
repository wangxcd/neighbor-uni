<!--
* @Description: 商户经营者登记其在小区的商户信息
*  说明：按正常情况，每个用户在一个小区最多拥有不超过2家商户，也不会在两家商户当员工
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2025-07-21 22:05:37
* @LastEditors: wangxc
* @LastEditTime: 2025-07-21 22:05:37
-->
<template>
  <view class="form-box">
    <u-navbar height="44" :fixed="true" leftText="返回" :autoBack="true" title="商户信息登记" titleStyle="font-size: 15px;"
      bgColor="#0AB27D" :border="true"></u-navbar>
    <view class="page-body" :style="{ 'padding-top': `${sysInfo.statusBarHeight + 48}px` }">
      <form @submit="formSubmit1" report-submit="true">
        <view class="form-section action">
          <view class="col">
            <view class="title">商户名称</view>
            <view class="form-input">
              <input type="text" name="merchTitle" :value="formData.merchTitle" placeholder="请填写商户名称" maxlength="40" />
            </view>
          </view>
          <view class="col">
            <text class="title">联系电话</text>
            <view class="form-input">
              <input type="number" name="contactPhone" value="" placeholder="请输入商户联系电话" />
            </view>
          </view>
        </view>

        <view class="form-section">
          <view class="bottom-line title">经营介绍</view>
          <view class="content">
            <textarea name="content" maxlength="-1" v-model="formData.bizDesc" class="margin-top"
              :placeholder="contentPlaceHolder"></textarea>
            <view class="flex end" style="font-size: 32rpx" v-if="formData.bizDesc.length > 0">
              <view> {{ formData.bizDesc.length }} / 600 </view>
            </view>
            <view class="attr-f" v-if="attrType && attrType !== 'none'">
              <view class="pic-sec">
                <view class="pic-head">
                  <view class="pic-title">店铺logo/门头照</view>
                  <view class="pic-note"></view>
                </view>
                <view class="pic-body">
                  <view class="qun-qr">
                    <view class="preview" v-if="upImg.keyMap['mLogo']">
                      <image class="add-img margin-right"
                        :src="picUrl(upImg.keyMap['mLogo'].url, upImg.keyMap['mLogo'].path)"
                        @tap="previewImage(null, 'mLogo')"></image>
                      <text @tap="delImage(null, 'mLogo')" class="myicon icon-shanchu1 close"></text>
                    </view>
                    <view v-else class="add">
                      <image @tap="chooseImage('mLogo')" class="add-img" src="/static/images/logo/add.png"></image>
                      <text class="add-lab">logo/门头照</text>
                    </view>
                  </view>
                </view>
              </view>
              <view class="pic-sec">
                <view class="pic-head">
                  <view class="pic-title">店铺照片</view>
                  <view class="pic-note">店铺外与店铺内照片</view>
                </view>
                <view class="pic-body">
                  <view class="qun-qr">
                    <view class="preview" v-if="upImg.keyMap['promo1']">
                      <image class="add-img margin-right"
                        :src="picUrl(upImg.keyMap['promo1'].url, upImg.keyMap['promo1'].path)"
                        @tap="previewImage(null, 'promo1')"></image>
                      <text @tap="delImage(null, 'promo1')" class="myicon icon-shanchu1 close"></text>
                    </view>
                    <view v-else class="add">
                      <image @tap="chooseImage('promo1')" class="add-img" src="/static/images/logo/add.png"></image>
                      <text class="add-lab">店铺外照片</text>
                    </view>
                  </view>
                  <view class="qun-qr">
                    <view class="preview" v-if="upImg.keyMap['promo2']">
                      <image class="add-img margin-right"
                        :src="picUrl(upImg.keyMap['promo2'].url, upImg.keyMap['promo2'].path)"
                        @tap="previewImage(null, 'promo2')"></image>
                      <text @tap="delImage(null, 'promo2')" class="myicon icon-shanchu1 close"></text>
                    </view>
                    <view v-else class="add">
                      <image @tap="chooseImage('promo2')" class="add-img" src="/static/images/logo/add.png"></image>
                      <text class="add-lab">店铺内照片</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="form-section action">
          <view class="col">
            <text class="title">店铺位置</text>
            <view class="form-input">
              <template v-if="localComm.comm.comType === '2'">
                <view class="input-row">
                  <view class="input-item-2">
                    <input style="width: 150rpx" type="text" name="buildPark" value="" placeholder="自然村" />村
                  </view>
                  <view class="input-item-2">
                    <input style="width: 150rpx" type="text" name="buildNo" value="" placeholder="生产小组" />
                  </view>
                </view>
              </template>
              <template v-else>
                <view class="input-row">
                  <view class="input-item-2">
                    <input type="text" name="buildPark" value="" placeholder="园区名(选填)" />
                  </view>
                  <view class="input-item-2">
                    <input style="width: 150rpx" type="text" name="buildNo" value="" placeholder="楼栋(幢)" />楼
                  </view>
                </view>
              </template>
            </view>
          </view>
        </view>
      </form>
    </view>
  </view>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    isEmpty
  } from '@/utils/validate'
  import releaseForm from '@/pagesIssue/issue/release/release-form1'

  export default {
    name: 'merchreg',
    components: {},
    data() {
      const $d = releaseForm.data()

      return {
        ...$d,
        formData: {
          merchTitle: '',
          contactPhone: '',
          bizDesc: '',
          bizLicenseUrl: '',
          officePicUrl: ''
        }
      }
    },
    onLoad(e) {},
    onShow(e) {},
    onReachBottom(e) {},
    computed: {
      ...releaseForm.computed
    },
    created() {},
    mounted() {},
    watch: {},
    methods: {
      ...releaseForm.methods,

      initData() {},

      /**
       * 表单检查
       * @param {*} formData
       */
      speclCheck(formData) {
        const _that = this
        if (isEmpty(formData.estateName)) {
          this.$uniUtil.tips({
            title: '请输入商户名称'
          })
          return false
        }
        if (isEmpty(formData.contactPhone)) {
          this.$uniUtil.tips({
            title: '请输入联系电话'
          })
          return false
        }


        if (_that.upImg.files) {
          const bizLicense = _that.upImg.files.find((el) => el.key === 'bizLicense')
          const officePic = _that.upImg.files.find((el) => el.key === 'officePic')
          const workerPic = _that.upImg.files.find((el) => el.key === 'workerPic')

          if (!bizLicense || isEmpty(bizLicense.path)) {
            this.$uniUtil.tips({
              title: '必须提供物业单位营业执照照片'
            })
            return false
          }
          if (!officePic || isEmpty(officePic.path)) {
            this.$uniUtil.tips({
              title: '必须提供物业单位办公室照片'
            })
            return false
          }
          if (!workerPic || isEmpty(workerPic.path)) {
            this.$uniUtil.tips({
              title: '必须提供登记人的物业工作证明照片'
            })
            return false
          }
        }
        return true
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../common/scss/release/release-form.scss';

  .form-box {
    .attr-f {
      .pic-sec {
        border-top: 1px dashed #f4f4f5;

        .pic-head {
          display: flex;
          justify-content: space-between;
          margin: 20rpx 0;

          .pic-title {
            font-size: 30rpx;
            color: #303133;
            font-weight: 600;
          }

          .pic-note {
            font-size: 28rpx;
            color: #909399;
          }
        }

        .pic-body {
          display: flex;

          .qun-qr {
            margin-right: 20rpx;

            .add {
              position: relative;

              .add-lab {
                position: absolute;
                bottom: 50rpx;
                left: 50%;
                transform: translateX(-50%);
                width: 180rpx;
                text-align: center;
              }
            }
          }
        }
      }
    }
  }
</style>