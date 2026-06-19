<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2025-07-15 20:50:30
* @LastEditors: wangxc
* @LastEditTime: 2025-07-15 20:50:30
-->
<template>
  <view class="user-coupon-box">
    <view class="my-account">
      <view class="header sec-box">
        <view class="headerCon">
          <view class="account acea-row row-top">
            <view class="assets">
              <view>消费券余额(元)</view>
              <view class="money">
                {{ userAct.couponLast ? userAct.couponLast.toFixed(2) : '0.00' }}
              </view>
            </view>
            <view class="assets">
              <view>消费券数量(张)</view>
              <view class="money">
                {{ userAct.couponCount ? userAct.couponCount : '0' }}
              </view>
            </view>
          </view>
          <view class="act-op">
            <view  v-if="sysConfig.switchCouponBuy === 1" @click="openSubscribe('userCouponBuy')" class="op-btn act-in">购买</view>
          </view>
        </view>
      </view>
      <view class="cumulative sec-box acea-row row-top">
        <view class="warp">
          <view class="item" v-if="sysConfig.switchCouponBuy === 1">
            <view>累计购买(元)</view>
            <view class="money">{{ userAct.couponBuySum ? userAct.couponBuySum.toFixed(2) : '0.00' }}</view>
          </view>
          <view class="item">
            <view>累计获赠(元)</view>
            <view class="money">{{ userAct.couponGetSum ? userAct.couponGetSum.toFixed(2) : '0.00' }}
            </view>
          </view>
          <view class="item">
            <view>累计抵扣(元)</view>
            <view class="money">{{ userAct.couponPaySum ? userAct.couponPaySum.toFixed(2) : '0.00' }}</view>
          </view>
        </view>
      </view>

      <view class="list-wrap sec-box">
        <view class="list-head">
          <view class="head-tab">
            <view class="item" :class="listType === 'buy' ? 'on' : ''" v-if="sysConfig.switchCouponBuy === 1"
              @click="changeType('buy')">
              <view class="pictrue">
                <image src="/static/images/record3.png"></image>
              </view>
              <view>购买明细</view>
            </view>
            <view class="item" :class="listType === 'gift' ? 'on' : ''" @click="changeType('gift')">
              <view class="pictrue">
                <image src="./static/images/record3.png"></image>
              </view>
              <view>获赠明细</view>
            </view>
            <view class="item" :class="listType === 'pay' ? 'on' : ''" @click="changeType('pay')">
              <view class="pictrue">
                <image src="/static/images/record2.png"></image>
              </view>
              <view>抵扣明细</view>
            </view>
          </view>
        </view>
        <view class="list-body">
          <view class="list" v-if="sysConfig.switchCouponBuy === 1 && listType === 'buy'">
            <view class="data-item" v-for="(item, idx) in buyList" :key="idx">
              <view class="item-wrap justify-between">
                <view class="left-tag"></view>
                <view class="right-txt">
                  <view class="item-main">
                    <view class="item-title">
                      <text>{{ item.wadAmount ? item.wadAmount.toFixed(2) : '0.00' }}元消费券</text>
                    </view>
                  </view>
                  <view class="item-note">
                    <view class="item-title">
                      <text>{{ item.title }}</text>
                    </view>
                  </view>
                  <view class="item-note">
                    <view class="item-title">
                      <text class="title">编码</text>
                      <text class="desc">{{ item.couponCode }}</text>
                    </view>
                  </view>
                  <view class="item-note justify-between">
                    <view class="item-title">
                      <text class="title">已使用</text>
                      <text class="desc">{{ item.useAmount? item.useAmount.toFixed(2) : '0.00' }}</text>
                    </view>
                    <view class="item-title">
                      <text class="title">未使用</text>
                      <text class="desc">{{ item.lastAmount? item.lastAmount.toFixed(2) : '0.00' }}</text>
                    </view>
                  </view>
                  <view class="item-note justify-between">
                    <view class="item-title">
                      <text class="title">发行</text>
                      <text class="desc">{{ item.issueDate }}</text>
                    </view>
                    <template v-if="item.isTerm === 0">
                      <view class="item-title">
                        <text> | </text>
                      </view>
                      <view class="item-title">
                        <text class="title">有效期</text>
                        <text class="desc">{{ item.issueDate }}</text>
                      </view>
                    </template>
                  </view>
                </view>
              </view>
            </view>
            <view class="nodata" v-if="giftList.length === 0">
              <u-empty text="暂无购买记录" mode="history"></u-empty>
            </view>
          </view>
          <view class="list" v-if="listType === 'gift'">
            <view class="data-item" v-for="(item, idx) in giftList" :key="idx">
              <view class="item-wrap justify-between">
                <view class="left-tag"></view>
                <view class="right-txt">
                  <view class="item-main">
                    <view class="item-title">
                      <text>{{ item.wadAmount ? item.wadAmount.toFixed(2) : '0.00' }}元消费券</text>
                    </view>
                  </view>
                  <view class="item-note">
                    <view class="item-title">
                      <text>{{ item.title }}</text>
                    </view>
                  </view>
                  <view class="item-note">
                    <view class="item-title">
                      <text class="title">编码</text>
                      <text class="desc">{{ item.couponCode }}</text>
                    </view>
                  </view>
                  <view class="item-note justify-between">
                    <view class="item-title">
                      <text class="title">已使用</text>
                      <text class="desc">{{ item.useAmount? item.useAmount.toFixed(2) : '0.00' }}</text>
                    </view>
                    <view class="item-title">
                      <text class="title">未使用</text>
                      <text class="desc">{{ item.lastAmount? item.lastAmount.toFixed(2) : '0.00' }}</text>
                    </view>
                  </view>
                  <view class="item-note justify-between">
                    <view class="item-title">
                      <text class="title">发行</text>
                      <text class="desc">{{ item.issueDate }}</text>
                    </view>
                    <template v-if="item.isTerm === 0">
                      <view class="item-title">
                        <text> | </text>
                      </view>
                      <view class="item-title">
                        <text class="title">有效期</text>
                        <text class="desc">{{ item.issueDate }}</text>
                      </view>
                    </template>
                  </view>
                </view>
              </view>
            </view>
            <view class="nodata" v-if="giftList.length === 0">
              <u-empty text="暂无赠送记录" mode="history"></u-empty>
            </view>
          </view>
          <view class="list" v-if="listType === 'pay'">
            <view class="data-item" v-for="(item, idx) in dataList" :key="idx">
              <view class="item-wrap justify-between">
                <view class="left-tag"></view>
                <view class="right-txt">
                  <view class="item-main justify-between">
                    <view class="item-title">{{ item.title }}</view>
                    <view class="money">
                      <text>{{ item.payType === 'weixin' ? '微信支付:' : '余额支付:' }} </text>
                      - {{ item.payAmount ? item.payAmount.toFixed(2) : '0.00' }}
                    </view>
                  </view>
                  <view class="item-note justify-between">
                    <view class="item-datetime">{{ item.payTime }}</view>
                    <view class="money-last"><text>账户余额</text>{{ item.payoffActLast.toFixed(2) }}</view>
                  </view>
                </view>
              </view>
            </view>
            <view class="nodata" v-if="giftList.length === 0">
              <u-empty text="暂无支付记录" mode="history"></u-empty>
            </view>
          </view>
          <uni-load-more :status="loadMoreStatus" :contentText="loadMoreContent"></uni-load-more>
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
    couponPaidlogs
  } from '@/api/payment'
  import {
    getUserAccount,
    getUserCoupons
  } from '@/api/user'

  export default {
    name: 'user-coupon',
    components: {},
    data() {
      return {
        userAct: {}, //账户总信息

        buyList: [],
        giftList: [],

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
      if (this.listType === 'pay') {
        // 加载更多
        this.getPaidList()
      }
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
        if (this.listType === 'buy' || this.listType === 'gift') {
          this.getCouponList()
        } else if (this.listType === 'pay') {
          this.getPaidList()
        }
      },

      getCouponList() {
        const _that = this
        _that.loadMoreStatus = 'loading'

        getUserCoupons().then((res) => {
          if (res.code === 0) {
            const _res = res.data
            if (_res) {
              const buyAry = _res.filter((item) => item.sourceType === 1)
              const getAry = _res.filter((item) => item.sourceType === 2)
              _that.buyList = buyAry
              _that.giftList = getAry

              _that.loadMoreStatus = 'no-more'

              if (_that.listType === 'buy') {
                if (_that.buyList.length === 0) {
                  _that.loadMoreContent.contentnomore = '--暂无购买记录--'
                } else {
                  _that.loadMoreContent.contentnomore = '--没有更多了--'
                }
              } else if (_that.listType === 'gift') {
                if (_that.giftList.length === 0) {
                  _that.loadMoreContent.contentnomore = '--暂无获赠记录--'
                } else {
                  _that.loadMoreContent.contentnomore = '--没有更多了--'
                }
              }

            }
          }
        })
      },

      getPaidList() {
        const _that = this
        _that.loadMoreStatus = 'loading'
        const params = {
          current: _that.page.current,
          size: _that.page.pageSize,
        }
        const reqData = {}

        return couponPaidlogs(params, reqData).then((res) => {
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

      reloadList() {
        this.buyList = []
        this.giftList = []

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
    }
  }
</script>

<style lang="scss" scoped>
  .user-coupon-box {
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
            background-color: #ededed;

            .data-item {
              margin: 20rpx 0rpx;
              padding: 10rpx;
              border-bottom: 3rpx dashed #f4f4f5;
              background-color: #fff;

              .item-wrap {
                padding: 10rpx;

                .left-tag {}

                .right-txt {
                  flex: 1;

                  .item-main {
                    margin: 10rpx 0;
                    color: #8c7f53;
                    font-size: 14px;

                    .item-title {
                      font-size: 16px;
                    }

                    .money {}
                  }

                  .item-note {
                    height: 48rpx;
                    line-height: 48rpx;
                    color: #a19d94;
                    font-size: 12px;
                    display: flex;
                    justify-content: flex-start;

                    .item-title {
                      margin-right: 30rpx;

                      .title {
                        margin-right: 10rpx;

                        &::after {
                          content: ':';
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
    }
  }
</style>