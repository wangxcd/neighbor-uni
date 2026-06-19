<!--
* @Description: 用户充值
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-07-24 13:02:33
* @LastEditors: wangxc
* @LastEditTime: 2024-07-24 13:02:33
-->
<template>
  <view class="user-recharge-box">
    <view class="my-account">
      <view class="header sec-box">
        <view class="headerCon">
          <view class="account acea-row row-top">
            <view class="assets">
              <view>总资金(元)</view>
              <view class="money">{{ userAct.totalAmount ? userAct.totalAmount.toFixed(2) : '0.00' }}</view>
            </view>
            <view class="assets">
              <view>可用资金(元)</view>
              <view class="money">{{ userAct.canUseAmount ? userAct.canUseAmount.toFixed(2) : '0.00' }}</view>
            </view>
          </view>
        </view>
      </view>
      <form @submit="submitSub" report-submit="true">
        <view class="payment">
          <view class="title">
            <view class="item">账户充值</view>
          </view>
          <view class="pic-list">
            <view class="pic-box" :class="activePick === index ? 'box-active' : ''" v-for="(item, index) in prodDefList"
              :key="index" @click="pickCharge(index, item)">
              <view class="pic-number-pic"> {{ item.price * item.prodNum }}<text class="pic-number"> 元</text> </view>
              <view class="gift-list" v-if="item.isGift">
                <view class="tip">送</view>
                <view class="bundle">
                  <view class="gift" v-if="item.bundleCashAmount && item.bundleCashAmount > 0">
                    {{ item.bundleCouponAmount }}元现金
                  </view>
                  <view class="gift" v-if="item.bundleCouponAmount && item.bundleCouponAmount > 0">
                    {{ item.bundleCouponAmount }}元消费券
                  </view>
                  <view class="gift" v-if="item.bundleIntegral && item.bundleIntegral > 0">
                    {{ item.bundleCouponAmount }}积分</view>
                </view>
              </view>
            </view>
          </view>
          <view class="tips-box">
            <view class="tips mt-30">注意事项：</view>
            <view class="tips-samll" v-for="item in rechargeNotes" :key="item">
              {{ item }}
            </view>
          </view>
          <button class="but" formType="submit">立即充值</button>
        </view>
      </form>
    </view>

    <payment ref="payPop" :payChannelAry="payChannelAry" :isCoupon="false" @checkPay="checkPay"
      @closePayment="closePayment"></payment>
  </view>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    getUserAccount
  } from '@/api/user'
  import {
    getProdDefList,
    buyProdFormPreOrder,
    buyProdFormCrtOrder,
    buyProdPayForWeixin,
    buyProdPayWeixinRes,
  } from '@/api/prodOrder'
  import payment from '@/common/components/Payment'

  export default {
    name: 'user-recharge',
    components: {
      payment,
    },
    data() {
      return {
        userAct: {}, //账户总信息
        prodDefList: [],
        rechargeNotes: [],

        activePick: 0,

        // 支付处理相关
        payChannelAry: [{
          name: '微信支付',
          icon: 'icon-weixin1',
          value: 'WRoutine', // 此处为微信小程序支付
          title: '微信快捷支付',
          lastAmount: -1,
          prior: 3
        }],

        pay: {
          show: false,
          orderNo: '',
          totalPrice: 0.0,
          payChannel: '',
          attach: {},
          // 支付结果定时查询器
          payResInterval: null,
        },
      }
    },
    onLoad(e) {
      console.log(e)
    },
    onShow(e) {
      this.getUserActInfo()
    },
    onReachBottom(e) {
      console.log(e)
    },
    computed: {
      ...mapGetters({
        sysInfo: 'app/sysInfo',
        userInfo: 'user/userInfo',
        uid: 'user/uid',
      }),
    },
    created() {
      this.initProdDefList()
    },
    mounted() {},
    watch: {},
    methods: {
      getUserActInfo() {
        const _that = this
        getUserAccount().then((res) => {
          if (res.code === 0) {
            const _res = res.data
            if (_res) {
              _that.userAct = _res
            }
          }
        })
      },

      initProdDefList() {
        const _that = this
        getProdDefList({
          prodType: '1'
        }).then((res) => {
          if (res.code === 0) {
            const {
              prodDefineList,
              rechargeNotes
            } = {
              ...res.data
            }
            if (prodDefineList) {
              _that.prodDefList = prodDefineList.map(item => {
                item.isGift = false
                if ((item.bundleCashAmount && item.bundleCashAmount > 0) ||
                  (item.bundleCouponAmount && item.bundleCouponAmount > 0) ||
                  (item.bundleIntegral && item.bundleIntegral > 0)) {
                  item.isGift = true
                }
                return item;
              })
              const idx = _that.prodDefList.findIndex((el) => el.isRecomm === 1)
              if (idx !== -1) {
                _that.activePick = idx
              }
            }
            if (rechargeNotes) {
              _that.rechargeNotes = rechargeNotes
            }
          }
        })
      },

      pickCharge(idx, item) {
        this.activePick = idx
      },

      submitSub(e) {
        const _that = this
        uni.showLoading({
          mask: true,
        })

        const req = this.prodDefList[this.activePick].prodId
        buyProdFormPreOrder(req).then((res) => {
          uni.hideLoading()
          if (res.code === 0) {
            if (res.data) {
              const _res = res.data
              _that.goPay(_res.orderId, _res.feeAmount)
            }
          }
        })
      },

      /**
       * 打开支付组件
       *
       */
      goPay(orderId, feeAmount) {
        this.pay.show = true
        this.pay.orderNo = orderId
        this.pay.totalPrice = feeAmount
        this.pay.attach = {
          editType: 'recharge',
        }

        const payOrder = {
          totalAmount: feeAmount,
          orderCode: this.pay.orderNo,
          attachs: this.pay.attach
        }
        this.$refs.payPop.beforeOpen(true, payOrder)
      },

      closePayment(e) {
        let opt = e
        let action = opt.action || null
        let value = opt.value || null
        action && this[action] && this[action](value)
      },

      /**
       * 关闭支付组件
       *
       */
      payClose: function() {
        this.payShow = false
      },

      /**
       * 支付成功回调
       *
       */
      payComplete: function() {
        this.status = false
        this.pay.show = false
      },

      /**
       * 支付失败回调
       *
       */
      payFail() {
        this.pay.show = false
      },

      /**
       * 支付组件选择支付方式后的支付处理
       * @param {*} payChannel
       * @param {*} payOrderNo
       * @param {*} totalPrice
       * @param {*} attach
       */
      checkPay(payChannel, payOrderNo, totalPrice, attach) {
        const _that = this
        if (attach && attach.editType) {
          uni.showLoading({
            mask: true,
          })
          const editType = attach.editType
          if (editType === 'recharge') {
            _that.createFormSubmit(payChannel, payOrderNo)
          } else {
            uni.hideLoading()
          }
        }
      },

      /**
       * 创建充值表单提交
       */
      createFormSubmit(payChannel, payOrderNo) {
        const _that = this
        this.pay.payChannel = payChannel
        const req = {
          uid: _that.uid,
          payChannel: payChannel,
          preOrderNo: payOrderNo,
        }

        // 创建订单
        buyProdFormCrtOrder(req).then((res) => {
          if (res.code === 0) {
            const _res = res.data
            if (_res) {
              const {
                orderNo
              } = _res.columns
              if (!orderNo) {
                uni.hideLoading()
                _that.$uniUtil.tips({
                  title: '充值支付订单创建失败'
                })
              }

              if (payChannel === 'WRoutine') {
                // 微信支付
                _that.weixPay(orderNo)
              } else if (payChannel === 'WH5') {
                // 微信h5支付
                console.log('WH5')
              }
            }
          } else {
            _that.$uniUtil.tips({
              title: res.msg
            })
          }
        })
      },

      /**
       * 调用微信支付
       */
      weixPay(orderNo) {
        const _that = this
        // 后端微信支付处理
        buyProdPayForWeixin({
          orderNo: orderNo,
          payChannel: _that.pay.payChannel,
        }).then((res) => {
          if (res.code === 0) {
            const _res = res.data

            const wxPayConfig = _res.wxPayConfig

            // #ifdef MP
            // 拉起微信支付弹窗
            uni.requestPayment({
              timeStamp: wxPayConfig.timeStamp,
              nonceStr: wxPayConfig.nonceStr,
              package: wxPayConfig.packageValue,
              signType: wxPayConfig.signType,
              paySign: wxPayConfig.paySign,
              success: function(ress) {
                if (ress && ress.errMsg === 'requestPayment:ok') {
                  buyProdPayWeixinRes({
                    orderNo: _res.payOrderNo,
                  }).then((res2) => {
                    _that.$uniUtil.tips({
                      title: '充值成功'
                    })
                    // 关闭支付弹窗
                    _that.payClose()
                    setTimeout(function() {
                      /* uni.navigateTo({
                        url: '/pagesUser/myissue/myissue?showIdx=0'
                      }) */
                      _that.$Router.replace({
                        name: 'userMoney',
                        params: {},
                      })
                    }, 1000)
                  })
                }
              },
              fail: function(e) {
                if (e) {
                  if (e.errMsg === 'requestPayment:fail cancel') {
                    _that.$uniUtil.tips({
                      title: '用户取消支付'
                    })
                  } else {
                    _that.$uniUtil.tips({
                      title: '支付失败'
                    })
                  }
                } else {
                  _that.$uniUtil.tips({
                    title: '支付失败'
                  })
                }
              },
              complete: function(e) {
                uni.hideLoading()
              },
            })
            // #endif
            // #ifdef H5
            // #endif
          }
        })
      },

      /**
       * 支付完成后操作，具体业务重新定义
       */
      payAfterProc(isuId) {
        return new Promise((resove, reject) => {
          resove(true)
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .user-recharge-box {
    .my-account {
      .sec-box {
        width: 710rpx;
        border-radius: 16rpx;
        margin: 20rpx auto;
        box-sizing: border-box;
      }

      .header {
        width: 710rpx;
        background-image: linear-gradient(to right, #f33b2b 0%, #f36053 100%);
        color: rgba(255, 255, 255, 0.6);
        font-size: 24rpx;

        .headerCon {
          height: 100%;
          width: 100%;
          padding: 36rpx 0 29rpx 0;
          box-sizing: border-box;

          .account {
            padding: 0 35rpx;
            -o-box-pack: justify;
            justify-content: space-around;

            .assets .money {
              font-size: 48rpx;
              color: #fff;
              font-family: 'Guildford Pro';
              margin-top: 20rpx;
            }
          }
        }
      }

      .payment {
        position: relative;
        margin: 20rpx;
        background-color: #fff;
        border-radius: 10rpx;
        padding: 25rpx 0 60rpx 0;
        border-top-right-radius: 14rpx;
        border-top-left-radius: 14rpx;

        .title {
          height: 75rpx;
          line-height: 75rpx;
          padding: 0 30rpx;

          .item {
            font-size: 36rpx;
            color: #333;
            font-weight: bold;
            border-bottom: 4rpx solid #e83323;
          }
        }

        .pic-list {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          margin: 30rpx 0;
          font-size: 26rpx;
          color: #888888;
          padding: 0 30rpx;
          margin-top: 25rpx;

          .pic-box {
            width: 200rpx;
            height: 200rpx;
            border-radius: 20rpx;
            margin-top: 21rpx;
            padding: 20rpx 0;
            margin-right: 12rpx;
            background-color: #f4f4f4;
            color: #656565;
            display: flex;
            -webkit-box-lines: multiple;
            -moz-box-lines: multiple;
            -o-box-lines: multiple;
            flex-wrap: wrap;
            -o-box-align: center;
            align-items: center;
            -o-box-pack: center;
            justify-content: center;
            -o-box-orient: vertical;
            flex-direction: column;

            .pic-number-pic {
              font-size: 38rpx;
              margin-right: 10rpx;
              text-align: center;
            }

            .gift-list {
              display: flex;
              justify-content: flex-start;
              margin-top: 5rpx;

              .tip {
                width: 30rpx;

                &::after {
                  content: ':';
                }
              }

              .bundle {
                flex: 1;

                .gift {
                  margin-left: 5rpx;
                }
              }
            }
          }

          .box-active {
            background-color: #ec3323 !important;
            color: #fff !important;
          }
        }

        .tips-box {
          padding: 20rpx;
          margin: 0 20rpx;

          .tips {
            font-size: 28rpx;
            color: #333333;
            font-weight: 800;
            margin-bottom: 14rpx;
            margin-top: 20rpx;
          }

          .tips-samll {
            font-size: 24rpx;
            color: #333333;
            margin-bottom: 14rpx;
          }
        }

        .but {
          color: #fff;
          font-size: 30rpx;
          width: 700rpx;
          height: 86rpx;
          border-radius: 43rpx;
          margin: 50rpx auto 0 auto;
          background: linear-gradient(90deg, #ff7931 0%, #f11b09 100%);
          line-height: 86rpx;
        }
      }
    }
  }
</style>