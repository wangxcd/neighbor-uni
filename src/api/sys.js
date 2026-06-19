import request from '@/utils/request'

export default {
  /**
   * 客户IP信息
   */
  getIpInfo: function () {
    return request.get('/vod-protal/location/ipInfo', {}, { noAuth: false })
  },

  /**
   * 获取项目系统信息
   * @returns
   */
  getSysInfo: function () {
    return request.post(
      '/vod-protal/sys/sysInfo',
      {
        contentType: 'text/plain',
        data: 'vod-douyin'
      },
      { noAuth: true }
    )
  },

  /**
   * 获取当前平台通知、公告列表
   * @param {*} id
   * @returns
   */
  getNoticeList: function () {
    return request.get(`/vod-protal/sys/article/noticeList`, {}, { noAuth: true })
  },

  /**
   * 获取系统文本
   * @param {*} id
   * @returns
   */
  getSysArticle: function (id) {
    return request.get(`/vod-protal/sys/article/${id}`, {}, { noAuth: true })
  },

  /**
 * 获取系统配置参数
 * @param {*} id
 * @returns
 */
  getSysCfgParms: function () {
    return request.get(`/vod-protal/sys/cfg/parms`, {}, { noAuth: true })
  }
}
