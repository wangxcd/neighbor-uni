<!--
* @Description: 支付
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-06-06 09:11:35
* @LastEditors: wangxc
* @LastEditTime: 2024-06-06 09:11:35
-->
<template>
  <view class="payment-box">
    <u-popup :show="popOpen" :round="10" mode="bottom" :closeable="true" @close="close" @open="open">
      <view class="payment">
        <view class="title acea-row row-center-wrapper">选择支付方式</view>
        <view class="pay-amount">
          <view class="amount">
            <text class="tips">支付金额</text>
            <text class="money myicon icon-icon-rmb">{{ actPay.payAmount.toFixed(2) }}</text>
          </view>
          <view class="coupon" v-if="actPay.couponAmount && actPay.couponAmount > 0">
            <text>原支付{{ payOrder.totalAmount.toFixed(2) }}元，</text>
            <text>消费券已抵扣{{ actPay.couponAmount.toFixed(2) }}元</text>
          </view>
        </view>
        <radio-group>
          <view class="item acea-row row-between-wrapper" :class="{ 'pay-channel-check': item.value === actPay.payChannel.value }"
            v-for="(item, index) in payChannelAry" :key="index">
            <view v-if="item.value === 'yue'" class="pay-channel"
              :class="{ 'disable-line': item.lastAmount && item.lastAmount > 0 && item.lastAmount < actPay.payAmount }"
              @click="item.lastAmount >= actPay.payAmount && checkPay(item)">
              <view class="left acea-row row-between-wrapper">
                <view class="channel-icon myicon" :class="item.icon"></view>
                <view class="channel text">
                  <view class="name">{{ item.name }}</view>
                  <view class="info" v-if="item.lastAmount &&  item.lastAmount > 0">
                    <text>{{ item.title }}</text>
                    <text class="money myicon icon-icon-rmb" v-if="item.lastAmount < actPay.payAmount"
                      style="color:#fcbd71;">
                      {{ item.lastAmount.toFixed(2) }} (余额不足)
                    </text>
                    <text class="money myicon icon-icon-rmb" v-else style="color: #ff9900;">
                      {{ item.lastAmount.toFixed(2) }}
                    </text>
                  </view>
                  <view class="info" v-else>可用余额不足</view>
                </view>
              </view>
              <view class="right">
                <view class="myicon icon-xiangyou">
                  <radio :value="item.value" :checked="item.value === actPay.payChannel.value"
                    :disabled="item.lastAmount && item.lastAmount > 0 && item.lastAmount < actPay.payAmount" />
                </view>
              </view>
            </view>
            <!-- 非余额支付不存在账户余额限制  -->
            <view v-else class="pay-channel" @click="checkPay(item)">
              <view class="left acea-row row-between-wrapper">
                <view class="channel-icon myicon" :class="item.icon"></view>
                <view class="channel text">
                  <view class="name">{{ item.name }}</view>
                  <view class="info">
                    <text>{{ item.title }}</text>
                  </view>
                </view>
              </view>
              <view class="right">
                <view class="myicon icon-xiangyou">
                  <radio :value="item.value" :checked="item.value === actPay.payChannel.value" />
                </view>
              </view>
            </view>
          </view>
        </radio-group>
        <view class="bottom"></view>
      </view>
    </u-popup>

    <!-- 统一的alert对话框 -->
    <u-modal :show="alertModel.show" :title="alertModel.title" :content="alertModel.content"
      :closeOnClickOverlay="alertModel.closeOnClickOverlay" @confirm="alertClose" @close="alertClose"></u-modal>
  </view>
</template>

