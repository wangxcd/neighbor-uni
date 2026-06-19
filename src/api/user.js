import request from '@/utils/request'

/**
 * 获取用户信息
 * 需要用户登录认证
 */
export function getLoginUserInfo() {
  return request.get(`/vod-protal/user/info`, {}, { noAuth: false })
}

/**
 * 获取用户信息
 * 需要用户登录认证
 */
export function getUserInfos(uids) {
  return request.post(`/vod-protal/user/userInfos`, { data: uids }, { noAuth: true })
}

/**
 * 获取用户信息
 * 无需要用户登录认证
 */
export function getUInfo(uid) {
  return request.post(`/vod-protal/user/uInfo`, { data: uid }, { noAuth: true })
}

/**
 * 修改用户信息
 * @param object
 */
export function userEdit(req) {
  return request.post('/vod-protal/user/edit', { data: req }, { noAuth: false })
}

/**
 * 获取用户账户信息
 * @param object
 */
export function getUserAccount() {
  return request.get('/vod-protal/user/account/info', {}, { noAuth: false })
}

/**
 * 获取用户消费券信息
 * @param object
 */
export function getUserCoupons() {
  return request.get('/vod-protal/user/account/coupons', {}, { noAuth: false })
}

/**
 * 获取用户可用消费券信息
 * @param object
 */
export function getUserCanCoupons() {
  return request.get('/vod-protal/user/account/canCoupons', {}, { noAuth: false })
}

/**
 * h5用户发送验证码
 * @param data object 用户手机号
 */
export function sendPhoneCode(phone) {
  return request.post('/vod-protal/login/sendCode', { data: phone }, { noAuth: true })
}

/**
 * 用户提交投诉建议
 * @param data suggest 投诉建议信息
 */
export function addUserSuggest(suggest) {
  return request.post('/vod-protal/user/suggest/add', { data: suggest }, { noAuth: false })
}

/**
 * 用户提现申请
 * @param object data
 */
export function withDrawCash(req) {
  return request.post('/vod-protal/weixin/withDraw/apply', { data: req }, { noAuth: false })
}

/**
 * 用户提现处理结果查询
 * @param {*} req 
 * @returns 
 */
export function queryWithDraw(req) {
  return request.post('/vod-protal/weixin/withDraw/trans/query', { data: req }, { noAuth: false })
}

/**
 * 用户提现撤销
 * @param object data
 */
export function cancelWithDraw(req) {
  return request.post('/vod-protal/weixin/withDraw/cancel', { data: req }, { noAuth: false })
}

/************************** */

/**
 * h5用户登录
 * @param data object 用户账号密码
 */
export function loginH5(data) {
  return request.post('login', data, { noAuth: true })
}

/**
 * h5用户手机号登录
 * @param data object 用户手机号 也只能
 */
export function loginMobile(data) {
  return request.post('login/mobile', data, { noAuth: true })
}

export function bindingPhone(data) {
  return request.post('update/binding', data)
}

/**
 * 换绑手机号校验
 *
 */
export function bindingVerify(data) {
  return request.post('update/binding/verify', data)
}

export function phoneSilenceAuth() { }

/**
 * 验证码key
 */
export function getCodeApi() {
  return request.get('verify_code', {}, { noAuth: true })
}

/**
 * h5用户发送验证码
 * @param data object 用户手机号
 */
export function sendCode(phone) {
  return request.post('sendCode', { phone: phone }, { noAuth: true }, 1)
}

/**
 * h5用户手机号注册
 * @param data object 用户手机号 验证码 密码
 */
export function register(data) {
  return request.post('register', data, { noAuth: true })
}

/**
 * 用户手机号修改密码
 * @param data object 用户手机号 验证码 密码
 */
export function registerReset(data) {
  return request.post('register/reset', data, { noAuth: true })
}

/*
 * 签到用户信息
 * */
export function postSignUser(sign) {
  return request.post('user/sign/user', sign)
}

/**
 * 获取签到配置
 *
 */
export function getSignConfig() {
  return request.get('user/sign/config')
}

/**
 * 获取签到列表
 * @param object data
 */
export function getSignList(data) {
  return request.get('user/sign/list', data)
}

/**
 * 用户签到
 */
export function setSignIntegral() {
  return request.get('user/sign/integral')
}

/**
 * 签到列表(年月)
 * @param object data
 *
 */
