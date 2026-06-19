<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-07-16 19:12:19
* @LastEditors: wangxc
* @LastEditTime: 2024-07-16 19:12:19
-->
<template>
  <view class="user-money-box">
    <view class="my-account">
      <view class="header sec-box">
        <view class="headerCon">
          <view class="account acea-row row-top">
            <view class="assets">
              <view>账户余额(元)</view>
              <view class="money">{{ userAct.cashTotalLast ? userAct.cashTotalLast.toFixed(2) : '0.00' }}</view>
            </view>
            <view class="assets" v-if="sysConfig.switchCashWithdraw === 1">
              <view>可提现金额(元)</view>
              <view class="money">{{ userAct.canOutCashAmount ? userAct.canOutCashAmount.toFixed(2) : '0.00' }}</view>
            </view>
            <view class="assets">
              <view>在途保证金(元)</view>
              <view class="money">{{ userAct.onwaySuretyCash ? userAct.onwaySuretyCash.toFixed(2) : '0.00' }}</view>
            </view>
            <view class="assets" v-if="sysConfig.switchCashRecharge === 1">
              <view>充值余额(元)</view>
              <view class="money">{{ userAct.cashRechargeLast ? userAct.cashRechargeLast.toFixed(2) : '0.00' }}</view>
            </view>
            <view class="assets">
              <view>收益余额(元)</view>
              <view class="money">{{ userAct.cashIncomeLast ? userAct.cashIncomeLast.toFixed(2) : '0.00' }}</view>
            </view>
            <!-- 获赠礼金栏是为了凑数用，保持每行不少于2个 -->
            <view class="assets" v-if="sysConfig.switchCashWithdraw === 1">
              <view>获赠礼金(元)</view>
              <view class="money">{{ userAct.cashGiftLast ? userAct.cashGiftLast.toFixed(2) : '0.00' }}</view>
            </view>
          </view>
          <view class="act-op">
            <view v-show="sysConfig.switchCashRecharge === 1" @click="openSubscribe('userRecharge')"
              class="op-btn act-in">充值</view>
            <view v-if="sysConfig.switchCashWithdraw === 1" @click="openSubscribe('userWithdraw')"
              class="op-btn act-out">提现</view>
          </view>
        </view>
      </view>
      <view class="cumulative sec-box acea-row row-top">
        <view class="warp">
          <view class="item" v-if="sysConfig.switchCashRecharge === 1">
            <view>累计充值(元)</view>
            <view class="money">{{ userAct.cashRechargeSum ? userAct.cashRechargeSum.toFixed(2) : '0.00' }}</view>
          </view>
          <view class="item">
            <view>累计收益(元)</view>
            <view class="money">{{ userAct.cashIncomeSum ? userAct.cashIncomeSum.toFixed(2) : '0.00' }}</view>
          </view>
          <view class="item">
            <view>累计支付(元)</view>
            <view class="money">{{ userAct.cashPaySum ? userAct.cashPaySum.toFixed(2) : '0.00' }}</view>
          </view>
        </view>
      </view>

      <view class="list-wrap sec-box">
        <view class="list-head">
          <view class="head-tab">
            <view class="item" :class="listType === 'pay' ? 'on' : ''" @click="changeType('pay')">
              <view class="pictrue">
                <image src="/static/images/record2.png"></image>
              </view>
              <view>支付明细</view>
            </view>
            <view class="item" :class="listType === 'income' ? 'on' : ''" @click="changeType('income')">
              <view class="pictrue">
                <image src="/static/images/record3.png"></image>
              </view>
              <view>收益明细</view>
            </view>
            <view class="item" :class="listType === 'recharge' ? 'on' : ''" v-if="sysConfig.switchCashRecharge === 1"
              @click="changeType('recharge')">
              <view class="pictrue">
                <image src="/static/images/record3.png"></image>
              </view>
              <view>充值明细</view>
            </view>
            <view class="item" :class="listType === 'draws' ? 'on' : ''" v-if="sysConfig.switchCashWithdraw === 1"
              @click="changeType('draws')">
              <view class="pictrue">
                <image src="/static/images/record3.png"></image>
              </view>
              <view>提现明细</view>
            </view>
            <view class="item" :class="listType === 'onway' ? 'on' : ''" @click="changeType('onway')">
              <view class="pictrue">
                <image src="/static/images/record3.png"></image>
              </view>
              <view>在途保证金</view>
            </view>
          </view>
        </view>
        <view class="list-body">
          <view class="list" v-if="listType === 'pay'">
            <view class="data-item" v-for="(item, idx) in dataList" :key="idx">
              <view class="item-wrap justify-between">
                <view class="left-tag"></view>
                <view class="right-txt">
                  <view class="item-main justify-between">
                    <view class="item-title">{{ item.title }}</view>
                    <view class="money">
                      <text>-{{ item.deductCashAmount ? item.deductCashAmount.toFixed(2) : '0.00' }}</text>
                    </view>
                  </view>
                  <view class="item-note justify-start">
                    <view class="item-datetime">
                      <text class="title">支付方式</text>
                      <text v-if="item.payChannel === 'yue'">余额支付</text>
                      <text v-else-if="item.payChannel === 'WRoutine' || item.payChannel === 'WPublic'">微信支付</text>
                      <text v-else>其它支付</text>
                    </view>
                  </view>
                  <view class="item-note justify-between">
                    <view class="item-datetime">{{ item.payTime }}</view>
                    <view class="money-last">
                      <text class="title">账户余额</text>
                      <text>{{ item.actCashTotalLast? item.actCashTotalLast.toFixed(2)  : '0.00'}}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="list" v-if="listType === 'income'">
            <view class="data-item" v-for="(item, idx) in dataList" :key="idx">
              <view class="item-wrap justify-between">
                <view class="left-tag"></view>
                <view class="right-txt">
                  <view class="item-main justify-between">
                    <view class="item-title">{{ item.title }}</view>
                    <view class="money" style="color: #ffc90e;"> +{{ item.cashAmount ? item.cashAmount.toFixed(2) : '0.00' }} </view>
                  </view>
                  <view class="item-note justify-between">
                    <view class="item-datetime">{{ item.incomeTime }}</view>
                    <view class="money-last">
                      <text class="title">账户余额</text>
                      <text>{{ item.cashAmountLast? item.cashAmountLast.toFixed(2)  : '0.00' }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="list" v-else-if="sysConfig.switchCashRecharge === 1 && listType === 'recharge'">
            <view class="data-item" v-for="(item, idx) in dataList" :key="idx">
              <view class="item-wrap justify-between">
                <view class="left-tag"></view>
                <view class="right-txt">
                  <view class="item-main justify-between">
                    <view class="item-title">用户充值</view>
                    <view class="money">
                      <text></text>
                      <text>+{{ item.payAmount ? item.payAmount.toFixed(2) : '0.00' }}元</text>
                    </view>
                  </view>
                  <view class="item-note justify-between">
                    <view class="item-datetime">{{ item.payTime }}</view>
                    <view class="money-last">
                      <text class="title">账户余额</text>
                      <text>{{ item.cashAmountLast? item.cashAmountLast.toFixed(2)  : '0.00' }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="list" v-else-if="sysConfig.switchCashWithdraw === 1 && listType === 'draws'">
            <view class="data-item" v-for="(item, idx) in dataList" :key="idx">
              <view class="item-wrap justify-between">
                <view class="left-tag"></view>
                <view class="right-txt">
                  <view class="item-main justify-between">
                    <view class="item-title">用户提现</view>
                    <view class="money">+{{ item.drawAmount.toFixed(2) }}</view>
                  </view>
                  <view class="item-note justify-between">
                    <view class="item-datetime">{{ item.drawSucessTime || item.drawTime }}</view>
                    <view class="money-last">
                      <text class="title">账户余额</text>
                      <text>{{ item.accountLast? item.accountLast.toFixed(2) : '0.00' }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="list" v-else-if="listType === 'onway'">
            <view class="data-item" v-for="(item, idx) in dataList" :key="idx">
              <view class="item-wrap justify-between">
                <view class="left-tag"></view>
                <view class="right-txt">
                  <view class="item-main justify-between">
                    <view class="item-title">{{ item.suretyTitle }}</view>
                    <view class="money">{{ item.suretyLastAmount ? item.suretyLastAmount.toFixed(2) : '0.00' }}</view>
                  </view>
                  <view class="item-note justify-between">
                    <view class="money-last">
                      <text class="title">保证金来源</text>
                      <text v-if="item.payChannel === 'WRoutine'">微信支付</text>
                      <text v-else-if="item.payChannel === 'yue'">账户余额</text>
                      <text v-else>其它支付</text>
                    </view>
                  </view>
                  <view class="item-note justify-between">
                    <view class="item-datetime">转入日期：{{ item.transInTime }}</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <uni-load-more :status="loadMoreStatus" :contentText="loadMoreContent"></uni-load-more>
          <view class="nodata" v-if="dataList.length === 0">
            <u-empty text="暂无历史记录" mode="history"></u-empty>
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
    paidlogs,
    incomelogs,
    rechargelogs,
    withdrawlogs,
    suretyCashlogs,
    onWaylogs
  } from '@/api/payment'
  import {
    getUserAccount
  } from '@/api/user'

  export default {
    name: 'user-money',
    components: {},
    data() {
      return {
        userAct: {}, //账户总信息

        listType: 'pay',

        dataList: [],

        fullPageList: [],
        lastList: [],

        // 分页信息
        page: {
          sortNum: 0, // 当前页开始序号
          current: 1, // 当前位于哪页
          pageSize: 12, // 每页显示最多行数
          total: 0, // 总数
          pages: 0, // 总页数
        },

        loadMoreContent: {
          contentdown: '下拉显示更多',
          contentrefresh: '正在加载...',
          contentnomore: '没有更多了',
        },
        loadMoreStatus: 'more',
      }
    },
    onLoad(e) {
      console.log(e)
    },
    onShow(e) {
      this.getUserActInfo()
    },
    onReachBottom() {
      // 加载更多
      this.getList()
    },
    computed: {
      ...mapGetters({
        sysInfo: 'app/sysInfo',
        sysConfig: 'app/sysConfig',
        userInfo: 'user/userInfo',
        uid: 'user/uid',
        locComPreUrl: 'app/locComPreUrl',
      }),
    },
    created() {},
    mounted() {
      this.changeType('pay')
    },
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

      changeType(listType) {
        this.listType = listType
        this.reloadList()
      },

      getList() {
        if (this.listType === 'pay') {
          this.getPaidList()
        } else if (this.listType === 'recharge') {
          this.getRechargeList()
        } else if (this.listType === 'income') {
          this.getIncomeList()
        } else if (this.listType === 'draws') {
          this.getWithdrawList()
        } else if (this.listType === 'onway') {
          this.getSuretyCashList()
        }
      },

      getPaidList() {
        const _that = this
        _that.loadMoreStatus = 'loading'
        const params = {
          current: _that.page.current,
          size: _that.page.pageSize,
        }
        const reqData = {}

        return paidlogs(params, reqData).then((res) => {
          if (res.code === 0) {
            const _res = res.data
            if (_res.records.length > 0) {
              _that.dataList = []
              const dataList = _res.records.map((item) => {
                return item
              })

              _that.page.total = Number(_res.total)
              _that.page.pages = Number(_res.pages)

              if (dataList.length < _res.size) {
                _that.lastList = dataList
                _that.loadMoreStatus = 'no-more'
              } else {
                _that.lastList = []
                _that.fullPageList.push(...dataList)
                _that.page.current = Number(_res.current) + 1
                _that.loadMoreStatus = 'more'
              }

              _that.dataList = [..._that.fullPageList, ..._that.lastList]
            } else {
              _that.loadMoreStatus = 'no-more'
            }

            if (_that.dataList.length === 0) {
              _that.loadMoreContent.contentnomore = '--暂无支付记录--'
            } else {
              _that.loadMoreContent.contentnomore = '--没有更多了--'
            }
          }
        })
      },

      getIncomeList() {
        const _that = this
        _that.loadMoreStatus = 'loading'
        const params = {
          current: _that.page.current,
          size: _that.page.pageSize,
        }
        const reqData = {
          tagType: 1
        }

        return incomelogs(params, reqData).then((res) => {
          if (res.code === 0) {
            const _res = res.data
            if (_res.records.length > 0) {
              _that.dataList = []

              const dataList = _res.records.map((item) => {
                return item
              })

              _that.page.total = Number(_res.total)
              _that.page.pages = Number(_res.pages)

              if (dataList.length < _res.size) {
                _that.lastList = dataList
                _that.loadMoreStatus = 'no-more'
              } else {
                _that.lastList = []
                _that.fullPageList.push(...dataList)
                _that.page.current = Number(_res.current) + 1
                _that.loadMoreStatus = 'more'
              }

              _that.dataList = [..._that.fullPageList, ..._that.lastList]
            } else {
              _that.loadMoreStatus = 'no-more'
            }

            if (_that.dataList.length === 0) {
              _that.loadMoreContent.contentnomore = '--暂无收益记录--'
            } else {
              _that.loadMoreContent.contentnomore = '--没有更多了--'
            }
          }
        })
      },

      getRechargeList() {
        const _that = this
        _that.loadMoreStatus = 'loading'
        const params = {
          current: _that.page.current,
          size: _that.page.pageSize,
        }
        const reqData = {}

        return rechargelogs(params, reqData).then((res) => {
          if (res.code === 0) {
            const _res = res.data
            if (_res.records.length > 0) {
              _that.dataList = []
              const dataList = _res.records.map((item) => {
                return item
              })

              _that.page.total = Number(_res.total)
              _that.page.pages = Number(_res.pages)

              if (dataList.length < _res.size) {
                _that.lastList = dataList
                _that.loadMoreStatus = 'no-more'
              } else {
                _that.lastList = []
                _that.fullPageList.push(...dataList)
                _that.page.current = Number(_res.current) + 1
                _that.loadMoreStatus = 'more'
              }

              _that.dataList = [..._that.fullPageList, ..._that.lastList]
            } else {
              _that.loadMoreStatus = 'no-more'
            }

            if (_that.dataList.length === 0) {
              _that.loadMoreContent.contentnomore = '--暂无充值记录--'
            } else {
              _that.loadMoreContent.contentnomore = '--没有更多了--'
            }
          }
        })
      },

      getWithdrawList() {
        const _that = this
        _that.loadMoreStatus = 'loading'
        const params = {
          current: _that.page.current,
          size: _that.page.pageSize,
        }
        const reqData = {}

        return withdrawlogs(params, reqData).then((res) => {
          if (res.code === 0) {
            const _res = res.data
            if (_res.records.length > 0) {
              _that.dataList = []
              const dataList = _res.records.map((item) => {
                return item
              })

              _that.page.total = Number(_res.total)
              _that.page.pages = Number(_res.pages)

              if (dataList.length < _res.size) {
                _that.lastList = dataList
                _that.loadMoreStatus = 'no-more'
              } else {
                _that.lastList = []
                _that.fullPageList.push(...dataList)
                _that.page.current = Number(_res.current) + 1
                _that.loadMoreStatus = 'more'
              }

              _that.dataList = [..._that.fullPageList, ..._that.lastList]
            } else {
              _that.loadMoreStatus = 'no-more'
            }

            if (_that.dataList.length === 0) {
              _that.loadMoreContent.contentnomore = '--暂无提现记录--'
            } else {
              _that.loadMoreContent.contentnomore = '--没有更多了--'
            }
          }
        })
      },

      getSuretyCashList() {
        const _that = this
        _that.loadMoreStatus = 'loading'
        const params = {
          current: _that.page.current,
          size: _that.page.pageSize,
        }
        const reqData = {}

        return suretyCashlogs(params, reqData).then((res) => {
          if (res.code === 0) {
            const _res = res.data
            if (_res.records.length > 0) {
              _that.dataList = []
              const dataList = _res.records.map((item) => {
                return item
              })

              _that.page.total = Number(_res.total)
              _that.page.pages = Number(_res.pages)

              if (dataList.length < _res.size) {
                _that.lastList = dataList
                _that.loadMoreStatus = 'no-more'
              } else {
                _that.lastList = []
                _that.fullPageList.push(...dataList)
                _that.page.current = Number(_res.current) + 1
                _that.loadMoreStatus = 'more'
              }

              _that.dataList = [..._that.fullPageList, ..._that.lastList]
            } else {
              _that.loadMoreStatus = 'no-more'
            }

            if (_that.dataList.length === 0) {
              _that.loadMoreContent.contentnomore = '--暂无在途保证金--'
            } else {
              _that.loadMoreContent.contentnomore = '--没有更多了--'
            }
          }
        })
      },

      getOnWayList() {
        const _that = this
        _that.loadMoreStatus = 'loading'
        const params = {
          current: _that.page.current,
          size: _that.page.pageSize,
        }
        const reqData = {}

        return onWaylogs(params, reqData).then((res) => {
          if (res.code === 0) {
            const _res = res.data
            if (_res.records.length > 0) {
              _that.dataList = []
              const dataList = _res.records.map((item) => {
                return item
              })

              _that.page.total = Number(_res.total)
              _that.page.pages = Number(_res.pages)

              if (dataList.length < _res.size) {
                _that.lastList = dataList
                _that.loadMoreStatus = 'no-more'
              } else {
                _that.lastList = []
                _that.fullPageList.push(...dataList)
                _that.page.current = Number(_res.current) + 1
                _that.loadMoreStatus = 'more'
              }

              _that.dataList = [..._that.fullPageList, ..._that.lastList]
            } else {
              _that.loadMoreStatus = 'no-more'
            }

            if (_that.dataList.length === 0) {
              _that.loadMoreContent.contentnomore = '--暂无在途保证金--'
            } else {
              _that.loadMoreContent.contentnomore = '--没有更多了--'
            }
          }
        })
      },

      reloadList() {
        this.fullPageList = []
        this.lastList = []
        this.dataList = []
        this.page.current = 1
        this.page.total = 0
        this.page.pages = 0
        this.getList()
      },

      openSubscribe(pathName) {
        this.$Router.push({
          name: pathName,
          params: {}
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .user-money-box {
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
            margin-bottom: 30rpx;

            .assets {
              text-align: center;
              width: 180rpx;
              height: 90rpx;
              margin: 20rpx 10rpx;


              .money {
                font-size: 36rpx;
                color: #fff;
                font-family: 'Guildford Pro';
              }
            }
          }

          .account.col-2 {
            margin-left: 100rpx;
            margin-right: 100rpx;
          }

          .act-op {
            width: 360rpx;
            margin: 40rpx auto;
            display: flex;
            justify-content: center;

            .op-btn {
              font-size: 28rpx;
              width: 150rpx;
              height: 54rpx;
              border-radius: 27rpx;
              background-color: #fff9f8;
              text-align: center;
              line-height: 54rpx;
              margin: 0 20rpx;
            }

            .act-in {
              color: #e93323 !important;
            }

            .act-out {
              color: #085808 !important;
            }
          }
        }
      }

      .cumulative {
        margin-top: 46rpx;
        height: 180rpx;
        background-color: #fff;

        .warp {
          height: 100%;
          width: 100%;
          padding: 36rpx 0 29rpx 0;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;

          .item {
            flex: 1;
            text-align: center;

            .money {
              font-size: 33rpx;
              font-family: 'Guildford Pro';
              color: #909399;
              margin-top: 20rpx;
            }
          }
        }
      }

      .list-wrap {
        background-color: #fff;

        .list-head {
          border-bottom: 1rpx solid #eee;

          .head-tab {
            display: flex;

            .item {
              flex: 1;
              text-align: center;
              font-size: 26rpx;
              color: #999;
              padding-bottom: 15rpx;

              .pictrue {
                width: 44rpx;
                height: 44rpx;
                margin: 0 auto;
                margin-bottom: 20rpx;

                image {
                  width: 100%;
                  height: 100%;
                }
              }
            }

            .item.on {
              color: $theme-color;
              border-bottom: 3rpx solid $theme-color;
            }
          }
        }

        .list-body {
          .list {
            .data-item {
              margin: 20rpx 10rpx;
              padding: 10rpx;
              border-bottom: 3rpx dashed #f4f4f5;

              .item-wrap {
                .left-tag {}

                .right-txt {
                  flex: 1;

                  .item-main {
                    margin: 10rpx 0;
                    color: #303133;
                    font-size: 14px;

                    .item-title {}

                    .money {}
                  }

                  .item-note {
                    color: #909399;
                    font-size: 12px;
                    margin: 10rpx 0;
                    height: 42rpx;

                    .title {
                      margin-right: 15rpx;

                      &::after {
                        content: ':';
                      }
                    }

                    .item-datetime {}

                    .money-last {

                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>