<script>
  import {
    getUserAccount,
    getUserCanCoupons
  } from '@/api/user'

  export default {
    name: 'Payment',
    components: {},
    props: {
      // 支付方式
      payChannelAry: {
        type: Array,
        default: function() {
          return []
        },
      },
      // 可使用消费券抵扣部分金额
      canUseCouponAmount: {
        type: Number,
        default: 0
      },
      // 是否支持使用消费券抵扣
      isCoupon: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        alertModel: {
          show: false,
          title: '',
          content: '',
          closeOnClickOverlay: true
        },

        popOpen: false,

        // 支付订单原信息
        payOrder: {
          totalAmount: 0,
          orderCode: '',
          attach: {}
        },

        // 可用消费券
        canCoupons: [],
        // 选定的抵扣消费券
        useCoupon: {},

        // 实际支付订单信息
        actPay: {
          orginAmount: 0,
          payAmount: 0,
          payOrderCode: '',
          attach: {},
          payChannel: {},

          // 抵扣消费券金额、编码
          couponAmount: 0,
          couponCode: ''
        }
      }
    },
    computed: {},
    created() {},
    watch: {},
    methods: {
      beforeOpen(popOpen, payOrder) {
        const _that = this
        _that.payOrder = payOrder

        if (popOpen) {
          _that.actPay.payOrderCode = _that.payOrder.orderCode
          _that.actPay.attach = _that.payOrder.attach
          _that.actPay.orginAmount = _that.payOrder.totalAmount
          // 实际支付初始值为原始费用
          _that.actPay.payAmount = _that.payOrder.totalAmount
          _that.actPay.payChannel = {}

          _that.initData()
        } else {
          _that.popOpen = false
        }
      },

      close() {
        this.payChannel = {}
        this.popOpen = false
        /* this.$emit('closePayment', {
          action: 'payClose',
        }) */
      },

      open() {},

      initData() {
        const _that = this
        const p1 = this.checkUserAccount()
        const p2 = this.pickDebtCoupon(_that.payOrder.totalAmount)
        Promise.all([p1, p2]).then((res) => {
          if (_that.actPay.couponCode && _that.actPay.couponAmount && _that.actPay.couponAmount > 0) {
            _that.actPay.payAmount = _that.payOrder.totalAmount - _that.actPay.couponAmount
          } else {
             _that.actPay.payAmount = _that.payOrder.totalAmount
          }

          if (_that.actPay.payAmount > 0) {
            // 需要支付费用
            _that.popOpen = true
          } else {
            // 消费券抵扣完后，不需要支付费用，弹出给用户的'消费券全部抵扣'提示
            _that.alertModel = {
              show: true,
              title: '优惠提醒',
              content: '本次费用已由消费券全部抵扣！',
              closeOnClickOverlay: true
            }
          }
        })
      },

      /**
       * alert对话框关闭,此处主要为消费券全抵扣的处理
       */
      alertClose() {
        const _that = this
        setTimeout(function() {
          _that.alertModel = {
            show: false,
            title: '',
            content: '',
            closeOnClickOverlay: true
          }

          // 消费券抵扣完后，不需要支付费用，关闭提示框后直接按余额方式处理
          _that.checkPay({
            lastAmount: 1,
            value: 'yue'
          })
        }, 500)
      },

      /**
       * 检查用户账户
       */
      checkUserAccount() {
        const _that = this
        return new Promise((resolve, reject) => {
          // 存在余额支付，检查账户可用现金余额
          let yueChannel = _that.payChannelAry.find((el) => el.value === 'yue')
          if (yueChannel) {
            getUserAccount().then((res) => {
              if (res.code === 0) {
                const _res = res.data
                if (_res) {
                  yueChannel.lastAmount = _res.cashTotalLast
                }
              }
              resolve(true)
            }).catch((err) => {
              resolve(false)
            })
          } else {
            resolve(true)
          }
        })
      },

      /**
       * 挑选抵扣的消费券
       */
      pickDebtCoupon(amount) {
        const _that = this
        return new Promise((resolve, reject) => {
          if (!_that.isCoupon || !_that.canUseCouponAmount || _that.canUseCouponAmount <= 0) {
            // 不能使用消费券、或可使用消费券金额为0，直接按原订单金额支付
            resolve(true)
          } else {
            getUserCanCoupons().then((res) => {
              if (res.code === 0) {
                const _res = res.data
                if (_res && _res.length > 0) {
                  _that.canCoupons = _res

                  // 1.首选30日内到期的
                  let instancyCoupons = []
                  _that.canCoupons.forEach((el) => {
                    if (el.isTerm === 1) {
                      const times = _that.$util.getDateTimeStamp(el.expireDate)
                      if (times && times < 1000 * 60 * 60 * 24 * 30) {
                        instancyCoupons.push(el)
                      }
                    }
                  })

                  // 不存在30日内到期的，就所有消费券
                  if (instancyCoupons.length === 0) {
                    instancyCoupons = [].concat(_that.canCoupons)
                  }

                  let maxAmountCoupon = {
                    lastAmount: 0
                  }

                  // 2.再选消费券余额最接近支付额,并且消费券余额最大
                  instancyCoupons.forEach((el) => {
                    if (el.lastAmount <= amount && el.lastAmount > maxAmountCoupon.lastAmount) {
                      maxAmountCoupon = el
                    }
                  })

                  if (maxAmountCoupon.lastAmount > 0 && maxAmountCoupon.couponCode) {
                    _that.useCoupon = {
                      ...maxAmountCoupon
                    }

                    // _that.actPay.payAmount = amount - maxAmountCoupon.lastAmount
                    _that.actPay.couponAmount = maxAmountCoupon.lastAmount
                    _that.actPay.couponCode = maxAmountCoupon.couponCode
                  }
                }
              }
              resolve(true)
            }).catch((err) => {
              // 获取不到消费券，按无消费券处理
              resolve(false)
            })
          }
        })

      },

      checkPay(checkChannel) {
        if (checkChannel.lastAmount
          && checkChannel.lastAmount >= 0 
          && checkChannel.lastAmount < this.actPay.payAmount) {
          return false
        }

        this.actPay.payChannel = checkChannel
        // this.$emit('checkPay', this.payChannel, this.orderId, this.totalPrice, this.attach)
        this.$emit('checkPay', this.actPay)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .payment-box {
    .payment {
      .title {
        text-align: center;
        height: 123rpx;
        font-size: 32rpx;
        color: #282828;
        font-weight: bold;
        padding-right: 30rpx;
        margin-left: 30rpx;
        position: relative;
        border-bottom: 1rpx solid #eee;
      }

      .pay-amount {
        margin: 20rpx;

        .amount {
          margin: 10rpx auto;
          font-size: 42rpx;
          color: #303133;
          font-weight: 700;
          display: flex;
          justify-content: center;

          .tips {
            &::after {
              content: ':';
            }
          }

          .money {
            font-weight: 700;
          }
        }

        .coupon {
          width: 600rpx;
          text-align: center;
          color: red;
          margin: 10rpx auto;
        }
      }

      .item {
        border-bottom: 1rpx solid #eee;
        height: 130rpx;
        padding: 0 50rpx;

        .pay-channel {
          width: 680rpx;
          display: flex;
          justify-content: space-between;

          .left {
            width: 500rpx;

            .channel-icon {
              width: 45rpx;
              height: 45rpx;
              border-radius: 50%;
              text-align: center;
              line-height: 45rpx;
              color: #fff;
              font-size: 30rpx;
              margin-right: 15rpx;
            }

            .channel {
              width: 440rpx;

              .name {
                font-size: 32rpx;
                color: #282828;
              }

              .info {
                font-size: 24rpx;
                color: #999;

                .money {
                  color: #ff9900;
                }
              }
            }


            .icon-weixin1 {
              background-color: #41b035;
            }

            .icon-zhifubao {
              background-color: #00aaea;
            }

            .icon-yue {
              font-size: 45rpx;
              color: #fe960f;
              background-color: #fff;
            }

            .icon-yue1 {
              background-color: #eb6623;
            }
          }

          .right {
            width: 80rpx;
          }
        }

        .pay-channel.disable-line {
          .left {
            .channel {
              .name {
                color: #c4c6c9;
              }

              .info {
                color: #c4c6c9;
              }
            }
          }
        }

      }

      .item.pay-channel-check {
        background-color: #00aaea;
      }

      .bottom {
        margin-bottom: 80rpx;
      }
    }
  }
</style>