/*
 * 信息查询接口
 */
import request from '@/utils/request'

/**
 * 分页查询邻间互动信息
 * @param {*} req
 * @returns
 */
export function ljhdPageInfo(params, reqData) {
  return request.post(
    '/vod-protal/isu/query/ljhd/pageInfo',
    {
      params: params,
      data: reqData
    },
    { noAuth: true, pType: 'isu' }
  )
}

/**
 * 分页查询邻间互动信息
 * @param {*} req
 * @returns
 */
export function ljhdIsuInfo(reqData) {
  return request.post(
    '/vod-protal/isu/query/ljhd/isuInfo',
    {
      data: reqData
    },
    { noAuth: true, pType: 'isu' }
  )
}

/**
 * 分页查询邻间互动的评论信息
 * @param {*} req
 * @returns
 */
export function ljhdPageComReplys(params, reqData) {
  return request.post(
    '/vod-protal/isu/query/ljhd/pageComReplys',
    {
      params: params,
      data: reqData
    },
    { noAuth: true, pType: 'isu' }
  )
}

/**
 * 获取邻间互动的评论信息
 * @param {*} req
 * @returns
 */
export function ljhdCommReply(reqData) {
  return request.post(
    '/vod-protal/isu/query/ljhd/commReply',
    {
      data: reqData
    },
    { noAuth: true, pType: 'isu' }
  )
}

/**
 * 邻间互动-分页获取评论的回复信息
 * @param {*} req
 * @returns
 */
export function ljhdPageReplys(params, reqData) {
  return request.post(
    '/vod-protal/isu/query/ljhd/pageReplys',
    {
      params: params,
      data: reqData
    },
    { noAuth: true, pType: 'isu' }
  )
}

/**
 * 信息阅读统计
 * @param {*} req
 * @returns
 */
export function isuReadCount(req) {
  return request.post('/vod-protal/isu/query/ljhd/readCount', { data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 获取信息的各类响应数统计
 * @param {*} req
 * @returns
 */
export function isuReplyCount(req) {
  return request.post('/vod-protal/isu/query/ljhd/replyCount', { data: req }, { noAuth: true, pType: 'isu' })
}

/**
 * 分页查询信息
 * @param {*} req
 * @returns
 */
export function isuPageList(params, reqData) {
  return request.post(
    '/vod-protal/isu/query/pageList',
    {
      params: params,
      data: reqData
    },
    { noAuth: true, pType: 'isu' }
  )
}

/**
 * 获取原信息
 * @param {*} req
 * @returns
 */
export function isuOrginInfo(reqData) {
  return request.post(
    '/vod-protal/isu/query/isuOrgin',
    {
      data: reqData
    },
    { noAuth: true, pType: 'isu' }
  )
}

/**
 * 信息详情
 * @param {*} req
 * @returns
 */
export function isuDetail(reqData) {
  return request.post(
    '/vod-protal/isu/query/detail',
    {
      data: reqData
    },
    { noAuth: true, pType: 'isu' }
  )
}

/**
 * 最新发布信息
 * @param {*} req
 * @returns
 */
export function isuRecentList(reqData) {
  return request.post(
    '/vod-protal/isu/query/recentList',
    {
      data: reqData
    },
    { noAuth: true, pType: 'isu' }
  )
}

/**
 * 社区开开店分页查询信息
 * @param {*} req
 * @returns
 */
export function sqkdList(params, reqData) {
  return request.post(
    '/vod-protal/isu/query/sqkdList',
    {
      params: params,
      data: reqData
    },
    { noAuth: true, pType: 'isu' }
  )
}

/**
 * 政府或物业发布的信息
 * @param {*} req
 * @returns
 */
export function zfwyList(reqData) {
  return request.post(
    '/vod-protal/isu/query/zfwyList',
    {
      data: reqData
    },
    { noAuth: true, pType: 'isu' }
  )
}

/**
 * 我发布信息
 * @param {*} req
 * @returns
 */
export function isuMyList(params, reqData) {
  return request.post(
    '/vod-protal/isu/query/myIsuList',
    {
      params: params,
      data: reqData
    },
    { noAuth: true, pType: 'isu' }
  )
}

/**
 * 我发布信息
 * @param {*} req
 * @returns
 */
export function isuMyJoinList(params, reqData) {
  return request.post(
    '/vod-protal/isu/query/myJoinIsuList',
    {
      params: params,
      data: reqData
    },
    { noAuth: true, pType: 'isu' }
  )
}
