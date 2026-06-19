<!--
* @Description: 
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-08 08:11:52
* @LastEditors: wangxc
* @LastEditTime: 2024-04-08 08:11:52
-->
<template>
  <view class="my-box">
    <view :style="{ height: `${config.bottomBarHeight}px` }">
      <view class="mid" style="flex: 1; overflow: hidden">
        <scroll-view scroll-y="true" style="height: 100%">
          <view class="bg"></view>
          <view class="head plr15">
            <view class="user-card">
              <view class="user-info">
                <image v-if="isLogin && userInfo && userInfo.avatarUrl" class="avatar" :src="userInfo.avatarUrl" @click="goUserEdit()"></image>
                <image v-else class="avatar" src="/static/images/logo/f.png" mode="" @click="goUserEdit()"></image>
                <view class="info">
                  <view class="name" v-if="!isLogin" @tap="openAuto"> 请点击登录</view>
                  <view v-else>
                    <view class="name">
                      <view @click="goUserEdit()">{{ userInfo.nickName }}</view>
                      <view class="vip" v-if="userInfo.vip">
                        <view style="margin-left: 10rpx" class="vip-txt">{{ userInfo.vipName || '' }}</view>
                        <image :src="userInfo.vipIcon" alt="" />
                      </view>
                    </view>
                    <view class="num" v-if="userInfo.mobile && uid" @click="goUserEdit()">
                      <view class="num-txt">{{ userInfo.mobile }}</view>
                      <view class="icon">
                        <image src="/static/images/logo/edit.png" mode=""></image>
                      </view>
                    </view>
                    <view class="phone" v-if="isLogin && !userInfo.mobile" @tap="bindPhone">绑定手机号</view>
                  </view>
                  <view class="login-out" v-if="isLogin" @tap="loginOut">退出登录</view>
                </view>
              </view>
              <view class="num-wrapper">
                <view class="num-item" @click="goMenuPage('userMoney')">
                  <text class="num">{{ userAct && userAct.cashTotalLast ? Number(userAct.cashTotalLast).toFixed(2) : '0.00' }}</text>
                  <view class="txt">余额</view>
                </view>
                <view class="num-item" @click="goMenuPage('userCoupon')">
                  <text class="num">{{ userAct && userAct.couponCount ? userAct.couponCount : 0 }}</text>
                  <view class="txt">消费券</view>
                </view>
                <view class="num-item" @click="goMenuPage('/pagesUser/user_integral/index')">
                  <text class="num">{{ userAct && userAct.integral ? userAct.integral : 0 }}</text>
                  <view class="txt">积分</view>
                </view>
              </view>
            </view>
            <view class="order-wrapper">
              <view class="order-hd flex">
                <view class="left">我的信息</view>
                <!--
                <navigator class="right flex" hover-class="none" url="/pagesUser/users/order_list/index" open-type="navigate">
                  查看全部
                  <text class="iconfont icon-xiangyou"></text>
                </navigator>
                -->
              </view>
              <view class="order-bd">
                <block v-for="(item, index) in myIsuInfos" :key="index">
                  <navigator class="order-item" hover-class="none" :url="item.url">
                    <view class="pic">
                      <image :src="item.img" mode="aspectFill"></image>
                      <text class="order-status-num" v-if="item.num > 0">{{ item.num }}</text>
                    </view>
                    <view class="txt">{{ item.title }}</view>
                  </navigator>
                </block>
              </view>
            </view>
          </view>
          <view class="contenBox">
            <!-- 轮播 -->
            <view class="slider-wrapper" v-if="imgUrls.length > 0">
              <swiper
                indicator-dots="true"
                :autoplay="autoplay"
                :circular="circular"
                :interval="interval"
                :duration="duration"
                indicator-color="rgba(255,255,255,0.6)"
                indicator-active-color="#fff">
                <block v-for="(item, index) in imgUrls" :key="index">
                  <swiper-item class="borRadius14">
                    <image :src="item.pic" class="slide-image" @click="navito(item.url)"></image>
                  </swiper-item>
                </block>
              </swiper>
            </view>

            <!-- 会员菜单 -->
            <view class="user-menus" style="margin-top: 20rpx" v-if="isLogin">
              <view class="menu-title">我的服务</view>
              <view class="list-box">
                <block v-if="isLogin">
                  <block v-for="(item, index) in MyMenus" :key="index">
                    <navigator
                      class="item"
                      :url="item.url"
                      hover-class="none"
                      v-if="!(item.url == '/pages/service/index' || (item.url == '/pagesUser/user_spread_user/index' && !userInfo.isPromoter))">
                      <image :src="item.pic" mode="aspectFill"></image>
                      <text>{{ item.name }}</text>
                    </navigator>
                  </block>
                </block>
              </view>
            </view>

            <!-- 系统管理员菜单 -->
            <view v-if="cityAdminUids.includes(uid)" class="user-menus" style="margin-top: 20rpx">
              <view class="menu-title">我的待办</view>
              <view class="list-box">
                <block v-if="isLogin">
                  <block v-for="(item, index) in myMenus1" :key="index">
                    <navigator
                      class="item"
                      :url="item.url"
                      hover-class="none"
                      v-if="!(item.url == '/pages/service/index' || (item.url == '/pagesUser/user_spread_user/index' && !userInfo.isPromoter))">
                      <image :src="item.pic" mode="aspectFill"></image>
                      <text>{{ item.name }}</text>
                    </navigator>
                  </block>
                </block>
              </view>
            </view>

            <!-- 系统服务 -->
            <view class="user-menus" style="margin-top: 20rpx">
              <view class="menu-title">其他功能</view>
              <view class="list-box">
                <block>
                  <block v-for="(item, index) in myMenus2" :key="index">
                    <navigator
                      class="item"
                      :url="item.url"
                      hover-class="none"
                      v-if="!(item.url == '/pages/service/index' || (item.url == '/pagesUser/user_spread_user/index' && !userInfo.isPromoter)) && (!item.isUser || item.isUser && isLogin)">
                      <image :src="item.pic" mode="aspectFill"></image>
                      <text>{{ item.name }}</text>
                    </navigator>
                  </block>
                </block>
                <!-- #ifndef MP -->
                <view class="item" @click="kefuClick">
                  <image :src="servicePic"></image>
                  <text>联系客服</text>
                </view>
                <!-- #endif -->
                <!-- #ifdef MP -->
                <button class="item" open-type="contact" hover-class="none">
                  <image :src="servicePic" mode="aspectFill"></image>
                  <text>联系客服</text>
                </button>
                <!-- #endif -->
              </view>
            </view>

            <image src="/static/images/support.png" alt="" class="support" />
            <view class="uni-p-b-98"></view>
          </view>
        </scroll-view>
      </view>
      <BottomBar v-model="barIndex" :barlists="barlists" />
    </view>

    <u-notify ref="uNotify" message="Hi uView"></u-notify>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import appstate from '@/libs/appstate'
