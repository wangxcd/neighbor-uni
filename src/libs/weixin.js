class WeixinApi {
    constructor() { }

    isAndroid() {
        let u = navigator.userAgent
        return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
    }

    /**
     * 调起订阅界面
     * array tmplIds 模板id
     */
    subscribe(tmplIds) {
        return new Promise((reslove, reject) => {
            uni.requestSubscribeMessage({
                tmplIds: tmplIds,
                success(res) {
                    return reslove(res);
                },
                fail(err) {
                    return reject(err);
                }
            })
        });
    }
}

export default new WeixinApi()