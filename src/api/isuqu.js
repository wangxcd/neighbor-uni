/*
 * 信息查询类接口
 */
import request from '@/utils/request'

/**
 * 查询平台统一广告
 * @param {*} req
 * @returns
 */
export function getSysAdvert(req) {
  return request.get('/vod-protal/isu/qu/advert/list', {}, { noAuth: true })
}

/**
 * 查询小区专属广告
 * @param {*} req
 * @returns
 */
export function getCommAdvert(req) {
  return request.post(`/vod-protal/isu/qu/advert/listOfComm`, { data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 得到所有发布类目及子类目
 * @param {*} req
 * @returns
 */
export function getIsuCateLevs() {
  return request.get('/vod-protal/isu/qu/cate/isuLevs', {}, { noAuth: true })
}

/**
 * 得到指定一级类目及子类目
 * @param {*} req
 * @returns
 */
export function getIsuCateLevsByPar(mCateName) {
  return request.get(`/vod-protal/isu/qu/cate/isuLevs/${mCateName}`, {}, { noAuth: true })
}

/**
 * 得到所有发布类目
 * @param {*} req
 * @returns
 */
export function getIsuCateAll() {
  return request.get('/vod-protal/isu/qu/cate/isuAll', {}, { noAuth: true })
}

/**
 * 得到所有信息展示的一级类目
 * @param {*} req
 * @returns
 */
export function getIsuCateViews() {
  return request.get('/vod-protal/isu/qu/cate/isuViews', {}, { noAuth: true })
}
