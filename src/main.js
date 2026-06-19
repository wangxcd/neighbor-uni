import Vue from 'vue'
import App from './App'
import './uni.promisify.adaptor'

import config from './config/config.js'
import store from './store'
import { router, RouterMount } from './router/router.js' //路径换成自己的
import routerlink from './router/link.vue'

import cache from './utils/storage.js'
import uniUtil from './utils/uniUtil.js'
import util from './utils/util.js'

import BottomBar from '@/common/components/BottomBar.vue'
import Empty from '@/common/components/Empty.vue'

Vue.use(router)

// 引入uView主JS库
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

Vue.component('routerlink', routerlink)
Vue.component('BottomBar', BottomBar)
Vue.component('Empty', Empty)

Vue.config.productionTip = false

Vue.prototype.$config = config
Vue.prototype.$store = store
Vue.prototype.$cache = cache
Vue.prototype.$util = util
Vue.prototype.$uniUtil = uniUtil

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
// app.$mount()

//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app, router, '#app')
// #endif

// #ifndef H5
app.$mount() //为了兼容小程序及app端必须这样写才有效果
// #endif
