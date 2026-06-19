export default {
    issue: {
        // 信息状态
        infoStatus: {
            SAVE: 0, // 已保存
            APPLY: 1, // 已提交
            AUDIT_ING: 2, // 待审核
            AUDIT_COMP: 3, // 已审核
            PUSH: 4, // 已发布
            PULL: 5, // 已下架
            FINISH: 6, // 已完成
            SETTLE_DONE: 8, // 已结清
            EXPIRE: 9 // 已过期
        },

        // 审核状态
        auditStatus: {
            WAIT: 0, // 待审核
            PASS: 1, // 人工审核通过
            REFUSE: 2, // 人工审核拒绝
            API_PASS: 3, // api审核通过
            API_REFUSE: 4 // api审核拒绝
        },

        // 用帮工进行状态：0: 招工发布准备/1: 正常招工/2-暂停招工/3-取消招工/4-完成招工/5-签到中/6-任务进行中/7-任务结束
        labourTaskRunStatus: {
            BEFORE: 0,
            ZG_ING: 1,
            ZG_PAUSE: 2,
            ZG_CANCEL: 3,
            ZG_OK: 4,
            TASK_SIGN: 5,
            TASK_RUNING: 6,
            TASK_FINISH: 7
        },

        // 代办任务进行状态：0:任务发布准备/1-正常接单中/2-暂停接单(甲方)/3-任务取消(甲方)/4-已存在接单/5-已全部接单/6-接单全部完成(乙方)/7-接单全部确认完成(甲方)
        agentTaskRunStatus: {
            BEFORE: 0,
            NONE_JOIN: 1,
            PAUSE: 2,
            CANCEL: 3,
            HAS_JOIN: 4,
            MAX_JOIN: 5,
            TASK_FINISH: 6,
            TASK_OK: 7
        }
    }


}