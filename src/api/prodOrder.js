import request from '@/utils/request'

/**
 * 查询产品列表
 * @param {*} req
 * @returns
 */
export function getProdDefList(params) {
  return request.get('/vod-protal/prod/def/list', {
    params: params
  }, { noAuth: true })
}

/**
 * 用户购买平台产品预下单
 * @param {*} req
 * @returns
 */
export function buyProdFormPreOrder(req) {
  return request.post('/vod-protal/prod/form/preBuyOrder', { data: req }, { noAuth: false })
}

/**
 * 用户购买平台产品表单创建
 * @param {*} req
 * @returns
 */
export function buyProdFormCrtOrder(req) {
  return request.post('/vod-protal/prod/form/crtBuyOrder', { data: req }, { noAuth: false })
}

/**
 * 用户购买平台产品-微信支付
 * @param {*} req
 * @returns
 */
export function buyProdPayForWeixin(req) {
  return request.post('/vod-protal/prod/form/buyPayForWx', { data: req }, { noAuth: false })
}

/**
 * 用户购买平台产品-查询微信支付结果
 * @param {*} req
 * @returns
 */
export function buyProdPayWeixinRes(req) {
  return request.post('/vod-protal/prod/form/buyPayWxRes', { data: req }, { noAuth: false })
}
