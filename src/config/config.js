import website from "./website"

export default {
  HTTP_REQUEST_URL: process.env.VUE_APP_BASE_URL,
  BASE_CONTEXT: 'vod-protal',
  LOCAL_FILE_URL: '/fv/storage/', // 本地文件相对URL
  CONTENT_TYPE_JSON: 'application/json',
  CONTENT_TYPE_FORM: 'application/x-www-form-urlencoded',
  TOKENNAME: 'Authorization', // 会话密钥名称 请勿修改此配置

  webConfig: {
    ...website
  },

  account: {
    mapKey: 'E5MBZ-XHUKB-N45UH-NLZ2P-532LJ-KVF7J', // 腾讯位置服务申请的key
    mapWebServiceSig: 's55NStPPQq6NnfZ8mWeFak2lw69ivN3s' // 腾讯位置服务的WebServiceAPI的安全密钥
  },

  appCnName: '你居吾邻',

  bottomBarHeight: 50,
  bottomBars: [
    {
      pagePath: '/pages/home/index/index',
      name: 'home',
      icon: 'icon-shouye',
      text: '首页', // 零散交互
      desc: '用于用户操作引导、及时提示时效性高的信息'
    },
    {
      pagePath: '/pagesStore/index',
      name: 'store',
      icon: 'icon-shangdian',
      text: '小店',
      desc: '生活区住户自营商业信息' //
    },
    {
      pagePath: '/pages/home/issue/index',
      name: 'issue',
      icon: 'icon-zengjia',
      text: '发布',
      desc: '信息的发布'
    },
    /*
    {
      pagePath: '/pagesHandy/index',
      name: 'handy',
      icon: 'icon-fatie_icon',
      text: '便民',
      desc: '生活中常用信息或小工具'
    },*/
    {
      pagePath: '/pagesUser/index',
      name: 'my',
      icon: 'icon-wode',
      text: '我的',
      desc: '用户中心'
    }
  ]
}
