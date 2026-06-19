import request from '@/utils/request'

/**
 * 查询主页页面通用数据
 * @param {*} req
 * @returns
 */
export function getHomeIndex(req) {
  return request.get('/vod-protal/home/index', {}, { noAuth: true })
}

/**
 * 查询主页页面发布相关数据
 * @param {*} req
 * @returns
 */
export function getIsuHomeIndex(req) {
  return request.get('/vod-protal/home/index', {}, { noAuth: true, pType: 'isu' })
}
