/*
 * 信息发布表单接口
 */
import request from '@/utils/request'

/**
 * 分页查询付款信息
 * @param {*} req
 * @returns
 */
export function paidlogs(params, reqData) {
  return request.post(
    '/vod-protal/payment/paidlog',
    {
      params: params,
      data: reqData
    },
    { noAuth: false, pType: 'com' }
  )
}

/**
 * 分页查询消费券支付流水
 * @param {*} req
 * @returns
 */
export function couponPaidlogs(params, reqData) {
  return request.post(
    '/vod-protal/payment/couponPaidLog',
    {
      params: params,
      data: reqData
    },
    { noAuth: false, pType: 'com' }
  )
}

/**
 * 分页查询收入信息
 * @param {*} req
 * @returns
 */
export function incomelogs(params, reqData) {
  return request.post(
    '/vod-protal/payment/incomlog',
    {
      params: params,
      data: reqData
    },
    { noAuth: false, pType: 'com' }
  )
}

/**
 * 分页查询充值信息
 * @param {*} req
 * @returns
 */
export function rechargelogs(params, reqData) {
  return request.post(
    '/vod-protal/payment/rechargelog',
    {
      params: params,
      data: reqData
    },
    { noAuth: false, pType: 'com' }
  )
}

/**
 * 分页查询提款信息
 * @param {*} req
 * @returns
 */
export function withdrawlogs(params, reqData) {
  return request.post(
    '/vod-protal/payment/withdrawlog',
    {
      params: params,
      data: reqData
    },
    { noAuth: false, pType: 'com' }
  )
}

/**
 * 分页查询在途保证金信息
 * @param {*} req
 * @returns
 */
export function suretyCashlogs(params, reqData) {
  return request.post(
    '/vod-protal/payment/suretyLog',
    {
      params: params,
      data: reqData
    },
    { noAuth: false, pType: 'com' }
  )
}

/**
 * 分页查询在途金额信息
 * @param {*} req
 * @returns
 */
export function onWaylogs(params, reqData) {
  return request.post(
    '/vod-protal/payment/onWaylog',
    {
      params: params,
      data: reqData
    },
    { noAuth: false, pType: 'com' }
  )
}
