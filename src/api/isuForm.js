/*
 * 信息发布表单接口
 */
import request from '@/utils/request'

/**
 * 信息发布类目预置条件检查
 * @param {*} req
 * @returns
 */
export function isuPreFormCheck(req) {
  return request.post('/vod-protal/isu/form/preCheck', { data: req }, { noAuth: false })
}

/**
 * 信息发布表单初始化数据
 * @param {*} req
 * @returns
 */
export function isuInitFormData(req) {
  return request.post('/vod-protal/isu/form/initIsuForm', { data: req }, { noAuth: false })
}

/**
 * 信息发布表单预提交
 * @param {*} req
 * @returns
 */
export function isuFormPreOrder(req) {
  return request.post('/vod-protal/isu/form/preIsuOrder', { data: req }, { noAuth: false })
}

/**
 * 信息发布创建支付订单
 * @param {*} req
 * @returns
 */
export function isuFormCrtPayOrder(req) {
  return request.post('/vod-protal/isu/form/crtPayOrder', { data: req }, { noAuth: false })
}

/**
 * 信息发布无需支付时请求处理
 * @param {*} req
 * @returns
 */
export function isuFormPayForNoPayPaid(req) {
  return request.post('/vod-protal/isu/form/payForNoPay/paid', { data: req }, { noAuth: false })
}

/**
 * 信息发布-使用余额支付发布费用
 * @param {*} req
 * @returns
 */
export function isuFormPayForYuePaid(req) {
  return request.post('/vod-protal/isu/form/payForYue/paid', { data: req }, { noAuth: false })
}

/**
 * 信息发布-使用余额支付发布费用后回调处理
 * @param {*} req
 * @returns
 */
export function isuFormPayForYueNotify(req) {
  return request.post('/vod-protal/isu/form/payForYue/notify', { data: req }, { noAuth: false })
}

/**
 * 信息发布-使用余额支付发布费用
 * @param {*} req
 * @returns
 */
export function isuFormPayForWxPaid(req) {
  return request.post('/vod-protal/isu/form/payForWx/paid', { data: req }, { noAuth: false })
}

/**
 * 信息发布-使用余额支付发布费用后回调处理
 * @param {*} req
 * @returns
 */
export function isuFormPayForWxPayRes(req) {
  return request.post('/vod-protal/isu/form/payForWx/payRes', { data: req }, { noAuth: false })
}

/**
 * 信息发布表单创建
 * @param {*} req
 * @returns
 */
export function isuFormCreate(req) {
  return request.post('/vod-protal/isu/form/createIsu', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 信息发布表单编辑
 * @param {*} req
 * @returns
 */
export function isuFormEdit(req) {
  return request.post('/vod-protal/isu/form/editIsu', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 信息发布表单-微信支付
 * @param object req
 */
export function isuFormOrderWxPay(req) {
  return request.post('/vod-protal/isu/pay/forWeixin', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 微信订单支付结果查询
 * @param object req
 */
export function isuOrderWxPayRes(req) {
  return request.post('/vod-protal/isu/pay/wxPayRes', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 信息发布表单-余额支付
 * @param object req
 */
export function isuFormOrderYue(req) {
  return request.post('/vod-protal/isu/pay/forYue', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 信息发布表单-支付结果查询
 * @param object req
 */
export function isuFormOrderPayRes(req) {
  return request.post('/vod-protal/isu/pay/payRet', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 信息发布表单-支付成功后回调处理
 * @param object req
 */
export function isuFormOrderPaySucessBack(req) {
  return request.post('/vod-protal/isu/form/payBack', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 添加信息评论、回复
 * @param {*} req
 * @returns
 */
export function isuAddReply(req) {
  return request.post('/vod-protal/isu/form/addReply', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 信息(评论、回复)点赞或反对
 * @param {*} req
 * @returns
 */
export function isuPraOrOpp(req) {
  return request.post('/vod-protal/isu/form/praOrOpp', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 更改信息专有字段值
 * @param {*} req
 * @returns
 */
export function isuUpdSpecl(req) {
  return request.post('/vod-protal/isu/form/updSpecl', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 下架发布信息
 * @param {*} req
 * @returns
 */
export function isuPullOff(req) {
  return request.post('/vod-protal/isu/form/pullOff', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 删除发布信息
 * @param {*} req
 * @returns
 */
export function isuRemove(req) {
  return request.post('/vod-protal/isu/form/remove', { data: req }, { noAuth: false, pType: 'isu' })
}