import keys from '@/config/keys.js'
import { getUserAccount } from '@/api/user'
import { userAvatarCheckRes } from '@/api/public'

export default {
  name: 'my',
  components: {},
  data() {
    return {
      barIndex: 5,
      config: this.$config,
      cityAdminUids: [],

      servicePic: '/static/images/tmp/customer.png',
      myIsuInfos: [
        {
          img: '/static/images/tmp/icon1.png',
          title: '我的发布',
          url: '/pagesUser/myissue/myissue',
          num: 0
        },
        {
          img: '/static/images/tmp/canyu.png',
          title: '我的参与',
          url: '/pagesUser/myissue/myjoin',
          num: 0
        }
        /* ,
        {
          img: '/static/images/tmp/icon6.png',
          title: '我的评论',
          url: '/pagesUser/order_list/index?status=1',
          num: 0
        },
        {
          img: '/static/images/tmp/icon2.png',
          title: '我的点赞',
          url: '/pagesUser/order_list/index?status=2',
          num: 0
        } */
      ],

      imgUrls: [],

      MyMenus: [
        {
          pic: '/static/images/tmp/icon11.png',
          name: '常居生活区',
          url: '/pagesUser/livecomm/live-comm'
        },
        {
          pic: '/static/images/tmp/icon15.png',
          name: '关注生活区',
          url: '/pagesUser/livecomm/care-comm'
        },
        {
          pic: '/static/images/tmp/icon4.png',
          name: '住所位置',
          url: '/pagesUser/livecomm/live-room'
        },
        {
          pic: '/static/images/tmp/shanhu.png',
          name: '我是商户',
          url: '/pagesUser/merch/index'
        },
        {
          pic: '/static/images/tmp/wuye.png',
          name: '居(村)委/物业',
          url: '/pagesUser/estate/index'
        }
        /*,
        {
          pic: '/static/images/tmp/zhenjian.png',
          name: '我的证件',
          url: '/pagesUser/order_list/index?status=0'
        } */
      ],

      myMenus1: [
        {
          pic: '/static/images/tmp/shenpi.png',
          name: '我的审批',
          url: '/pagesUser/todo/approve'
        }
      ],

      myMenus2: [
        {
          lab: 'fuxy',
          pic: '/static/images/tmp/fwxy2.png',
          name: '用户服务协议',
          url: '/pagesCommon/article/index?articleId=1001',
          isUser: false
        },
        {
          lab: 'ysxy',
          pic: '/static/images/tmp/ysxy.png',
          name: '隐私协议',
          url: '/pagesCommon/article/index?articleId=1101',
          isUser: false
        },
        {
          lab: 'fxm',
          pic: '/static/images/tmp/fenxma.png',
          name: '邀请码',
          url: '/pagesUser/spreadcode/index',
          isUser: false
        },
        {
          lab: 'tsjy',
          pic: '/static/images/tmp/tsjy.png',
          name: '投诉/建议',
          url: '/pagesUser/suggest/index',
          isUser: false
        }
      ],

      userAct: {} //账户总信息
    }
  },
  onLoad(e) {
    console.log(e)
  },
  computed: {
    ...mapGetters({
      localArea: 'app/localArea',
      isLogin: 'user/isLogin',
      uid: 'user/uid',
      userInfo: 'user/userInfo'
    })
  },
  onShow(e) {
    this.getUserActInfo()
    this.getUserAvatarCheckRes()
  },
  created() {
    this.init()
  },
  watch: {},
  methods: {
    init() {
      if (this.localArea.cityServer.cityAdminUids) {
        this.cityAdminUids = JSON.parse(this.localArea.cityServer.cityAdminUids)
      }

      const fxmMenuIdx = this.myMenus2.findIndex((el) => el.lab === 'fxm')
      if (fxmMenuIdx > -1 && this.isLogin) {
        this.myMenus2[fxmMenuIdx].name = '我的邀请码'
      } else {
        this.myMenus2[fxmMenuIdx].name = '小程序码'
      }
    },

    /**
     * 用户最近更新头像后UGC返回的检查结果
     */
    getUserAvatarCheckRes() {
      const _that = this
      userAvatarCheckRes().then((res) => {
        if (res.code === 0) {
          const checkRes = res.data
          if (checkRes) {
            if (checkRes.errCode === 0 && 'ok' === checkRes.errMsg) {
              // 检查成功
              const resLabel = checkRes.label
              if (resLabel === 100) {
                // 正常
              } else if (resLabel === -100) {
                if(checkRes.mediaChkRes && Array.isArray(checkRes.mediaChkRes) && checkRes.mediaChkRes.length > 0) {
                  const tipMsg = `最近更改的用户头像因疑似【${checkRes.mediaChkRes[0]}】图片而未生效`
                  _that.$refs.uNotify.show({
                    top: 50,
                    type: 'error',
                    color: '#ed1c24',
                    bgColor: '#e8e8e8',
                    message: tipMsg,
                    duration: 1000 * 3,
                    fontSize: 14,
                    safeAreaInsetTop:true
                  })
                }
              }
            }
          }
        }
      })
    },

    getUserActInfo() {
      const _that = this
      if (this.isLogin) {
        getUserAccount().then((res) => {
          if (res.code === 0) {
            const _res = res.data
            if (_res) {
              _that.userAct = _res
            }
          }
        })
      }
    },

    // 编辑页面
    goUserEdit() {
      const _that = this
      if (this.isLogin == false) {
        appstate.toLogin()
      } else {
        /* uni.navigateTo({
						url: '/pagesUser/userinfo/index'
					}) */
        _that.$Router.push({ name: 'userinfo', params: { lineIdx: 1 } })
      }
    },

    loginOut() {
      this.$store.dispatch('user/actLoginOut')
      this.userAct = {}
      this.init()
    },

    // 打开授权
    openAuto() {
      this.$cache.setCache(keys.BACK_URL, '')
      appstate.toLogin()
    },

    goMenuPage(pageName) {
      const _that = this
      _that.$Router.push({ name: pageName, params: {} })
    }

  }
}
</script>

