/*
 * 保证金处理api
 */
import request from '@/utils/request'

export default {
    /**
     * 用户支付保证金：2.1-使用余额支付保证金
     * @param {*} req
     * @returns
     */
    suretyPayForYuePaid(req) {
        return request.post('/vod-protal/isu/surety/payForYue/paid', { data: req }, { noAuth: false })
    },

    /**
     * 用户支付保证金：2.1-使用余额支付保证金后回调处理
     * @param {*} req
     * @returns
     */
    suretyPayForYueNotify(req) {
        return request.post('/vod-protal/isu/surety/payForYue/notify', { data: req }, { noAuth: false })
    },

    /**
     * 用户支付保证金：5.21-使用微信支付保证金
     * @param {*} req
     * @returns
     */
    suretyPayForWxPaid(req) {
        return request.post('/vod-protal/isu/surety/payForWx/paid', { data: req }, { noAuth: false })
    },

    /**
     * 用户支付保证金：5.21-使用微信支付保证金支付结果
     * @param {*} req
     * @returns
     */
    suretyPayForWxPayRes(req) {
        return request.post('/vod-protal/isu/surety/payForWx/res', { data: req }, { noAuth: false })
    }
}