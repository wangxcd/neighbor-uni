/*
 * 信息响应处理api
 */
import request from '@/utils/request'

/**
 * 找临时帮手信息更改专有字段值
 * @param {*} req
 * @returns
 */
export function zlsbsUpdSpecl(req) {
  return request.post('/vod-protal/isu/zlsbs/form/updSpecl', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 找临时帮手信息:申请参与
 * @param {*} req
 * @returns
 */
export function zlsbsJoinApply(req) {
  return request.post('/vod-protal/isu/zlsbs/form/joinApply', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 找临时帮手信息:乙方申请参与甲方帮工任务预提交
 * @param {*} req
 * @returns
 */
export function zlsbsPreJoinApply(req) {
  return request.post('/vod-protal/isu/zlsbs/form/preJoinApply', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 找临时帮手信息:取消参与申请
 * @param {*} req
 * @returns
 */
export function zlsbsCancelApply(req) {
  return request.post('/vod-protal/isu/zlsbs/form/cancelApply', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 找临时帮手:参与申请列表
 * 无需身份认证
 * @param {*} req
 * @returns
 */
export function zlsbsJoinList(req) {
  return request.post('/vod-protal/isu/zlsbs/query/joinList', { data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 找临时帮手:信息浏览内容
 * 无需身份认证
 * @param {*} req
 * @returns
 */
export function zlsbsIsuInfoView(req) {
  return request.post('/vod-protal/isu/zlsbs/query/infoView', { data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 找临时帮手:信息流及参与状态
 * 无需身份认证
 * @param {*} req
 * @returns
 */
export function zlsbsJoinStat(req) {
  return request.post('/vod-protal/isu/zlsbs/query/joinStat', { data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 找临时帮手:更改赏金额度
 * @param {*} req
 * @returns
 */
export function zlsbsUpdReward(req) {
  return request.post('/vod-protal/isu/zlsbs/form/updReward', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 找临时帮手信息:甲方接受乙方参与申请
 * @param {*} req
 * @returns
 */
export function zlsbsAAcptJoin(req) {
  return request.post('/vod-protal/isu/zlsbs/form/acptJoin', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 找临时帮手信息--甲方完成参与申请接受
 * @param {*} req
 * @returns
 */
export function zlsbsAAcptOk(req) {
  return request.post('/vod-protal/isu/zlsbs/form/acptOk', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 找临时帮手信息--甲方招工完成预提交
 * @param {*} req
 * @returns
 */
export function zlsbsAPreAcptOk(req) {
  return request.post('/vod-protal/isu/zlsbs/form/preAcptOk', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 找临时帮手信息--甲方取消帮工任务计划
 * @param {*} req
 * @returns
 */
export function zlsbsATaskPull(req) {
  return request.post('/vod-protal/isu/zlsbs/form/taskPull', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 找临时帮手信息--乙方到岗签到
 * @param {*} req
 * @returns
 */
export function zlsbsBArvSignIn(req) {
  return request.post('/vod-protal/isu/zlsbs/form/arvSign', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 找临时帮手信息--甲方确认乙方的到岗情况
 * @param {*} req
 * @returns
 */
export function zlsbsACfrmBSignIn(req) {
  return request.post('/vod-protal/isu/zlsbs/form/cfrmSign', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 找临时帮手信息--甲方确认完成帮工任务计划
 * @param {*} req
 * @returns
 */
export function zlsbsATaskFinish(req) {
  return request.post('/vod-protal/isu/zlsbs/form/taskFinish', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 找临时帮手信息--甲方评分乙方的任务完成度
 * @param {*} req
 * @returns
 */
export function zlsbsAScoreBDone(req) {
  return request.post('/vod-protal/isu/zlsbs/form/scoreDone', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 代办跑腿信息更改专有字段值
 * @param {*} req
 * @returns
 */
export function agentUpdSpecl(req) {
  return request.post('/vod-protal/isu/agent/form/updSpecl', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 代办跑腿信息:甲方发布后处理逻辑
 * @param {*} req
 * @returns
 */
export function agentAPaidAfter(req) {
  return request.post('/vod-protal/isu/agent/form/aPayAfter', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 代办跑腿信息更改赏金额度
 * @param {*} req
 * @returns
 */
export function agentUpdReward(req) {
  return request.post('/vod-protal/isu/agent/form/updReward', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 代办跑腿:信息流及参与状态
 * 无需身份认证
 * @param {*} req
 * @returns
 */
export function agentJoinStat(req) {
  return request.post('/vod-protal/isu/agent/query/joinStat', { data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 代办跑腿:甲方取消代办任务计划
 * @param {*} req
 * @returns
 */
export function agentATaskPull(req) {
  return request.post('/vod-protal/isu/agent/form/taskPull', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 代办跑腿:乙方接单
 * @param {*} req
 * @returns
 */
export function agentJoinApply(req) {
  return request.post('/vod-protal/isu/agent/form/joinApply', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 代办跑腿:乙方接单预提交
 * @param {*} req
 * @returns
 */
export function agentPreJoinApply(req) {
  return request.post('/vod-protal/isu/agent/form/preJoinApply', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 代办跑腿:乙方申请接单取消
 * @param {*} req
 * @returns
 */
export function agentBCancelApply(req) {
  return request.post('/vod-protal/isu/agent/form/bAplCancel', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 代办跑腿:甲方拒绝乙方接单取消
 * @param {*} req
 * @returns
 */
export function agentA2bCancelRefuse(req) {
  return request.post('/vod-protal/isu/agent/form/a2bCancelNo', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 代办跑腿:乙方取消接单
 * @param {*} req
 * @returns
 */
export function agentA2bCancelAgree(req) {
  return request.post('/vod-protal/isu/agent/form/a2bCancelYes', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 代办跑腿:乙方强行取消接单
 * @param {*} req
 * @returns
 */
export function agentBCancelStick(req) {
  return request.post('/vod-protal/isu/agent/form/bStickCancel', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 代办跑腿:乙方完成任务
 * @param {*} req
 * @returns
 */
export function agentBFinishJoinTask(req) {
  return request.post('/vod-protal/isu/agent/form/bFinish', { data: req }, { noAuth: false, pType: 'isu' })
}

/**
 * 代办跑腿:甲方确认乙方代办任务完成
 * @param {*} req
 * @returns
 */
export function agentA2bFinishTask(req) {
  return request.post('/vod-protal/isu/agent/form/a2bFinish', { data: req }, { noAuth: false, pType: 'isu' })
}
