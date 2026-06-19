import website from '@/config/website'
import keys from '../config/keys'
import { startWith } from './util'

const keyName = website.key

class Cache {
  constructor(handler) {
    this.cacheSetHandler = uni.setStorageSync
    this.cacheGetHandler = uni.getStorageSync
    this.cacheClearHandler = uni.removeStorageSync
    this.cacheExpire = keyName + 'cache_expire_key:'
    this.name = 'storage'
  }

  /**
   * 获取当前时间戳
   */
  time() {
    return Math.round(new Date() / 1000)
  }

  /**
   * 日期字符串转时间戳
   * @param {Object} expiresTime
   */
  strToTime(expiresTime) {
    let expires_time = expiresTime.substring(0, 19)
    expires_time = expires_time.replace(/-/g, '/')
    return Math.round(new Date(expires_time).getTime() / 1000)
  }

  /**
   * 设定key缓存时间
   * @param {*} key
   * @param {*} expire
   */
  setCaheExpire(key, expire) {
    let expireTime = expire !== undefined ? expire : website.expire || 0
    if (typeof expireTime === 'number') {
      let keyExpire = this.cacheGetHandler(this.cacheExpire + key)
      if (keyExpire) {
        keyExpire.expireTime = expireTime
        keyExpire.expire = this.time() + expireTime // 失效时间
      } else {
        keyExpire = {
          key: key,
          expireTime: expireTime, // 有效期
          expire: this.time() + expireTime // 失效时间
        }
        this.cacheSetHandler(this.cacheExpire + key, keyExpire)
      }
    }
  }

  /**
   * 刷新缓存
   * @param {*} key
   */
  refershCaheExpire(key) {
    let keyExpire = this.cacheGetHandler(this.cacheExpire + key)
    if (keyExpire) {
      keyExpire.expireTime = expireTime
      keyExpire.expire = this.time() + expireTime // 失效时间
    }
  }

  /**
   * 缓存是否过期,过期自动删除
   * @param {Object} key
   * @param {Object} isDel true = 删除,false = 不删除
   */
  isExpireCahe(key, isDel) {
    try {
      const keyExpire = this.cacheGetHandler(this.cacheExpire + key)
      if (keyExpire) {
        let time = keyExpire.expire
        if (time && time < this.time()) {
          if (isDel && isDel === true) {
            // 删除对应缓存
            this.cacheClearHandler(this.cacheExpire + key)
            this.cacheClearHandler(key)
          }
          return false
        } else {
          return true
        }
      }
      return false
    } catch (e) {
      return false
    }
  }

  removeExpireCahe(key) {
    let keyExpire = this.cacheGetHandler(this.cacheExpire + key)
    if (keyExpire) {
      this.cacheClearHandler(this.cacheExpire + key)
    }
  }

  /**
   * 清除过期缓存
   */
  clearOverdue() {
    const keys = uni.getStorageInfoSync()
    if (keys) {
      keys.forEach((key) => {
        if (startWith(key, this.cacheExpire)) {
          const cacheKey = key.substring(this.cacheExpire.length)
          const keyExpire = this.cacheGetHandler(key)
          if (keyExpire) {
            let time = keyExpire.expire
            if (time && time < this.time()) {
              // 删除对应缓存
              this.cacheClearHandler(key)
              this.cacheClearHandler(cacheKey)
            }
          }
        }
      })
    }
  }

  /**
   * 设置缓存
   * @param {Object} key
   * @param {Object} data
   * @param {Object} expire 过期时间
   */
  setCache(key, data, expire) {
    if (typeof data === 'object') {
      data = JSON.stringify(data)
    }

    try {
      if (expire) {
        this.setCaheExpire(key, expire)
      }
      this.cacheSetHandler(key, data)
    } catch (e) {
      return false
    }
  }

  /**
   * 检测缓存是否存在
   * @param {Object} key
   */
  hasCache(key) {
    const data = this.cacheGetHandler(key)
    if (data) {
      return this.isExpireCahe(key, true)
    }
    return true
  }

  /**
   * 获取缓存
   * @param {Object} key
   */
  getCache(key) {
    try {
      const isExpire = this.isExpireCahe(key, true)
      if (isExpire) {
        // 刷新有效期
        this.refershCaheExpire(key)
      }

      const str = this.cacheGetHandler(key)
      let data = str
      try {
        data = JSON.parse(data)
      } catch (e) {
        data = str
      }
      return data
    } catch (e) {
      return null
    }
  }

  /**
   * 删除缓存
   * @param {Object} key
   */
  clearCache(key) {
    try {
      this.removeExpireCahe(key)
      this.cacheClearHandler(key)
      return true
    } catch (e) {
      return false
    }
  }
}

export default new Cache()
