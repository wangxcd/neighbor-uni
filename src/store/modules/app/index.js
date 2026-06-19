import cache from '@/utils/storage'
import keys from '@/config/keys'
import config from '@/config/config'

const catchSysInfo = cache.getCache(keys.SYS_INFO)
const catchLociTude = cache.getCache(keys.LOCAL_TUDE)
const catchLocalArea = cache.getCache(keys.LOCAL_AREA)
const catchLocalComm = cache.getCache(keys.LOCAL_COMM)
const catchIsuCateList = cache.getCache(keys.ISU_CATE_LIST)
const catchLocalServer = cache.getCache(keys.LOCAL_SERVER)
const catchSysConfig = cache.getCache(keys.SYS_CONFIG)

/**
  localArea: {
    nation: {}, // 国家
    province: {}, // 省份
    city: {}, // 城市
    district: {} //区县
  }
*/

const state = {
  // sysInfo为前端设备的信息
  sysInfo: catchSysInfo,

  // sysConfig主要为后端服务配置的系统参数
  sysConfig: catchSysConfig || {
    switchCashRecharge: 0,
    switchCashWithdraw: 0,
    switchCouponBuy: 0
  },

  // 位置经纬度, 缓存用于后续位置服务
  lociTude: catchLociTude || {
    latitude: 0,
    longitude: 0
  },

  // 信息服务器
  locIsuServer: catchLocalServer || {
    domain: '',
    preUrl: '',
    comPreUrl: ''
  },

  // 当前区域(主要为定位的区域)
  localArea: catchLocalArea || {
    nation: {}, // 国家
    province: undefined, // 省份
    city: undefined, // 城市
    ad: undefined, //区县
    cityServer: undefined // 城市服务
  },

  // 当前住宅区(主要为选择的区域)
  localComm: catchLocalComm || {
    ad: undefined, // 所在区县
    town: undefined, // 所在街道(乡镇)
    comm: undefined // 住宅区信息
  },

  userCommRole: {
    commRole: {},
    roleName: '访客'
  },

  // 所有发布类目列表
  isuCateList: catchIsuCateList
}

const mutations = {
  SYSTEM_INFO(state, sysInfo) {
    state.sysInfo = sysInfo
    cache.setCache(keys.SYS_INFO, state.sysInfo)
  },
  SYSTEM_Cfg(state, sysConfig) {
    state.sysConfig = sysConfig
    cache.setCache(keys.SYS_CONFIG, state.sysConfig)
  },
  LOCAL_ITUDE(state, lociTude) {
    state.lociTude = lociTude
    cache.setCache(keys.LOCAL_TUDE, lociTude)
  },
  LOC_ISU_PRE_URL(state, locIsuPreUrl) {
    state.locIsuPreUrl = locIsuPreUrl
  },
  LOCAL_AREA(state, localArea) {
    state.localArea = Object.assign(state.localArea, localArea)
    cache.setCache(keys.LOCAL_AREA, state.localArea)

    // isu服务的地址前缀
    state.locIsuServer.domain = localArea.cityServer.serveDomain
    state.locIsuServer.preUrl = localArea.cityServer.serveDomain + '/api/pisu/'
    state.locIsuServer.comPreUrl = config.HTTP_REQUEST_URL + '/api/pcom/'

    cache.setCache(keys.LOCAL_SERVER, state.locIsuServer)
  },

  LOC_CITY_SERVER(state, cityServer) {
    if (cityServer && cityServer.serveDomain) {
      // isu服务的地址前缀
      state.locIsuServer.domain = localArea.cityServer.serveDomain
      state.locIsuServer.preUrl = localArea.cityServer.serveDomain + '/api/pisu/'
      state.locIsuServer.comPreUrl = config.HTTP_REQUEST_URL + '/api/pcom/'

      state.localArea.cityServer = cityServer
      cache.setCache(keys.LOCAL_AREA, state.localArea)
      cache.setCache(keys.LOCAL_SERVER, state.locIsuServer)
    }
  },

  LOC_ISU_SERVER(state, serveDomain) {
    state.locIsuServer.domain = serveDomain
    state.locIsuServer.preUrl = serveDomain + '/api/pisu/'
    state.locIsuServer.comPreUrl = config.HTTP_REQUEST_URL + '/api/pcom/'
    cache.setCache(keys.LOCAL_SERVER, state.locIsuServer)
  },
  LOCAL_COMM(state, localComm) {
    state.localComm = localComm
    cache.setCache(keys.LOCAL_COMM, state.localComm)
  },
  CLEAR_LOCAL_COMM(state) {
    state.localComm = {
      ad: undefined, // 所在区县
      town: undefined, // 所在街道(乡镇)
      comm: undefined // 住宅区信息
    }
    cache.clearCache(keys.LOCAL_COMM)
  },
  ISU_CATE_LIST(state, isuCateList) {
    state.isuCateList = isuCateList
  },
  // 用户生活区角色
  USER_COMM_ROLE(state, commRole) {
    state.userCommRole.commRole = commRole
    if (commRole) {
      if (commRole.isReside === 1) {
        state.userCommRole.roleName = '住户'
      } else if (commRole.isMerch === 1) {
        state.userCommRole.roleName = '商户'
      } else if (commRole.isEstate === 1) {
        state.userCommRole.roleName = '物业'
      } else {
        state.userCommRole.roleName = '访客'
      }
    } else {
      state.userCommRole.roleName = '访客'
    }
  }
}

const actions = {
  setSysInfo({ commit }, sysInfo) {
    commit('SYSTEM_INFO', sysInfo)
  },
  setSysConfig({ commit }, sysConfig) {
    commit('SYSTEM_Cfg', sysConfig)
  },
  setLociTude({ commit }, lociTude) {
    commit('LOCAL_ITUDE', lociTude)
  },
  setLocalArea({ commit }, localArea) {
    commit('LOCAL_AREA', localArea)
  },
  setLocIsuServer({ commit }, serveDomain) {
    commit('LOC_ISU_SERVER', serveDomain)
  },
  setLocalComm({ commit }, localComm) {
    commit('LOCAL_COMM', localComm)
  },
  clearLocalComm({ commit }) {
    commit('CLEAR_LOCAL_COMM')
  },
  setIsuCateList({ commit }, isuCateList) {
    commit('ISU_CATE_LIST', isuCateList)
  },
  setUserCommRole({ commit }, commRole) {
    commit('USER_COMM_ROLE', commRole)
  }
}

const getters = {
  sysInfo: (state) => state.sysInfo,
  sysConfig: (state) => state.sysConfig,
  lociTude: (state) => state.lociTude,
  locIsuPreUrl: (state) => state.locIsuServer.preUrl,
  locComPreUrl: () => config.HTTP_REQUEST_URL + '/api/pcom/',
  localArea: (state) => state.localArea,
  localComm: (state) => state.localComm,
  isuCateList: (state) => state.isuCateList,
  userCommRole: (state) => state.userCommRole
}

export default {
  state,
  mutations,
  actions,
  getters
}
