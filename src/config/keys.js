/*
 * @Description: 定义相关键值
 * @Author: wangxcd
 * @Email: 17236423@qq.com
 * @Date: 2024-02-11 23:36:42
 * @LastEditors: wangxcd
 * @LastEditTime: 2024-02-11 23:36:42
 */
import website from './website'

const keys = {
  LANGUAGE_KEY: 'languageKey',
  SIZE_KEY: 'sizeKey',
  AES_KEY: 'ase-key',

  IS_AUTO_LOGIN: website.key + 'is_autologin', // 是否自动登录
  TOKEN_KEY: website.key + 'token',
  ACCESS_TOKEN: website.key + 'accessToken',
  REFERSH_TOKEN: website.key + 'refreshToken',
  EXPIRES_TIME: website.key + 'expires-time', //token 过期时间
  USER_INFO: website.key + 'userinfo',
  UID: website.key + 'user_id',
  SYS_INFO: website.key + 'sys_info', // 前端设备信息
  LOCAL_TUDE: website.key + 'local_itude',
  LOCAL_AREA: website.key + 'local_area',
  LOCAL_COMM: website.key + 'local_comm',
  LIVE_COMMS: website.key + 'user_live_comms',
  ISU_CATE_LIST: website.key + 'isu_cate_list',
  LOCAL_SERVER: website.key + 'local_server',
  SYS_CONFIG: website.key + 'sys_config', // 后端系统配置

  //微信授权状态
  WX_AUTH_STATE: 'wx_authorize_state',
  // 小程序授权状态
  MP_AUTH_STATE: 'mp_authorize_state',

  //登录回调地址
  BACK_URL: 'login_back_url'
}

export default keys
