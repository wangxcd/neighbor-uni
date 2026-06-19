<!--
* @Description: 用户提现页面
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2026-03-24 16:28:13
* @LastEditors: wangxc
* @LastEditTime: 2026-03-24 16:28:13
-->
<template>
  <view class="user-withdraw-box">
    <view class="withdraw-container">
      <view class="assets-card">
        <view class="assets-title">当前最大可提现金额(元)</view>
        <view class="assets-amount">{{ userAct.canOutCashAmount ? userAct.canOutCashAmount.toFixed(2) : '0.00' }}</view>
      </view>

      <view class="form-section">
        <view class="cu-form-group">
          <view class="title">本次提现金额</view>
          <view class="input">
            <input class="amount-input" placeholder="请输入提现金额" name="input" type="number" :disabled="!canDraw"
              v-model="drawAmount" />
            <text class="txt">元</text>
          </view>
          <view class="desc">
            (提现金额不能超过最大可提现额)
          </view>
        </view>
        <view class="cu-form-group">
          <view class="title">提现人名称</view>
          <view class="input">
            <input class="amount-input" placeholder="输入提现人名称" name="input" type="text" :disabled="!canDraw"
              v-model="drawName" />
          </view>
          <view class="desc">
            (务必为微信实名认证时保存的名称，否则不能提现成功)
          </view>
        </view>
      </view>

      <view class="action-buttons">
        <template v-if="canDraw">
          <button class="withdraw-btn" @click="userdrawSubmit">立即提现</button>
        </template>
        <template v-else>
          <button class="withdraw-btn disabled" :disabled="!canDraw">立即提现</button>
        </template>
      </view>

      <view class="notice-section">
        <view class="notice-title">
          <text class="cuIcon-info"></text>
          提现须知
        </view>
        <view class="notice-item">
          <text class="dot"></text>
          <view class="txt">
            <text>用户仅能对通过平台活动或接单得到的</text><text class="highlight">收益部分</text><text>进行提现。</text>
          </view>
        </view>
        <view class="notice-item">
          <text class="dot"></text>
          <view class="txt">
            <text>为防止洗钱等</text><text class="highlight">恶意或不法</text><text>行为，用户的充值部分金额也不能直接用于提现。</text>
          </view>
        </view>
        <view class="notice-item">
          <text class="dot"></text>
          <view class="txt">
            <text>提现需要扣除当次提现金额的</text><text class="highlight">3%</text><text>,用于平台运营及支付微信中间服务商的居间费</text>
          </view>
        </view>
        <view class="notice-item">
          <text class="dot"></text>
          <view class="txt">
            <text>每笔提现金额不得低于</text><text class="highlight">10</text><text>元</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    getUserAccount,
    withDrawCash,
    queryWithDraw,
    cancelWithDraw
  } from '@/api/user'

  export default {
    name: 'user-withdraw',
    components: {},
    data() {
      return {
        userAct: {}, //账户总信息
        canDraw: false, // 是否可提现
        drawAmount: '0.00', // 提现金额
        drawName: '' // 提现人名称
      }
    },
    onLoad(e) {
      console.log(e)
    },
    onShow(e) {
      console.log(e)
    },
    onReachBottom(e) {
      console.log(e)
    },
    computed: {
      ...mapGetters({
        userInfo: 'user/userInfo',
        uid: 'user/uid'
      })
    },
    created() {},
    mounted() {
      this.getUserActInfo()
    },
    watch: {},
    methods: {
      getUserActInfo() {
        const _that = this
        getUserAccount().then((res) => {
          if (res.code === 0) {
            const _res = res.data
            if (_res) {
              debugger
              _that.userAct = _res
              if (_that.userAct.canOutCashAmount && _that.userAct.canOutCashAmount > 0) {
                // 可提现
                _that.canDraw = true
              } else {
                uni.showToast({
                  title: "可提现额不足，当前不能提现",
                  icon: 'none',
                  duration: 3000,
                  position: 'bottom',
                });
              }
            }
          }
        })
      },

      /**
       * 用户提现
       * mchBillNo: 商户转账单号
       * num: 重新发起次数 (超过3次不成功，不再重新发起，直接申请撤销)
       */
      userdrawSubmit() {
        var _that = this;

        const amount = _that.drawAmount.trim()
        if (amount === '') {
          uni.showToast({
            title: "请输入提现金额",
            icon: 'none',
            duration: 1500,
            position: 'bottom',
          });
          return false
        }

        const amountNum = Number(amount)

        if (amountNum <= 0) {
          uni.showToast({
            title: '请输入有效的提现金额',
            icon: 'none',
            duration: 1500,
            position: 'bottom',
          });
          return false
        }

        if (amountNum < 0.5) {
          uni.showToast({
            title: '单笔提现金额不得低于10元',
            icon: 'none',
            duration: 1500,
            position: 'bottom',
          });
          return false
        }

        _that.userwithdraw({
          uid: _that.uid,
          drawAmount: amountNum,
          drawName: _that.drawName,
          outBillNo: ''
        }, 0)
      },

      /**
       * 
       * @param req 
       * @param num 
       * queryWithDraw, cancelWithDraw
       */
      userwithdraw(req, num) {
        var _that = this

        if (uni.canIUse('requestMerchantTransfer')) {
          uni.showLoading({
            title: "加载中"
          })

          withDrawCash({
            uid: req.uid,
            drawAmount: req.drawAmount,
            drawName: req.drawName,
            outBillNo: req.outBillNo || ''
          }).then((res) => {
            debugger
            if (res.code === 0) {
              const _res = res.data
              if (_res && _res.errCode === 0) {
                const transRes = _res.transBillsResult
                debugger
                if (!transRes || !transRes.state) {
                    uni.showToast({
                        title: '转账申请失败',
                        icon: 'none',
                        duration: 1000,
                        position: 'bottom',
                    });
                    uni.hideLoading()
                }
                else if (transRes.state === 'WAIT_USER_CONFIRM' && transRes.outBillNo && transRes.transferBillNo) {
                  uni.requestMerchantTransfer({
                    mchId: _res.mchId,
                    package: transRes.packageInfo,
                    appId: _res.appid,
                    openId: _res.openid,
                    success: function(wxRes) {
                      debugger
                      if (wxRes && wxRes.errMsg === 'requestMerchantTransfer:ok' && wxRes.result ===
                        'success') {
                        setTimeout(function() {
                            // 提现转账成功
                            uni.hideLoading()
                            _that.$Router.replace({
                                name: 'userMoney',
                                params: {},
                            })
                        }, 1000)
                      }
                    },
                    fail: function(e) {},
                    complete: function(e) {}
                  })
                } else if (transRes.state === 'ACCEPTED') {
                  // 转账已受理, 但未成功
                  if (num < 3) {
                    // 10秒后重新发起
                    setTimeout(() => {
                      debugger
                      _that.userwithdraw(req, num + 1)
                    }, 1000 * 10)
                  } else {
                    debugger
                    // 连续3次不成功，可能是其它问题，撤销转账单
                    cancelWithDraw({
                      transferBillNo: transRes.transferBillNo,
                      outBillNo: transRes.outBillNo
                    }).then((cRes) => {
                      if (cRes.code === 0) {
                        const _cRes = cRes.data
                        if (_cRes && _cRes.errCode === 0) {
                          // 撤销处理正常
                        } else {
                          console.error(_cRes.errMsg)
                        }
                      }
                    })
                    uni.hideLoading()
                  }
                } else if (transRes.state === 'PROCESSING') {
                  uni.showToast({
                    title: '商户余额不足，请联系客服或稍候再试',
                    icon: 'none',
                    duration: 1000,
                    position: 'bottom',
                  });
                  // 10秒后撤销转账单
                  setTimeout(() => {
                    debugger
                    cancelWithDraw({
                      transferBillNo: transRes.transferBillNo,
                      outBillNo: transRes.outBillNo
                    }).then((cRes) => {
                      if (cRes.code === 0) {
                        const _cRes = cRes.data
                        if (_cRes && _cRes.errCode === 0) {
                          // 撤销处理正常
                        } else {
                          console.error(_cRes.errMsg)
                        }
                      }
                    })
                  }, 1000 * 10)
                }
              } else {
                uni.showToast({
                    title: _res.errMsg,
                    icon: 'none',
                    duration: 1000,
                    position: 'bottom',
                });
                uni.hideLoading()
              }
            }
          })
        } else {
          uni.showModal({
            content: '你的微信版本过低，请更新至最新版本。',
            showCancel: false,
          });
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .user-withdraw-box {
    .withdraw-container {
      padding: 20rpx;

      .assets-card {
        background: linear-gradient(135deg, #4B7BEC, #3867D6);
        padding: 40rpx;
        border-radius: 16rpx;
        color: #fff;
        margin: 30rpx 0;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

        .assets-title {
          font-size: 28rpx;
          opacity: 0.9;
        }

        .assets-amount {
          font-size: 48rpx;
          font-weight: bold;
          margin-top: 20rpx;
        }
      }

      .form-section {
        background: #fff;
        border-radius: 16rpx;
        margin: 30rpx 0;
        padding: 20rpx;
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);

        .cu-form-group {
          padding: 20rpx;
          border: none;
          margin-bottom: 20rpx;

          .title {
            margin-bottom: 40rpx;
            font-size: 40rpx;
          }

          .input {
            display: flex;

            .amount-input {
              width: 400rpx;
              font-size: 36rpx;
              border-bottom: 1rpx solid #eee;
              padding: 16rpx;
            }

            .txt {
              font-size: 36rpx;
              height: 60rpx;
              margin: 10rpx 10rpx;
            }
          }

          .desc {
            color: red;
            font-size: 28rpx;
            margin-top: 28rpx;
          }
        }
      }

      .action-buttons {
        margin: 40rpx 0;

        .withdraw-btn {
          background: #4B7BEC;
          color: #fff;
          padding: 25rpx;
          border-radius: 12rpx;
          font-size: 32rpx;
          margin-bottom: 20rpx;
          transition: all 0.3s;
        }

        .withdraw-btn:active {
          transform: scale(0.98);
        }

        .withdraw-btn.disabled {
          background-color: #c8c9cc;
          color: #fff;
        }

        .setting-btn {
          background: #fff;
          color: #4B7BEC;
          border: 2rpx solid #4B7BEC;
          padding: 25rpx;
          border-radius: 12rpx;
          font-size: 32rpx;
        }

      }

      .notice-section {
        background: #f8f9fa;
        border-radius: 16rpx;
        padding: 30rpx;
        margin-top: 40rpx;

        .notice-title {
          font-size: 30rpx;
          font-weight: bold;
          margin-bottom: 20rpx;
          color: #2d3436;
        }

        .notice-item {
          font-size: 26rpx;
          color: #636e72;
          margin: 16rpx 0;
          display: flex;
          justify-content: flex-start;

          .dot {
            width: 12rpx;
            height: 12rpx;
            background: #4B7BEC;
            border-radius: 50%;
            margin: 12rpx 16rpx 0 0;
          }

          .txt {
            .highlight {
              color: #4B7BEC;
              font-weight: bold;
              margin: 0 4rpx;
            }
          }
        }
      }

    }
  }
</style>