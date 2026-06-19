export default {
    data() {
        return {
            timeNo: -1, // 表单提交时间控制器编号

            // 模态框
            dialog: {
                show: false, // 显示
                title: '', // 标题
                content: ''
            },
        }
    },
    methods: {
        dialogShow(title, content) {
            this.dialog.show = true
            this.dialog.title = title
            this.dialog.content = content
        },

        /**
         * 表单输入计时
         */
        inputTiming() {
            const _that = this
            let timeNo = this.timeNo
            timeNo = setTimeout(function () {
                _that.dialogShow('', '你未能在90分钟内提交，预加载内容已失效，需退出本页面重新填写发布信息')
                //
            }, 1000 * 60 * 90)
            this.timeNo = timeNo
        }
    }
}