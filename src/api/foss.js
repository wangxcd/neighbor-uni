/*
 * 文件处理请求对象
 */

import request from '@/utils/request'

/**
 * 通用服务文件批量上传
 * @param {*} req
 * @returns
 */
export function batchUploadForCom(files, formData) {
  return request.upload.fileBatchUpload(files, formData, { pType: 'com' })
}

/**
 * 信息发布服务文件批量上传
 * @param {*} req
 * @returns
 */
export function batchUploadForIsu(files, formData) {
  return request.upload.fileBatchUpload(files, formData, { pType: 'isu' })
}

/**
 * 通用服务上传文件删除
 * @param {*} req
 * @returns
 */
export function removeFileForCom(req) {
  return request.post('/vod-protal/fos/remove', { data: req }, { noAuth: false, pType: 'com' })
}

/**
 * 信息发布服务上传文件删除
 * @param {*} req
 * @returns
 */
export function removeFileForIsu(req) {
  return request.post('/vod-protal/fos/remove', { data: req }, { noAuth: false, pType: 'isu' })
}
