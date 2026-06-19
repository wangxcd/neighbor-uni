import request from '@/utils/request'

/**
 * 查询用户当前地区服务信息
 * @param {*} req
 * @returns
 */
export function getLocalArea(req) {
  return request.post('/vod-protal/locCity/area', { data: req }, { noAuth: true })
}

/**
 * 查询用户当前地理位置经纬度所处行政区域
 * @param {*} req
 * @returns
 */
export function getLocalAreByLatng(req) {
  return request.post('/vod-protal/locCity/area/byLatng', { data: req }, { noAuth: true })
}

/**
 * 查询区县或城市信息
 * @param {*} params
 * @returns
 */
export function getLocalAdAndCity(params) {
  return request.get(`/vod-protal/locCity/area/${params.cityCode}/${params.adCode}`, {}, { noAuth: true })
}

/**
 * 获取所有城市列表
 * @returns
 */
export function getAllCitys() {
  return request.get('/vod-protal/locCity/allCitys', {}, { noAuth: true })
}

/**
 * 获取所有开通业务的城市列表
 * @returns
 */
export function getAllOpenCitys() {
  return request.get('/vod-protal/locCity/openCitys', {}, { noAuth: true })
}

/**
 * 计算经纬度间距离
 * @param {*} req
 * @returns
 */
export function calcLatudDistince(req) {
  return request.post('/vod-protal/locCity/calcDist', { data: req }, { noAuth: true })
}

/**
 * 获取城市的所有区县及乡镇区域
 * @param {*} req
 * @returns
 */
export function getCityTownLev(cityCode) {
  return request.get(`/vod-protal/locDist/distLev/${cityCode}`, {}, { noAuth: true })
}

/**
 * 获取街道乡镇及上级行政区信息
 * @param {*} req
 * @returns
 */
export function gettownUpsDist(params) {
  const url = `/vod-protal/locDist/dist/townUps/${params.adCode}/${params.townCode}`
  return request.get(url, {}, { noAuth: true })
}

/**
 * 获取生活区信息
 * @param {*} req
 * @returns
 */
export function getCommById(params) {
  return request.get(`/vod-protal/locComm/byId/${params.commId}`, {}, { noAuth: true, pType: 'isu' })
}

/**
 * 获取街道乡镇区域内的小区信息
 * @param {*} req
 * @returns
 */
export function getCommListOfTown(params, req) {
  return request.post(`/vod-protal/locComm/listOfTown`, { params: params, data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 按名称筛选城市内的小区信息
 * @param {*} req
 * @returns
 */
export function filterCommOfCity(params, req) {
  return request.post(`/vod-protal/locComm/filterOfCity`, { params: params, data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 地图获取添加附近小区信息
 * @param {*} req
 * @returns
 */
export function getMapComm(req) {
  return request.post(`/vod-protal/locComm/addMapComm`, { data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 地图获取添加附近小区信息
 * @param {*} req
 * @returns
 */
export function mapLocComm(req) {
  return request.post(`/vod-protal/locComm/mapLocComm`, { data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 根据地理位置经纬度查询周边范围的社区
 * @param {*} req
 * @returns
 */
export function nearsByItude(req) {
  return request.post(`/vod-protal/locComm/nearsByPos`, { data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 获取生活区周边的临近生活区
 * @param {*} req
 * @returns
 */
export function getNearsByComm(req) {
  return request.post(`/vod-protal/locComm/listNears`, { data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 获取小区物业信息
 * @param {*} req
 * @returns
 */
export function getCommEstateInfo(req) {
  return request.post(`/vod-protal/locComm/estate/info`, { data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 登记小区物业信息
 * @param {*} req
 * @returns
 */
export function regCommEstate(req) {
  return request.post(`/vod-protal/locComm/estate/reg`, { data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 审批小区物业信息登记
 * @param {*} req
 * @returns
 */
export function approveCommEstate(req) {
  return request.post(`/vod-protal/locComm/estate/approve`, { data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 物业成员加入
 * @param {*} req
 * @returns
 */
export function estateMembJoin(req) {
  return request.post(`/vod-protal/locComm/estate/membJoin`, { data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 物业管理员同意成员加入
 * @param {*} req
 * @returns
 */
export function estateAgreeMemb(req) {
  return request.post(`/vod-protal/locComm/estate/agreeMemb`, { data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 物业管理员拒绝成员加入
 * @param {*} req
 * @returns
 */
export function estateRefuseMemb(req) {
  return request.post(`/vod-protal/locComm/estate/refuseMemb`, { data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 转让物业管理员角色
 * @param {*} req
 * @returns
 */
export function estateTransAdmin(req) {
  return request.post(`/vod-protal/locComm/estate/transAdmin`, { data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 物业管理员清退物业成员
 * @param {*} req
 * @returns
 */
export function estateWeedOutMemb(req) {
  return request.post(`/vod-protal/locComm/estate/weedOutMemb`, { data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 物业成员主动退出物业
 * @param {*} req
 * @returns
 */
export function estateExitMemb(req) {
  return request.post(`/vod-protal/locComm/estate/exitMemb`, { data: req }, { noAuth: true, pType: 'isu' })
}
