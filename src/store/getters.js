import keys from '@/config/keys'

export default {
  sysInfo(state) {
    return state.app.sysInfo
  },
  lociTude(state) {
    return state.app.lociTude
  },
  localArea(state) {
    return state.app.localArea
  },
  locIsuPreUrl(state) {
    return state.app.locIsuServer.preUrl
  },
  token(state) {
    if (state.user.token) {
      return state.user.token
    }
    return undefined
  },
  userInfo(state) {
    return state.user.userInfo
  },
  uid(state) {
    return state.user.uid
  }
}
