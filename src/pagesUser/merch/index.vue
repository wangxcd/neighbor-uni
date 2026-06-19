<!--
* @Description: 用户的商户信息
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2025-07-21 10:46:53
* @LastEditors: wangxc
* @LastEditTime: 2025-07-21 10:46:53
-->
<template>
  <view class="main-box">
    <view class="top-stat">
      <!-- 顶部状态 -->
      <view class="form-section action">
        <view class="desc">
          <view class="action-title">商户业务说明:</view>
          <view class="notes-item" style="color: #fa3534">
            1.商户是生活区中一个主要角色，是利用小区商铺店面提供商业服务的的商业经营者;
          </view>
          <view class="notes-item" style="color: #fa3534">
            2.商户可以是小区中住户，也可以是租用店面的非住户，商铺的雇主与员工都属于小区商户角色，商户与住户在小区中有同等的业务权限，都可以在小区中自主发布信息、提供服务或接受服务；
          </view>
          <view class="notes-item" style="color: #fa3534">
            3.商户可联系平台客服，申请将商户信息展示在"首页-品质商家"栏，以方便小区住户找到并联系。
          </view>
        </view>
      </view>
    </view>
    <view class="body">
      <!--用户所有的商户信息(无论雇主还是雇员)-->

    </view>
    <view class="footer">
      <view class="btn creat-btn">
        <button class="op" @click="toReg">
          <text class="myicon icon-zengjia"></text>
          <text>我是小区商户，登记我的商铺信息</text>
        </button>
      </view>
      <view class="btn join-btn">
        <button class="op" @click="toJoin">
          <text class="myicon icon-zengjia"></text>
          <text>我是商铺员工，现在加入我的商铺</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'

  export default {
    name: 'index',
    components: {},
    data() {
      return {}
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
    computed: {},
    created() {},
    mounted() {},
    watch: {},
    methods: {
      /**
       * 商户登记
       */
      toReg() {
        this.$Router.push({
          path: '/merchReg'
        })
      },

      /**
       * 商户员工加入
       */
      toJoin() {
        this.$Router.push({
          path: '/merchMemb'
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .main-box {
    .top-stat {
      margin: 20rpx;

      .action {
        .desc {
          font-size: 24rpx;
          font-family: PingFang SC;

          .notes-item {
            margin-top: 10rpx;
          }
        }
      }
    }

    .footer {
      .btn {
        margin-top: 150rpx;
        display: flex;
        justify-content: center;

        .op {
          width: 90%;
          height: 80rpx;
          line-height: 80rpx;
          font-size: 34rpx;
          color: #fff;
          background: #06a8ff;
        }
      }
    }
  }
</style>