export function getSignMonthList(data) {
  return request.get('user/sign/month', data)
}

/*
 * 余额明细（types|2=全部,1=支出,2=收入）
 * */
export function getCommissionInfo(data) {
  return request.get('spread/commission/detail', data)
}

/*
 * 提现记录 getCountApi
 * */
export function getRecordApi(q) {
  return request.get('extract/record', q)
}

/*
 * 提现总金额
 * */
export function getCountApi() {
  return request.get('extract/totalMoney')
}

/*
 * 积分记录
 * */
export function getIntegralList(q) {
  return request.get('integral/list', q)
}

/**
 * 获取分销海报图片
 *
 */
export function spreadBanner(data) {
  return request.get('user/spread/banner', data)
}

/**
 *
 * 获取推广用户一级和二级
 * @param object data
 */
export function spreadPeople(data) {
  return request.get('spread/people', data)
}

/**
 *
 * 推广佣金/提现总和
 * @param int type
 */
export function spreadCount(type) {
  return request.get('spread/count/' + type)
}

/*
 * 推广数据 当前佣金 提现总金额
 * */
export function getSpreadInfo() {
  return request.get('commission')
}

/**
 *
 * 推广订单
 * @param object data
 */
export function spreadOrder(data) {
  return request.get('spread/order', data)
}

/*
 * 获取推广人排行
 * */
export function getRankList(q) {
  return request.get('rank', q)
}

/*
 * 获取佣金排名
 * */
export function getBrokerageRank(q) {
  return request.get('brokerage_rank', q)
}

/**
 * 提现申请
 * @param object data
 */
export function extractCash(data) {
  return request.post('extract/cash', data)
}

/**
 * 提现银行/提现最低金额
 *
 */
export function extractBank() {
  return request.get('extract/bank')
}

/*
 * 退出登录
 * */
export function getLoginOut() {
  return request.get('loginOut')
}
/**
 * 小程序充值
 *
 */
export function rechargeRoutine(data) {
  return request.post('recharge/routine', data)
}
/*
 * 公众号充值
 * */
export function rechargeWechat(data) {
  return request.post('recharge/wechat', data)
}

/*
 * app微信充值
 * */
export function appWechat(data) {
  return request.post('recharge/wechat/app', data)
}

/*
 * 余额充值
 * */
export function transferIn(data) {
  return request.post('recharge/transferIn', data, {}, 1)
}

/**
 * 充值金额选择
 */
export function getRechargeApi() {
  return request.get('recharge/index')
}

/**
 * 登录记录
 */
export function setVisit(data) {
  return request.post('user/set_visit', { ...data }, { noAuth: true })
}

/**
 * 客服列表
 */
export function serviceList() {
  return request.get('user/service/lst')
}
/**
 * 客服详情
 */
export function getChatRecord(to_uid, data) {
  return request.get('user/service/record/' + to_uid, data)
}

/**
 * 静默绑定推广人
 * @param {Object} puid
 */
export function spread(puid) {
  return request.get('user/bindSpread?spreadPid=' + puid)
}

/**
 * 当前用户在佣金排行第几名
 *
 */
export function brokerageRankNumber(data) {
  return request.get('user/brokerageRankNumber', data)
}

/**
 * 账单记录；
 *
 */
export function getBillList(data) {
  return request.get('recharge/bill/record', data)
}

/*
 * 积分中心详情
 * */
export function postIntegralUser() {
  return request.get('integral/user')
}

/*
 * 立即提现 冻结期、冻结佣金、可提现佣金、最低可提现金额
 * */
export function extractUser() {
  return request.get('extract/user')
}

/*
 * 推广人统计页 推广人数（一级+二级）、一级人数、二级人数
 * */
export function spreadPeoCount() {
  return request.get('spread/people/count')
}

/*
统计
*
*/
export function computeUser() {
  uni.request({
    url: document.location.protocol + '//shop.crmeb.net/index.php/admin/server.upgrade_api/updatewebinfo',
    method: 'POST',
    data: {
      host: window.location.host,
      https: document.location.protocol,
      version: 'CRMEB-JAVA-KY-V1.3.4',
      version_code: 'gitee',
      ip: Cache.has('Ip') ? Cache.get('Ip') : ''
    },
    dataType: 'json',
    success: (res) => { }
  })
}
