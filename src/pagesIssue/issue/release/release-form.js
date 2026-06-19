import { features } from 'process'
import { mapGetters } from 'vuex'
import { isEmpty, isNotEmpty } from '@/utils/validate'
import {
  isuInitFormData,
  isuFormPreOrder,
  isuFormCreate,
  isuFormEdit,
  isuFormOrderWxPay,
  isuOrderWxPayRes,
  isuFormOrderYue,
  isuFormOrderPayRes,
  isuFormOrderPaySucessBack
} from '@/api/isuForm'
import { batchUploadForIsu, removeFileForIsu } from '@/api/foss'
import { isuOrginInfo } from '@/api/isuQuery'
import { getUserAccount } from '@/api/user'
import { getIsuCateById } from '@/libs/isucate'

export default {
  data() {
    return {
      cateId: undefined, // 类目id
      infoCate: {
        cateTitle: '',
        releaseNoteList: []
      },
      parCate: {},
      editType: 'new', // 缺省为新建
      orgIsuId: undefined, // 参照信息ID
      orgFormData: undefined, // 原表单信息，信息编辑、重发、续发时需要

      contentPlaceHolder: '',

      timeNo: -1, // 表单提交时间控制器编号

      // 模态框
      dialog: {
        show: false, // 显示
        title: '', // 标题
        content: ''
      },

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

      // 信息发布价格方案
      isuPricePlan: {
        feeType: 'issue',
        isLadder: 0
      },

      isuCtrl: {
        usePrice: {} // 使用的价格方案
      },

      // 置顶价格方案
      topPricePlan: {
        feeType: 'top',
        isLadder: 0
      },

      // 置顶显示及操作控制
      topCtrl: {
        open: false,
        color: '#06a8ff',
        usePrice: {} // 使用的置顶价格方案
      },

      // 总发布费用
      fee: {
        issueFee: { price: 0.0, isCalc: false },
        topFee: { price: 0.0, isCalc: false },
        total: 0.0 // 总费用
      },

      // 表单显示规则
      dispRule: {},

      // 表单对象
      formData: {},

      // 动态表单对象
      fixDyFields: [], // 固定动态字段
      dyForms: [[], []], // 动态表单字段
      dyFormData: {},

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
  computed: {
    ...mapGetters({
      sysInfo: 'app/sysInfo',
      localArea: 'app/localArea',
      localComm: 'app/localComm',
      userInfo: 'user/userInfo',
      uid: 'user/uid',
      locIsuPreUrl: 'app/locIsuPreUrl'
    })
  },
  beforeDestroy() {
    const _that = this
    if (_that.pay.payResInterval) {
      clearInterval(_that.pay.payResInterval)
    }
  },
  methods: {
    // 页面onload
    pageOnLoad(e) {
      if (e.sCateId) {
        this.sCateId = Number(e.sCateId)
        this.cateId = this.sCateId

        this.editType = e.editType || 'new'
        if (e.orgIsuId) {
          this.orgIsuId = Number(e.orgIsuId)
        }
        this.initData()
      } else {
        this.$uniUtil.back(1)
      }
    },

    initData() { },

    /**
     * 页面表单初始化数据加载
     */
    formInit() {
      const _that = this
      getIsuCateById(this.cateId).then((r) => {
        this.infoCate = r

        if (isEmpty(r.contentPlaceHolder)) {
          this.contentPlaceHolder = '请输入内容描述(最多600字符)'
        } else {
          this.contentPlaceHolder = r.contentPlaceHolder + '(最多600字符)'
        }

        if (isNotEmpty(r.releaseNotes)) {
          this.infoCate.releaseNoteList = r.releaseNotes.split('<br>')
        }

        // 菜单类目
        getIsuCateById(r.parCateId).then((pr) => {
          _that.parCate = pr
        })
      })

      const req = {
        editType: this.editType,
        uid: this.uid,
        cateId: this.cateId,
        adCode: this.localComm.ad.distCode
      }
      isuInitFormData(req).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          const { dispRuleMap, dyBlockList, pricePlanMap, userCertifyList } = _res
          if (dispRuleMap) {
            let dispRule = { ...dispRuleMap, show_build_pos: 'Y' }
            // 所有位置相关规则都不显示
            if (dispRule.is_need_build_park != 'Y' && dispRule.is_need_build_no != 'Y' && dispRule.is_need_build_unit != 'Y' && dispRule.is_need_build_room != 'Y') {
              dispRule.show_pos = 'N'
            }

            _that.dispRule = dispRule
            if (dispRule.max_up_img_num) {
              _that.upImg.maxNum = Number(dispRule.max_up_img_num)
            }
            if (dispRule.max_up_video_num) {
              _that.upVideo.maxNum = Number(dispRule.max_up_video_num)
            }

            if (_that.upImg.maxNum > 0) {
              _that.attrType = 'image'
            } else if (_that.upVideo.maxNum > 0) {
              _that.attrType = 'video'
            } else {
              _that.attrType = 'none'
            }
          }

          if (pricePlanMap) {
            _that.isuPricePlan = pricePlanMap.issue
            _that.topPricePlan = pricePlanMap.top

            if (_that.isuPricePlan && _that.editType !== 'edit') {
              // 存在发布费用方案,但内容编辑时不需要计算发布费
              _that.putIssueFee(_that.isuPricePlan)
            }
          }

          if (_that.editType && ['edit', 'goOn', 'again'].includes(_that.editType)) {
            if (_that.orgIsuId) {
              isuOrginInfo({
                cateId: _that.cateId,
                isuId: _that.orgIsuId
              }).then((res2) => {
                if (res2.code === 0) {
                  const org = res2.data

                  // 原始信息
                  _that.orgFormData = {
                    isuId: org.isuId,
                    firstIsuId: org.firstIsuId,
                    referIsuId: org.referIsuId,
                    title: org.title,
                    content: org.content,
                    keyWords: org.keyWords,
                    contactMan: org.contactMan,
                    phone: org.phone,
                    buildPark: org.buildPark,
                    buildNo: org.buildNo,
                    buildUnit: org.buildUnit,
                    buildRoom: org.buildRoom,
                    isListTop: org.isListTop
                  }
                  if (isNotEmpty(org.dyFormData)) {
                    _that.orgFormData = { ..._that.orgFormData, ...org.dyFormData }
                  }

                  if (isNotEmpty(org.imgUrls)) {
                    const upImgs = JSON.parse(org.imgUrls)

                    _that.upImg.upFiles = upImgs.map((el) => {
                      el.isTmp = false
                      el.type = 'img'
                      return el
                    })
                    _that.upImg.files = [..._that.upImg.upFiles]
                    _that.upImg.files.forEach((el, idx) => {
                      // 组合key对应file的map
                      _that.upImg.keyMap[el.key] = el
                    })

                    _that.upImg.num = _that.upImg.files.length // 计算已选图片数
                  }
                  if (isNotEmpty(org.videoUrls)) {
                    const upVideos = JSON.parse(org.videoUrls)
                    _that.upVideo.files = upVideos.map((el) => {
                      el.isTmp = false
                      el.type = 'video'
                      return el
                    })
                  }

                  _that.formData = { ..._that.orgFormData }
                  if (['goOn', 'again'].includes(_that.editType)) {
                    // 本次参照
                    _that.formData.referIsuId = _that.orgIsuId
                    if (!_that.formData.firstIsuId) {
                      // 最初参照
                      _that.formData.firstIsuId = _that.orgIsuId
                    }
                  }
                }

                _that.formInitAfter({
                  contactMan: userInfo.nickName,
                  phone: userInfo.mobile
                }, _that.formData)
                // 表单填写时间控制
                _that.inputTiming()
              })
            } else {
              // 无原始isuId,则按新建发布信息处理
              _that.editType = 'new'
              _that.formInitAfter({
                contactMan: userInfo.nickName,
                phone: userInfo.mobile
              }, null)
              // 表单填写时间控制
              _that.inputTiming()
            }
          } else {
            _that.formInitAfter({
              contactMan: userInfo.nickName,
              phone: userInfo.mobile
            }, null)
            // 表单填写时间控制
            _that.inputTiming()
          }
        }
      })

      // 用户账户信息
      this.getUserActInfo()
    },

    /**
     * 表单初始化后处理
     */
    formInitAfter(orgForm) { },

    getUserActInfo() {
      const _that = this
      getUserAccount().then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res) {
            // _that.userAct = _res
            let yueChannel = _that.payChannelAry.find((el) => el.value === 'yue')
            yueChannel.lastAmount = _res.cashTotalAmount
          }
        }
      })
    },

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
    },

    /**发布费用部分********************* */

    /**
     * 计算总费用
     */
    totalFee(fee) {
      let total = 0
      if (fee.issueFee.isCalc && fee.issueFee.price) {
        total += fee.issueFee.price
      }
      if (fee.topFee.isCalc && fee.topFee.price) {
        total += fee.topFee.price
      }
      return total.toFixed(2)
    },

    /**
     * 发布费用计算及显示值
     * @param {*} issuePrice
     */
    putIssueFee(issuePrice) {
      if (issuePrice && issuePrice.isLadder !== 'Y') {
        let issueFee = {
          price: issuePrice.payBasePrice,
          priceName: '1元/条',
          isTimes: false, // 是否按次收费
          isFree: false, // 是否免费
          termName: '一个月',
          termUnit: 'm',
          unitNum: 1,
          isCalc: true, // 是否计算发布费
          orgPriceName: '1元/条',
          isActivity: false // 是否优惠活动
        }

        if (issuePrice.payFree || issuePrice.payBasePrice <= 0) {
          issueFee.price = 0
          issueFee.priceName = '免费'
          issueFee.isFree = true
        } else {
          if (issuePrice.sysBenefitActivity && issuePrice.activityRate < 1) {
            issueFee.isActivity = true
            if (issuePrice.activityRate <= 0) {
              issueFee.price = 0
              issueFee.priceName = '免费'
              issueFee.orgPriceName = `${issuePrice.payBasePrice}元/条`
              issueFee.isFree = true
            } else {
              issueFee.price = issuePrice.payBasePrice * issuePrice.activityRate
              issueFee.priceName = `${issueFee.price}元/条`
              issueFee.orgPriceName = `${issuePrice.payBasePrice}元/条`
              issueFee.isFree = false
            }
          } else {
            issueFee.price = issuePrice.payBasePrice
            issueFee.isActivity = false
            issueFee.priceName = `${issueFee.price}元/条`
            issueFee.isFree = false
          }
        }

        if (issuePrice.priceBase) {
          issueFee.termUnit = issuePrice.priceBase.termUnit
          issueFee.unitNum = issuePrice.priceBase.unitNum

          if (issueFee.termUnit === 'd') {
            issueFee.termName = `${issueFee.unitNum}天`
          } else if (issueFee.termUnit === 'w') {
            issueFee.termName = `${issueFee.unitNum}周`
          } else if (issueFee.termUnit === 'm') {
            issueFee.termName = `${issueFee.unitNum}个月`
          } else if (issueFee.termUnit === 'y') {
            issueFee.termName = `${issueFee.unitNum}天`
          } else if (issueFee.termUnit === 't') {
            issueFee.isTimes = true
          }
        }
        this.fee.issueFee = issueFee
        this.fee.total = this.totalFee(this.fee)
      }
    },

    /**
     * 切换置顶时计算费用
     * @param {*} e
     */
    switchTopChange: function (e) {
      const isTopOpen = e.detail.value
      let topCtrl = this.topCtrl
      let fee = this.fee
      if (!isTopOpen) {
        fee.topFee.price = 0.0
        fee.topFee.isCalc = false
      } else {
        // 再打开置顶开关时，如果之前有选择则继续使用前一次选择置顶方案
        if (!topCtrl.usePrice || !topCtrl.usePrice.stepId) {
          topCtrl.usePrice = this.topPricePlan.ladderPriceStep[0]
        }
        fee.topFee.price = topCtrl.usePrice.stepPayPrice
        fee.topFee.isCalc = true
      }
      fee.total = this.totalFee(fee)

      topCtrl.open = isTopOpen
      this.topCtrl = topCtrl
      this.fee = fee
    },

    /**
     * 选择置顶方案并计算费用
     * @param {*} e
     */
    checkTopPrice: function (e) {
      // const topPrice = e.currentTarget.dataset.item
      const topPrice = e
      let topCtrl = this.topCtrl
      topCtrl.usePrice = topPrice

      let fee = this.fee
      fee.topFee = {
        price: topPrice.stepPayPrice,
        isCalc: true,
        priceName: '',
        termName: topPrice.stepName,
        termUnit: topPrice.stepTermUnit,
        unitNum: topPrice.stepTermUnitNum
      }
      fee.total = this.totalFee(fee)
      this.topCtrl = topCtrl
      this.fee = fee
    },

    /**文件上传部分********************* */

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
      let maxImgSize = 500
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
    },

    /**
     * 封装表单提交数据
     */
    packFormData(formData) {
      const _that = this

      // 发布费用方案
      // let feeChecks = []
      let issuFee = {}
      const issuePrice = _that.isuPricePlan
      if (issuePrice && _that.fee.issueFee.isCalc) {
        issuFee = {
          feeType: issuePrice.feeType,
          basePriceId: issuePrice.priceBase.priceId,
          isLadder: issuePrice.isLadder,
          ladderId: undefined,
          stepId: undefined
        }

        if (issuePrice.isLadder === 1 && issuePrice.priceLadder) {
          issuFee.ladderId = issuePrice.priceLadder.ladderId
          if (isuCtrl.stepId) {
            issuFee.stepId = isuCtrl.stepId
          }
        }
        // feeChecks.push(issuFee)
      }

      // 选择置顶费用
      let topFee = {}
      if (_that.topCtrl.open && _that.fee.topFee.isCalc) {
        const topPrice = _that.topPricePlan
        if (topPrice) {
          topFee = {
            feeType: topPrice.feeType,
            basePriceId: topPrice.priceBase.priceId,
            isLadder: topPrice.isLadder,
            ladderId: undefined,
            stepId: undefined
          }

          if (topPrice.isLadder === 1 && topPrice.priceLadder) {
            topFee.ladderId = topPrice.priceLadder.ladderId
            if (_that.topCtrl.usePrice) {
              topFee.stepId = _that.topCtrl.usePrice.stepId
            }
          }
          // feeChecks.push(topFee)
        }
      }

      // 上传的图片或视频地址
      let imgUrls = []
      if (_that.upImg.upFiles) {
        _that.upImg.upFiles.forEach((item) => {
          if (!item.isTmp) {
            imgUrls.push({
              key: item.key,
              url: item.url,
              seqNo: item.seqNo
            })
          }
        })
      }

      let videoUrls = []
      if (_that.upVideo.upFiles) {
        _that.upVideo.upFiles.forEach((item) => {
          if (!item.isTemp) {
            videoUrls.push({
              key: item.key,
              url: item.url,
              seqNo: item.seqNo
            })
          }
        })
      }

      // 动态表单内容
      let dyFields = [..._that.fixDyFields] //['buildUnit', 'buildRoom']
      if (_that.dyForms && Array.isArray(_that.dyForms)) {
        _that.dyForms.forEach((block) => {
          if (block && Array.isArray(block)) {
            block.forEach((row) => {
              if (row.eles && Array.isArray(row.eles)) {
                row.eles.forEach((ele) => {
                  dyFields.push(ele.eleName)
                  /* if (formData[ele.eleName]) {
                    dyFormData[ele.eleName] = formData[ele.eleName]
                  } */
                })
              }
            })
          }
        })
      }

      // 表单数据、动态表单数据
      let dyFormData = {}
      dyFields.forEach((el) => {
        if (formData.hasOwnProperty(el)) {
          dyFormData[el] = formData[el]
          delete formData[el]
        }
      })

      let req = {
        editType: _that.editType,
        orginIsuId: _that.orgIsuId,
        uid: _that.uid,
        cateId: _that.cateId,
        cityCode: _that.localArea.city.distCode,
        adCode: _that.localComm.ad.distCode,
        comId: _that.localComm.comm.comId,
        formData: JSON.stringify(formData),
        dyFormData: JSON.stringify(dyFormData),
        imgUrls: imgUrls,
        videoUrls: videoUrls,
        isuFeeCheck: issuFee,
        topFeeCheck: topFee
        // feeChecks: feeChecks
      }

      // 添加具体业务需提交数据
      req = this.bizPackData(req)

      return req
    },

    /**
     * 表单检查
     * @param {*} formData
     */
    formCheck(formData) {
      return true
    },

    /**
     * 具体业务其它待打包表单数据
     * @param {*} formData
     */
    bizPackData(reqData) {
      return reqData
    },

    formSubmit1(e) {
      const _that = this
      const formData = e.detail.value
      const check = this.formCheck(formData)
      if (!check) {
        return false
      }

      uni.showLoading({
        mask: true
      })

      const uploadFormData = {
        comId: _that.localComm.comm.comId,
        storeType: 'issue'
      }
      _that.fileUpload(uploadFormData).then((upList) => {
        if (upList && Array.isArray(upList) && upList.length > 0) {
          const upImgs = []
          const upVideos = []
          const upFiles = []
          upList.forEach((item) => {
            if (item.type === 'img') {
              upImgs.push(item)
            } else if (item.type === 'video') {
              upVideos.push(item)
            } else if (item.type === 'file') {
              upFiles.push(item)
            }
          })
          _that.upImg.upFiles = upImgs
          _that.upVideo.upFiles = upVideos
          _that.upFile.upFiles = upFiles
        }

        const fmData2 = _that.packFormData(formData)
        isuFormPreOrder(fmData2).then((res) => {
          uni.hideLoading()
          if (res.code === 0) {
            if (res.data) {
              const _payData = res.data
              if (_payData.editType === 'edit' || _payData.editType === 'goOn') {
                // 需修改
                if (_payData.feeAmount > 0) {
                  // 需要支付时，拉起支付方式选择框
                  _that.goPay(_payData.editType, _payData.orderId, _payData.feeAmount, _payData.serutyAmount)
                } else {
                  _that.editFormSubmit('nopay', _payData.orderId, _payData.serutyAmount)
                }
              } else if (_payData.editType === 'new' || _payData.editType === 'again') {
                // 需新建
                if (_payData.feeAmount > 0) {
                  // 需要支付时，拉起支付方式选择框
                  _that.goPay(_payData.editType, _payData.orderId, _payData.feeAmount, _payData.serutyAmount)
                } else {
                  _that.createFormSubmit('nopay', _payData.orderId, _payData.serutyAmount)
                }
              }
            }
          }
        })
      })
    },

    /**
     * 打开支付组件
     *
     */
    goPay(editType, orderId, feeAmount, serutyAmount) {
      // this.pay.show = true
      this.pay.orderNo = orderId
      this.pay.totalFee = feeAmount
      this.pay.attach = {
        editType: editType,
        serutyAmount: serutyAmount
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
      this.pay.show = false
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
     * 新建表单提交
     */
    createFormSubmit(payChannel, payOrderNo, serutyAmount) {
      const _that = this
      this.pay.payChannel = payChannel
      const req = {
        preOrderNo: payOrderNo,
        payChannel: payChannel,
        serutyAmount: serutyAmount,
        couponCode: '',
        uid: _that.uid,

        comId: _that.localComm.comm.comId
      }

      // 创建订单
      isuFormCreate(req).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res) {
            const { orderNo, cateId, isuId } = _res.columns
            if (!orderNo) {
              uni.hideLoading()
              _that.$uniUtil.tips({ title: '信息表单创建失败' })
            }

            const payAttach = {
              cateId: cateId,
              isuId: isuId
            }

            if (payChannel === 'WRoutine') {
              // 微信支付
              _that.weixPay(orderNo, payAttach)
            } else if (payChannel === 'WH5') {
              // 微信h5支付
              console.log('WH5')
            } else if (payChannel === 'yue') {
              // 余额支付
              _that.yuePay(orderNo, payAttach)
            } else {
              // 无需支付
              _that.noPay(orderNo, payAttach)
            }
          }
        } else {
          _that.$uniUtil.tips({ title: res.msg })
        }
      })
    },

    /**
     * 新建表单提交
     */
    createFormSubmit1(payChannel, payOrderNo, serutyAmount) {
      const _that = this
      this.pay.payChannel = payChannel
      const req = {
        uid: _that.uid,
        comId: _that.localComm.comm.comId,
        payChannel: payChannel,
        preOrderNo: payOrderNo,
        serutyAmount: serutyAmount
      }

      // 创建订单
      isuFormCreate(req).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res) {
            const { orderNo, cateId, isuId } = _res.columns
            if (!orderNo) {
              uni.hideLoading()
              _that.$uniUtil.tips({ title: '信息表单创建失败' })
            }

            const payAttach = {
              cateId: cateId,
              isuId: isuId
            }

            if (payChannel === 'WRoutine') {
              // 微信支付
              _that.weixPay(orderNo, payAttach)
            } else if (payChannel === 'WH5') {
              // 微信h5支付
              console.log('WH5')
            } else if (payChannel === 'yue') {
              // 余额支付
              _that.yuePay(orderNo, payAttach)
            } else {
              // 无需支付
              _that.noPay(orderNo, payAttach)
            }
          }
        } else {
          _that.$uniUtil.tips({ title: res.msg })
        }
      })
    },

    /**
     * 表单修改提交
     * @param {*} editType 编辑类型，修改时应为：edit:修改、 goOn:延续(原信息延期)
     * @param {*} payOrderNo
     * @param {*} serutyAmount
     */
    editFormSubmit(payChannel, payOrderNo, serutyAmount) {
      const _that = this
      _that.pay.payChannel = payChannel
      const req = {
        uid: _that.uid,
        comId: _that.localComm.comm.comId,
        payChannel: payChannel,
        preOrderNo: payOrderNo,
        orginIsuId: _that.orgIsuId,
        serutyAmount: serutyAmount
      }

      isuFormEdit(req).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res) {
            const { orderNo, payFlag, cateId, isuId } = _res.columns
            if (!orderNo && !payFlag) {
              uni.hideLoading()
              _that.$uniUtil.tips({ title: '信息表单保存失败' })
            }

            const payAttach = {
              cateId: cateId,
              isuId: isuId
            }

            if (payChannel === 'WRoutine') {
              // 微信支付
              _that.weixPay(orderNo, payAttach)
            } else if (payChannel === 'WH5') {
              // 微信h5支付
              console.log('WH5')
            } else if (payChannel === 'yue') {
              // 余额支付
              _that.yuePay(orderNo, payAttach)
            } else {
              if (payFlag === 'over') {
                // 后端返回，不存在支付
                _that.$uniUtil.tips({ title: '信息内容修改成功' })
                _that.goListPage()
              } else {
                _that.noPay(orderNo, payAttach)
              }
            }
          }
        } else {
          if (res.msg) {
            _that.$uniUtil.tips({ title: res.msg })
          } else {
            _that.$uniUtil.tips({ title: '修改内容保存失败' })
          }
        }
      })
    },

    /**
     * 无需支付的订单处理(新建、重发时0费用也会有支付订单)
     * @param {*} orderNo
     * @param {*} payAttach: {cateId, isuId}
     */
    noPay(orderNo, payAttach) {
      // 无需支付、直接按支付后处理
      const payRes = {
        status: true,
        payOrderNo: orderNo
      }
      this.payAfter(payRes, payAttach.cateId, payAttach.isuId)
    },

    /**
     * 支付组件选择支付方式后的支付处理
     * @param actPay 实际支付订单信息
     * actPay: {
     *   payAmount: 0,
     *   orderCode: '',
     *   attach: {},
     *   payChannel: {},
     * 
     *   // 抵扣消费券金额、编码
     *   couponAmount: 0,
     *   couponCode: ''
     * }
     */
    checkPay(actPay) {
      const _that = this
      if (actPay && actPay.attach && actPay.attach.editType) {
        uni.showLoading({
          mask: true
        })
        const editType = attach.editType
        if (editType === 'edit' || editType === 'goOn') {
          _that.editFormSubmit(payChannel, payOrderNo, attach.serutyAmount)
        } else if (editType === 'new' || editType === 'again') {
          _that.createFormSubmit(payChannel, payOrderNo, attach.serutyAmount)
        } else {
          uni.hideLoading()
        }
      }
    },
    checkPay1(payChannel, payOrderNo, totalPrice, attach) {
      const _that = this
      if (attach && attach.editType) {
        uni.showLoading({
          mask: true
        })
        const editType = attach.editType
        if (editType === 'edit' || editType === 'goOn') {
          _that.editFormSubmit(payChannel, payOrderNo, attach.serutyAmount)
        } else if (editType === 'new' || editType === 'again') {
          _that.createFormSubmit(payChannel, payOrderNo, attach.serutyAmount)
        } else {
          uni.hideLoading()
        }
      }
    },

    /**
     * 后端余额支付处理
     * @param {*} orderNo
     * @param {*} cateId
     */
    yuePay(orderNo, payAttach) {
      const _that = this
      const req = {
        orderNo: orderNo,
        cateId: payAttach.cateId,
        isuId: payAttach.isuId,
        payChannel: _that.pay.payChannel
      }
      isuFormOrderYue(req).then((res) => {
        if (res.code === 0) {
          const _res = res.data
          if (_res) {
            // 支付完成
            _that.payAfter(_res, payAttach.cateId, payAttach.isuId)
            /* _that.payAfterProc(isuId).then((res) => {
              // 关闭支付弹窗并跳转到信息详情
              // _that.gotoDetail(isuId)
              _that.goListPage()
            }) */
          }
        }
      })
    },

    /**
     * 支付后处理
     */
    payAfter(padRes, cateId, isuId) {
      const _that = this
      if (padRes.status) {
        const req = {
          orderNo: padRes.payOrderNo,
          isuId: isuId,
          cateId: cateId
        }
        _that.pay.payResInterval = setInterval(
          (function () {
            const fn = function () {
              // 查询支付结果
              isuFormOrderPayRes(req).then((res) => {
                if (res.code === 0) {
                  const _res = res.data.columns
                  const payStatus = _res.payStatus
                  if (payStatus === 3) {
                    // 已支付成功且支付后处理完成
                    if (_that.pay.payResInterval) {
                      clearInterval(_that.pay.payResInterval)
                    }
                    _that.goListPage()
                  } else if (payStatus === 1) {
                    // 已支付成功，但还未执行支付后处理
                    _that.payCallBack(padRes.payOrderNo)
                  } else if (payStatus === 0) {
                    // 未支付成功
                    uni.hideLoading()
                  } else {
                    // 支付及处理异常
                    uni.hideLoading()
                  }
                }
              })
            }
            fn()
            return fn
          })(),
          1000 * 20
        )
      }
    },

    payCallBack(payOrderNo) {
      const _that = this
      isuFormOrderPaySucessBack({
        orderNo: payOrderNo
      }).then((res) => {
        if (res.code === 0) {
          if (res.data) {
            // 支付后处理已完成
            if (_that.pay.payResInterval) {
              clearInterval(_that.pay.payResInterval)
            }
            _that.goListPage()
          }
        }
      })
    },

    /**
     * 调用微信支付
     */
    weixPay(orderNo, payAttach) {
      const _that = this
      // 后端微信支付处理
      isuFormOrderWxPay({
        orderNo: orderNo,
        isuId: payAttach.isuId,
        cateId: payAttach.cateId,
        payChannel: _that.pay.payChannel,
        comId: _that.localComm.comm.comId
      }).then((res) => {
        if (res.code === 0) {
          const _res = res.data

          const wxPayConfig = _res.wxPayConfig

          // #ifdef MP
          // 拉起微信支付弹窗
          uni.requestPayment({
            timeStamp: wxPayConfig.timeStamp,
            nonceStr: wxPayConfig.nonceStr,
            package: wxPayConfig.packageValue,
            signType: wxPayConfig.signType,
            paySign: wxPayConfig.paySign,
            success: function (ress) {
              if (ress && ress.errMsg === 'requestPayment:ok') {
                isuOrderWxPayRes({
                  orderNo: _res.payOrderNo,
                  cateId: payAttach.cateId
                }).then((res2) => {
                  _that.$uniUtil.tips({ title: '发布成功' })
                  // 关闭支付弹窗
                  _that.payClose()
                  setTimeout(function () {
                    /* uni.navigateTo({
                      url: '/pagesUser/users/myissue/myissue?showIdx=0'
                    }) */
                    _that.$Router.replace({
                      name: 'isuInfoDetail',
                      params: {
                        isuId: payAttach.isuId,
                        cateId: payAttach.cateId,
                        mCateName: _that.parCate.cateName,
                        comId: _that.localComm.comm.comId
                      }
                    })
                  }, 1000)
                })
              }
            },
            fail: function (e) {
              if (e) {
                if (e.errMsg === 'requestPayment:fail cancel') {
                  _that.$uniUtil.tips({ title: '用户取消支付' })
                } else {
                  _that.$uniUtil.tips({ title: '支付失败' })
                }
              } else {
                _that.$uniUtil.tips({ title: '支付失败' })
              }
            },
            complete: function (e) {
              uni.hideLoading()
            }
          })
          // #endif
          // #ifdef H5
          // #endif
        }
      })
    },

    /**
     * 支付完成后操作，具体业务重新定义
     */
    payAfterProc(isuId) {
      return new Promise((resove, reject) => {
        resove(true)
      })
    },

    /**
     * 跳转到信息列表页
     */
    goListPage() {
      const _that = this
      if (_that.pay.payResInterval) {
        clearInterval(_that.pay.payResInterval)
      }
      uni.hideLoading()
      this.$Router.replace({
        path: '/isuInfoList',
        query: { mCateId: _that.parCate.cateId }
      })
    },

    /**
     * 跳转到信息详情页
     * @param {*} isuId
     */
    gotoDetail(isuId) {
      const _that = this
      _that.payClose()

      this.$Router.replace({
        name: 'isuInfoDetail',
        params: {
          isuId: isuId,
          cateId: _that.infoCate.cateId,
          mCateName: _that.parCate.cateName,
          comId: _that.localComm.comm.comId
        }
      })
    }
  }
}
