import { batchUploadForIsu, removeFileForIsu } from '@/api/foss'

/**
 * 表单上传文件处理模块
 */
export default {
    data() {
        return {
            /** 上传文件数据 */
            attrType: 'image', // 附件类型 none|image|video|file

            // 图片文件上传对象
            upImg: {
                maxNum: 3, // 最大上传数
                num: 0, // 已有文件数
                tempFiles: [], // 未上传临时文件
                upFiles: [], // 已提交文件
                files: [], // 所有
                keyMap: {} // key值对应file
            },

            // 视频文件上传对象
            upVideo: {
                maxNum: 1, // 最大上传数
                num: 0, // 已有文件数
                tempFiles: [], // 未上传临时文件
                upFiles: [], // 已提交文件
                files: [], // 所有
                keyMap: {} // key值对应file
            },

            // 非多媒体文件上传对象
            upFile: {
                maxNum: 0, // 最大上传数
                num: 0, // 已有文件数
                tempFiles: [], // 未上传临时文件
                upFiles: [], // 已提交文件
                files: [], // 所有
                keyMap: {} // key值对应file
            },
        }
    },
    methods: {
        /**文件上传部分********************* */
        initUploadForm() {

        },

        /**
         * 选择上传文件
         */
        chooseUpload() {
            var _that = this
            if (_that.attrType === 'image') {
                _that.chooseImage()
            } else if (_that.attrType === 'video') {
                _that.chooseVideo()
            } else if (_that.attrType === 'file') {
                _that.chooseFile()
            }
        },

        /**
         * 选择图片上传
         * fKey: 上传文件key值
         */
        chooseImage(fKey) {
            const _that = this
            const upImg = _that.upImg
            let maxImgSize = 1000
            if (_that.dispRule.max_upload_img_size) {
                maxImgSize = Number(_that.dispRule.max_upload_img_size)
            }
            uni.chooseImage({
                count: fKey ? 1 : upImg.maxNum - upImg.num, // 一次最多上传文件图片数(指定fkey时则明确只接受唯一图片)
                sizeType: ['original', 'compressed'], // 是否压缩所选文件
                sourceType: ['album', 'camera'], // 来源是相册还是相机，默认二者都有
                success: function (res) {
                    if (res.errMsg === 'chooseImage:ok') {
                        const tempFiles = res.tempFiles
                        let tmpF = []
                        let isLimtSize = false
                        if (Array.isArray(tempFiles)) {
                            tempFiles.forEach((item, idx) => {
                                if (item.size <= 1024 * maxImgSize) {
                                    tmpF.push({
                                        size: item.size,
                                        path: item.path,
                                        type: 'img',
                                        isTmp: true
                                    })
                                } else {
                                    isLimtSize = true
                                }
                            })

                            if (tmpF.length > 0) {
                                if (fKey) {
                                    // 存在fkey,替换文件
                                    const tfIdx = upImg.tempFiles.findIndex((el) => el.key && el.key === fKey)
                                    if (tfIdx > -1) {
                                        upImg.tempFiles[tfIdx] = { key: fKey, ...tmpF[0] }
                                    } else {
                                        upImg.tempFiles.push({ key: fKey, ...tmpF[0] })
                                    }
                                } else {
                                    upImg.tempFiles = [...upImg.tempFiles, ...tmpF]
                                }
                            }

                            upImg.files = [...upImg.upFiles, ...upImg.tempFiles]
                            upImg.files.forEach((el, idx) => {
                                if (!el.key) {
                                    el.key = 'img_' + idx
                                }
                                el.seqNo = idx + 1
                                // 组合key对应file的map
                                upImg.keyMap[el.key] = el
                            })

                            upImg.num = upImg.files.length // 计算已选图片数
                        }
                        if (isLimtSize) {
                            _that.$uniUtil.error(`图片不能超过${maxImgSize}k`)
                        }
                    }
                },
                fail: function (err) {
                    console.log(err)
                },
                complete: function (e) { }
            })
        },

        /**
         * 选择视频上传
         */
        chooseVideo() {
            const _that = this
            const upVideo = _that.upVideo
            uni.chooseVideo({
                count: upVideo.maxNum - upVideo.num, // 一次最多上传文件图片数
                sizeType: ['original', 'compressed'], // 是否压缩所选文件
                sourceType: ['album', 'camera'], // 来源是相册还是相机，默认二者都有
                maxDuration: 10, // 拍摄视频最长拍摄时间，单位秒
                success: function (res) {
                    if (res.errMsg === 'chooseImage:ok') {
                    }
                },
                fail: function (err) { },
                complete: function (e) { }
            })
        },

        /**
         * 选择非多媒体文件上传
         * exts: 限定的扩展名数组
         */
        chooseFile(exts) {
            const _that = this
            const upFile = _that.upFile
            uni.chooseFile({
                count: upFile.maxNum - upFile.num, // 一次最多上传文件图片数
                extension: exts, // 根据文件拓展名过滤
                success: function (res) { },
                fail: function (err) { },
                complete: function (e) { }
            })
        },

        /**
         * 图片预览
         * @param {*} idx
         */
        previewImage(idx, fkey) {
            const _that = this
            const upImg = _that.upImg

            let delIdx = idx
            if (!delIdx && fkey) {
                delIdx = upImg.files.findIndex((el) => el.key === fkey)
            }
            const urlList = upImg.files.map((item) => {
                if (item.url) {
                    // 转成绝对地址
                    if (_that.$util.startWith(item.url, 'f/')) {
                        item.url = _that.locIsuPreUrl + item.url
                    }
                    return item.url
                }
            })
            uni.previewImage({
                current: delIdx, // 当前显示图片的http链接
                urls: urlList // 需要预览的图片http链接列表
            })
        },

        /**
         * 删除图片
         * @param {*} idx
         */
        delImage(idx, fkey) {
            const _that = this
            const upImg = _that.upImg
            let delIdx = idx
            if (!delIdx && fkey) {
                delIdx = upImg.files.findIndex((el) => el.key === fkey)
            }
            const img = upImg.files[delIdx]

            if (img.isTmp) {
                upImg.files.splice(delIdx, 1)
                upImg.tempFiles = upImg.tempFiles.filter((item) => item.key !== img.key)
                upImg.num = upImg.files.length
                delete upImg.keyMap[img.key]
            } else {
                upImg.files.splice(delIdx, 1)
                upImg.upFiles = upImg.upFiles.filter((item) => item.key !== img.key)
                upImg.num = upImg.files.length
                delete upImg.keyMap[img.key]
            }
        },

        delVideo(idx) {
            const _that = this
            const upVideo = _that.upVideo
            const f = upVideo.files[idx]

            if (f.isTmp) {
                upVideo.files.splice(idx, 1)
                upVideo.tempFiles = upImg.tempFiles.filter((item) => item.url === img.url)
                upVideo.num = upVideo.files.length
            } else {
                upVideo.files.splice(idx, 1)
                upVideo.upFiles = upVideo.upFiles.filter((item) => item.url !== img.url)
                upVideo.num = upVideo.files.length
            }
        },

        /**
         * 上传文件
         * @returns
         */
        fileUpload: function (uploadFormData) {
            const _that = this
            const upImg = _that.upImg
            const upVideo = _that.upVideo
            const upFile = _that.upFile
            return new Promise((resove, reject) => {
                // 挑选临时文件上传
                let uploadList = [] // 已上传过的文件
                let tmpList = [] // 未上传的文件

                if (upImg.files.length > 0) {
                    upImg.files.forEach((item, idx) => {
                        if (item.isTmp) {
                            tmpList.push(item)
                        } else {
                            uploadList.push(item)
                        }
                    })
                }
                if (upVideo.files.length > 0) {
                    upVideo.files.forEach((item, idx) => {
                        if (item.isTmp) {
                            tmpList.push(item)
                        } else {
                            uploadList.push(item)
                        }
                    })
                }
                if (upFile.files.length > 0) {
                    upFile.files.forEach((item, idx) => {
                        if (item.isTmp) {
                            tmpList.push(item)
                        } else {
                            uploadList.push(item)
                        }
                    })
                }

                // 所有临时文件上传
                if (tmpList.length > 0) {
                    batchUploadForIsu(tmpList, uploadFormData)
                        .then((files) => {
                            if (files && Array.isArray(files) && files.length > 0) {
                                files.forEach((item, idx) => {
                                    const { path, ...f1 } = { ...item }

                                    f1.isTmp = false
                                    uploadList.push(f1)

                                    // 上传后的文件临时属性置为false
                                    if (upImg.files.length > 0) {
                                        const imgFile = upImg.files.find((el) => el.key === f1.key)
                                        if (imgFile) {
                                            imgFile.isTmp = false
                                        }
                                    }
                                    if (upVideo.files.length > 0) {
                                        const videoFile = upVideo.files.find((el) => el.key === f1.key)
                                        if (videoFile) {
                                            videoFile.isTmp = false
                                        }
                                    }
                                    if (upFile.files.length > 0) {
                                        const fFile = upFile.files.find((el) => el.key === f1.key)
                                        if (fFile) {
                                            fFile.isTmp = false
                                        }
                                    }
                                })
                            }
                            resove(uploadList)
                        })
                        .catch(() => {
                            reject()
                        })
                } else {
                    // 当前不需要新上传文件，直接返回已上传列表
                    resove(uploadList)
                }
            })
        },

        picUrl(url, path) {
            const _that = this
            if (url) {
                // 转成绝对地址
                if (_that.$util.startWith(url, 'f/')) {
                    return _that.locIsuPreUrl + url
                } else {
                    return url
                }
            } else {
                return path
            }
        }

    }
}