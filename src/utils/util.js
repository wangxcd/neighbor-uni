/*
 * @Description:
 * @Author: wangxcd
 * @Email: 17236423@qq.com
 * @Date: 2022-02-11 23:30:14
 * @LastEditors: wangxcd
 * @LastEditTime: 2022-02-11 23:30:14
 */
import { isNotEmpty } from './validate'

const base64 = require('base64-arraybuffer')
const pako = require('pako')

const eval2 = (fn) => {
  var Fun = Function // 一个变量指向Function，防止有些前端编译工具报错
  return new Fun('return ' + fn)()
}

/**
 * 表单序列化
 * @param {*} data
 * @returns
 */
const serialize = (data) => {
  const list = []
  Object.keys(data).forEach((ele) => {
    list.push(`${ele}=${data[ele]}`)
  })
  return list.join('&')
}

/**
 * 获取对象类象
 * @param {*} obj
 * @returns
 */
const getObjType = (obj) => {
  var toString = Object.prototype.toString
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}

/**
 * @description: 生成UUID
 * @param {*}
 * @return {*}
 * @author: gumingchen
 */
function getUUID() {
  let result = ''
  const str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  result = str.replace(/[xy]/gu, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
  return result
}

/**
 * 生成随机len位数字
 */
const randomLenNum = (len, date) => {
  let random = ''
  random = Math.ceil(Math.random() * 100000000000000)
    .toString()
    .substring(0, len || 4)
  if (date) random = random + Date.now()
  return random
}

/**
 * Check is given string ends with 'start'
 * @param {*} str
 * @param {*} start
 * @returns
 */
const startWith = (str, start) => {
  if (!str) return false
  return str.substr(0, start.length) === start
}

/**
 * 去除字符串前缀
 * @param {*} str
 * @param {*} prefix
 * @returns
 */
const removePrefix = (str, prefix) => {
  return startWith(str, prefix) ? str.substr(prefix.length) : str
}

/**
 * Check is given string ends with `suffix`.
 * @param {*} str
 * @param {*} suffix
 * @returns
 */
const endsWith = (str, suffix) => {
  var expectedPos = str.length - suffix.length
  return expectedPos >= 0 && str.indexOf(suffix, expectedPos) === expectedPos
}

/**
 * 删除字符串后缀
 * @param {*} str
 * @param {*} suffix
 * @returns
 */
const removeSuffix = (str, suffix) => {
  return endsWith(str, suffix) ? str.slice(0, str.length - suffix.length) : str
}

const trim = (str) => {
  return String.prototype.trim.call(str)
}

/**
 * 计算字符数，对于半角算半个字符
 * @param {*} str
 * @returns
 */
const countChars = (str) => {
  let charCount = 0
  if (str) {
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i)
      // 半角字符的字符编码范围大致是32到126，不包括全角字符的控制码等
      if (charCode >= 32 && charCode <= 126) {
        charCount += 0.5 // 半角字符算半个字符
      } else {
        charCount += 1 // 全角字符或其他字符算1个字符
      }
    }
  }
  return charCount
}

/*
 * 合并数组
 */
const splitArray = (list, sp) => {
  if (typeof list != 'object') return []
  if (sp === undefined) sp = []
  for (var i = 0; i < list.length; i++) {
    sp.push(list[i])
  }
  return sp
}

/**
 * 数字转成汉字
 * @params num === 要转换的数字
 * @return 汉字
 * */
const toChinesNum = (num) => {
  const changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const unit = ['', '十', '百', '千', '万']
  num = parseInt(num)
  const getWan = (temp) => {
    const strArr = temp.toString().split('').reverse()
    let newNum = ''
    const newArr = []
    strArr.forEach((item, index) => {
      newArr.unshift(item === '0' ? changeNum[item] : changeNum[item] + unit[index])
    })
    const numArr = []
    newArr.forEach((m, n) => {
      if (m !== '零') numArr.push(n)
    })
    if (newArr.length > 1) {
      newArr.forEach((m, n) => {
        if (newArr[newArr.length - 1] === '零') {
          if (n <= numArr[numArr.length - 1]) {
            newNum += m
          }
        } else {
          newNum += m
        }
      })
    } else {
      newNum = newArr[0]
    }

    return newNum
  }
  const overWan = Math.floor(num / 10000)
  let noWan = num % 10000
  if (noWan.toString().length < 4) {
    noWan = '0' + noWan
  }
  return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
}

const getDateTimeStamp = (dateStr) => {
  dateStr = dateStr
  var da = Date.parse(dateStr.replace(/-/gi, '/'))
  return da
}

const timeNums = [365 * 24 * 60 * 60 * 1000, 30 * 24 * 60 * 60 * 1000, 24 * 60 * 60 * 1000, 60 * 60 * 1000, 60 * 1000]
const timeUnit = ['年', '月', '天', '小时', '分钟']

const timeAgoMillion = (atime) => {
  if (!atime) {
    return -1
  }
  let times = 0
  if (typeof atime === 'string') {
    times = getDateTimeStamp(atime)
  } else {
    times = atime.getTime()
  }
  var ct = new Date().getTime() - times
  return ct
}

const timeAgo = (atime) => {
  const ct = timeAgoMillion(atime)
  if (ct === -1) {
    return ''
  }

  if (ct < 60 * 1000) {
    // 1分钟内
    return '刚刚'
  }

  for (let i = 0; i < timeNums.length; i++) {
    if (ct < timeNums[i]) {
      continue
    }
    const temp = Math.floor(ct / timeNums[i])
    if (temp > 0) {
      return temp + timeUnit[i] + '前'
    }
  }
}

/**
 * 函数防抖 (只执行最后一次点击)
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
const debounce = (fn, t) => {
  const delay = t || 500
  let timer
  return function () {
    const args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      timer = null
      fn.apply(this, args)
    }, delay)
  }
}

const isRemoteUrl = (url) => {
  if (!url) {
    return false
  }
  const tmpUrl = url.toLowerCase()
  return startWith(tmpUrl, 'http://') || startWith(tmpUrl, 'https://')
}

const unGzipJson = function (jsonStr) {
  if (isNotEmpty(jsonStr)) {
    // const byteArray = Buffer.from(jsonStr, 'base64')
    const byteArray = base64.decode(jsonStr)
    const zipStr = pako.ungzip(byteArray, { to: 'string' }) // 调用 pako 的方法解压数据
    return zipStr
  }
}

const isWeixin = function () {
  return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
}

module.exports = {
  eval2,
  serialize,
  getObjType,
  getUUID,
  randomLenNum,
  startWith,
  removePrefix,
  removeSuffix,
  trim,
  countChars,
  splitArray,
  toChinesNum,
  getDateTimeStamp,
  timeAgoMillion,
  timeAgo,
  debounce,
  isRemoteUrl,
  unGzipJson,
  isWeixin
}
