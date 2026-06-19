export default {
    data() {
        return {
            // 支付处理相关
            payChannelAry: [
                {
                    name: '余额支付',
                    icon: 'icon-yue',
                    value: 'yue',
                    title: '可用余额:',
                    lastAmount: 0, // 可用余额
                    prior: 2 // 余额优先
                },
                {
                    name: '微信支付',
                    icon: 'icon-weixin1',
                    value: 'WRoutine', // 此处为微信小程序支付
                    title: '微信快捷支付',
                    lastAmount: -1,
                    prior: 3
                }
            ],

            // 可使用消费券抵扣金额
            canUseCouponAmount: 0,

            pay: {
                show: false,
                orderNo: '',
                totalFee: 0.0,
                payChannel: '',
                attach: {
                    editType: 'new',
                    serutyAmount: 0.0
                },
                // 支付结果定时查询器
                payResInterval: null
            }
        }
    },
    methods: {
        /**
         * 打开支付组件
         *
         */
        goPay(orderNo, feeAmount, canUseCouponAmount, attach) {
            this.pay.show = true
            this.pay.orderNo = orderNo
            this.pay.totalFee = feeAmount

            if (attach) {
                this.pay.attach = attach
            }

            if (canUseCouponAmount) {
                this.canUseCouponAmount = canUseCouponAmount
            }

            const payOrder = {
                totalAmount: this.pay.totalFee,
                orderCode: this.pay.orderNo,
                attach: this.pay.attach
            }
            this.$refs.payPop.beforeOpen(true, payOrder)
        },

        closePayment(e) {
            let opt = e
            let action = opt.action || null
            let value = opt.value || null
            action && this[action] && this[action](value)
        },

        /**
         * 关闭支付组件
         *
         */
        payClose() {
            // this.pay.show = false
            this.$refs.payPop.close()
        },

        /**
         * 支付成功回调
         *
         */
        payComplete() {
            this.status = false
            this.page = 1
            this.$set(this, 'bargain', [])
            this.pay.show = false
            this.getBargainUserList()
        },

        /**
         * 支付失败回调
         *
         */
        payFail() {
            this.pay.show = false
        },

        /**
         * 调用微信支付
         */
        weixPay(orderNo, payAttach) {
        },

        /**
         * 后端余额支付处理
         * @param {*} orderNo
         * @param {*} cateId
         */
        yuePay(orderNo, payAttach) {
        },

        /**
         * 无需支付的订单处理(新建、重发时0费用也会有支付订单)
         * @param {*} orderNo
         * @param {*} payAttach: {cateId, isuId}
         */
        noPay(orderNo, payAttach) {
        }
    }
}