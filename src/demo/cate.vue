<!--
* @Description: 社区小商店主页面
* @Author: wangxc
* @Email: 17236423@qq.com
* @Date: 2024-04-08 08:12:18
* @LastEditors: wangxc
* @LastEditTime: 2024-04-08 08:12:18
-->
<template>
  <view class="cate-box">
    <view class='header acea-row row-center-wrapper'>
      <view class='acea-row row-between-wrapper input'>
        <text class='myicon icon-sousuo'></text>
        <input type='text' placeholder='点击搜索商品信息' @confirm="searchSubmitValue" confirm-type='search' name="search"
          placeholder-class='placeholder' />
      </view>
    </view>
    <view class='aside' :style="{ bottom: tabbarH + 'px', height: height + 'rpx' }">
      <scroll-view scroll-y="true" scroll-with-animation='true' style="height: 100%;">
        <view class='item acea-row row-center-wrapper' :class='index == navActive ? "on" : ""'
          v-for="(item, index) in cateList" :key="index" @click='tap(index, "b" + index)'>
          <text>{{ item.name }}</text>
        </view>
      </scroll-view>
    </view>
    <view class='conter'>
      <scroll-view scroll-y="true" :scroll-into-view="toView" :style='"height:" + height + "rpx;margin-top: 96rpx;"'
        @scroll="scroll" scroll-with-animation='true'>
        <block v-for="(item, index) in productList" :key="index">
          <view class='listw' :id="'b' + index">
            <view class='title acea-row row-center-wrapper'>
              <view class='line'></view>
              <view class='name'>{{ item.name }}</view>
              <view class='line'></view>
            </view>
            <view class='list acea-row'>
              <block v-for="(itemn, indexn) in item.child" :key="indexn">
                <navigator hover-class='none' :url='"/pages/goods_list/index?cid=" + itemn.id + "&title=" + itemn.name'
                  class='item acea-row row-column row-middle'>
                  <view class='picture' :style="{ 'background-color': itemn.extra ? 'none' : '#f7f7f7' }">
                    <image :src='itemn.extra'></image>
                  </view>
                  <view class='name line1'>{{ itemn.name }}</view>
                </navigator>
              </block>
            </view>
          </view>
        </block>
        <view :style='"height:" + (height - 300) + "rpx;"' v-if="number < 15"></view>
      </scroll-view>
    </view>


    <view class="page-bottom" :style="{ height: `${bottomBarHeight}px` }">
      <BottomBar v-model='barIndex' :barlists="barlists" />
    </view>
  </view>
</template>

<script>
import empty from '@/components/Empty.vue'
import config from '@/config/config';

export default {
  name: 'cate',
  components: {
    empty
  },
  data () {
    return {
      barIndex: 2,
      bottomBarHeight: config.bottomBarHeight,
      tabbarH: 0,
      height: 0,
      cateList: [
        { name: '活动' },
        { name: '便民' },
        { name: '团购' },
        { name: '小工具' },
        { name: '租借' }
      ],
      navActive: 1
    }
  },
  onLoad (e) {
    console.log(e)
    this.infoScroll()
  },
  computed: {
  },
  created () {
  },
  watch: {
  },
  methods: {
    infoScroll: function () {
      let that = this;
      let len = that.cateList.length;
      let child = that.cateList[len - 1] && that.cateList[len - 1].child ? that.cateList[len - 1].child : [];
      this.number = child ? child.length : 0;

      //设置商品列表高度
      const windowInfo = uni.getWindowInfo() // 窗口信息
      that.height = (windowInfo.windowHeight) * (750 / windowInfo.windowWidth) - 98;

      let hightArr = [];
      for (let i = 0; i < len; i++) {
        //获取元素所在位置
        let query = uni.createSelectorQuery().in(this);
        let idView = "#b" + i;
        query.select(idView).boundingClientRect();
        query.exec(function (res) {
          let top = res[0].top;
          hightArr.push(top);
          that.hightArr = hightArr
        });
      };
    },
    tap: function (index, id) {
      this.toView = id;
      this.navActive = index;
    },
    scroll: function (e) {
      let scrollTop = e.detail.scrollTop;
      let scrollArr = this.hightArr;
      for (let i = 0; i < scrollArr.length; i++) {
        if (scrollTop >= 0 && scrollTop < scrollArr[1] - scrollArr[0]) {
          this.navActive = 0
        } else if (scrollTop >= scrollArr[i] - scrollArr[0] && scrollTop < scrollArr[i + 1] - scrollArr[0]) {
          this.navActive = i
        } else if (scrollTop >= scrollArr[scrollArr.length - 1] - scrollArr[0]) {
          this.navActive = scrollArr.length - 1
        }
      }
    },
    getAllCategory: function () {
      let that = this;
      getCategoryList().then(res => {
        that.productList = res.data;
        setTimeout(function () {
          that.infoScroll();
        }, 500)
      })
    },
    searchSubmitValue: function (e) {
      if (this.$util.trim(e.detail.value).length > 0)
        uni.navigateTo({
          url: '/pages/goods_list/index?searchValue=' + e.detail.value
        })
      else
        return this.$uniUtil.tips({
          title: '请填写要搜索的产品信息'
        });
    },
  }
}
</script>

<style lang="scss" scoped>
.cate-box {
  .header {
    width: 100%;
    height: 96rpx;
    background-color: #fff;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
    border-bottom: 1rpx solid #f5f5f5;

    .input {
      width: 700rpx;
      height: 60rpx;
      background-color: #f5f5f5;
      border-radius: 50rpx;
      box-sizing: border-box;
      padding: 0 25rpx;

      .iconfont {
        font-size: 26rpx;
        color: #555;
      }

      .placeholder {
        color: #999;
      }

      input {
        font-size: 26rpx;
        height: 100%;
        width: 597rpx;
      }
    }
  }

  .aside {
    position: fixed;
    width: 180rpx;
    left: 0;
    top: 0;
    background-color: #f7f7f7;
    overflow-y: scroll;
    overflow-x: hidden;

    height: auto;
    margin-top: 96rpx;

    .item {
      height: 100rpx;
      width: 100%;
      font-size: 26rpx;
      color: #424242;

      .on {
        background-color: #fff;
        border-left: 4rpx solid #fc4141;
        width: 100%;
        text-align: center;
        color: #fc4141;
        font-weight: bold;
      }
    }
  }

  .conter {
    margin: 96rpx 0 0 180rpx;
    padding: 0 14rpx;
    background-color: #fff;

    .listw {
      padding-top: 20rpx;

      .title {
        height: 90rpx;

        .line {
          width: 100rpx;
          height: 2rpx;
          background-color: #f0f0f0;
        }

        .name {
          font-size: 28rpx;
          color: #333;
          margin: 0 30rpx;
          font-weight: bold;
        }
      }

    }

    .list {
      flex-wrap: wrap;

      .item {
        width: 177rpx;
        margin-top: 26rpx;

        .picture {
          width: 120rpx;
          height: 120rpx;
          border-radius: 50%;

          image {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            div {
              background-color: #f7f7f7;
            }
          }
        }

        .name {
          font-size: 24rpx;
          color: #333;
          height: 56rpx;
          line-height: 56rpx;
          width: 120rpx;
          text-align: center;
        }
      }
    }

  }
}
</style>
