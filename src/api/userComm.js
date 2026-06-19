import request from '@/utils/request'

/*
 * 获得用户常居生活区
 * @param {*} req
 * @returns
 */
export function getUserLiveComm(req) {
  return request.post(`/vod-protal/userComm/getLives`, { data: req }, { noAuth: false, pType: 'isu' })
}

/*
 * 添加用户常居生活区
 * @param {*} req
 * @returns
 */
export function addUserLiveComm(req) {
  return request.post(`/vod-protal/userComm/addLive`, { data: req }, { noAuth: false, pType: 'isu' })
}

/*
 * 删除用户常居生活区
 * @param {*} req
 * @returns
 */
export function removeUserLiveComm(req) {
  return request.post(`/vod-protal/userComm/removeLive`, { data: req }, { noAuth: false, pType: 'isu' })
}

/*
 * 设为用户城市内主常居生活区
 * @param {*} req
 * @returns
 */
export function setMainUserLiveComm(req) {
  return request.post(`/vod-protal/userComm/setMainLive`, { data: req }, { noAuth: false, pType: 'isu' })
}

/*
 * 设置生活区住所位置
 * @param {*} req
 * @returns
 */
export function setUserLiveRoom(req) {
  return request.post(`/vod-protal/userComm/setLiveRoom`, { data: req }, { noAuth: false, pType: 'isu' })
}

/*
 * 获得用户关注生活区
 * @param {*} req
 * @returns
 */
export function getUserCareComm(req) {
  return request.post(`/vod-protal/userComm/getCares`, { data: req }, { noAuth: false, pType: 'isu' })
}

/*
 * 添加用户关注生活区
 * @param {*} req
 * @returns
 */
export function addUserCareComm(req) {
  return request.post(`/vod-protal/userComm/addCare`, { data: req }, { noAuth: false, pType: 'isu' })
}

/*
 * 删除用户关注生活区
 * @param {*} req
 * @returns
 */
export function removeUserCareComm(req) {
  return request.post(`/vod-protal/userComm/removeCare`, { data: req }, { noAuth: false, pType: 'isu' })
}

/*
 * 获取用户在生活区中的角色
 * @param {*} req
 * @returns
 */
export function getUserCommRole(req) {
  return request.post(`/vod-protal/userComm/getRole`, { data: req }, { noAuth: false, pType: 'isu' })
}

/*
 * 获取用户在生活区中的角色
 * @param {*} req
 * @returns
 */
export function getAllApprove() {
  return request.get(`/vod-protal/user/todo/allApprove`, {}, { noAuth: false, pType: 'isu' })
}