<style lang="scss" scoped>
page,
body {
  height: 100%;
}

.my-box {
  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 420rpx;
    background-image: url('~@/static/images/user_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .head {
    background: linear-gradient(360deg, rgba(255, 121, 49, 0) 0%, rgba(248, 74, 29, 0.82) 39%, #e93323 100%);

    .user-card {
      position: relative;
      width: 100%;
      margin: 0 auto;
      padding: 35rpx 0 30rpx 0;

      .user-info {
        z-index: 20;
        position: relative;
        display: flex;

        .avatar {
          width: 120rpx;
          height: 120rpx;
          border-radius: 50%;
        }

        .info {
          flex: 1;
          display: flex;
          justify-content: space-between;
          margin-left: 20rpx;
          padding: 15rpx 0;

          .name {
            display: flex;
            align-items: center;
            color: #fff;
            font-size: 31rpx;
          }

          .num {
            display: flex;
            align-items: center;
            font-size: 26rpx;
            color: rgba(255, 255, 255, 0.6);
            margin-top: 15rpx;

            image {
              width: 22rpx;
              height: 23rpx;
              margin-left: 20rpx;
            }
          }

          .login-out {
            margin-right: 20rpx;
          }
        }
      }
      .num-wrapper {
        z-index: 30;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 30rpx;
        color: #fff;

        .num-item {
          width: 33.33%;
          text-align: center;
          .num {
            font-size: 42rpx;
            font-weight: bold;
          }
          .txt {
            margin-top: 10rpx;
            font-size: 26rpx;
            color: rgba(255, 255, 255, 0.6);
          }
        }
      }
    }

    .order-wrapper {
      background-color: #fff;
      border-radius: 14rpx;
      padding: 30rpx 16rpx;
      position: relative;
      z-index: 11;

      .order-hd {
        justify-content: space-between;
        font-size: 30rpx;
        color: #282828;
        margin-bottom: 40rpx;
        padding: 0 16rpx;

        .left {
          color: #282828;
          font-size: 30rpx;
          font-weight: 600;
        }
        .right {
          align-items: center;
          color: #666666;
          font-size: 26rpx;
        }
      }

      .order-bd {
        display: flex;
        justify-content: space-evenly;
        padding: 0;

        .order-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .pic {
            position: relative;
            text-align: center;

            image {
              width: 80rpx;
              height: 80rpx;
            }

            .order-status-num {
              min-width: 12rpx;
              background-color: #fff;
              color: #ee5a52;
              border-radius: 15px;
              position: absolute;
              right: -14rpx;
              top: -15rpx;
              font-size: 20rpx;
              padding: 0 8rpx;
              border: 1px solid #ee5a52;
            }
          }
          .txt {
            margin-top: 15rpx;
            font-size: 26rpx;
            color: #454545;
          }
        }
      }
    }
  }

  .contenBox {
    padding: 0 30rpx;

    .slider-wrapper {
      margin: 20rpx 0;
      height: 138rpx;

      swiper,
      swiper-item {
        height: 100%;
      }

      image {
        width: 100%;
        height: 100%;
      }
    }

    .user-menus {
      background-color: #fff;
      border-radius: 14rpx;

      .menu-title {
        padding: 30rpx 30rpx 40rpx;
        font-size: 30rpx;
        color: #282828;
        font-weight: 600;
      }

      .list-box {
        display: flex;
        flex-wrap: wrap;
        padding: 0;
      }

      .item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;
        width: 25%;
        margin-bottom: 47rpx;
        font-size: 26rpx;
        color: #333333;

        image {
          width: 80rpx;
          height: 80rpx;
          margin-bottom: 18rpx;
        }

        &:last-child::before {
          display: none;
        }
      }

      button {
        font-size: 28rpx;
      }
    }
  }
}
</style>
