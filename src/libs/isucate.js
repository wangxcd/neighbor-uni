import store from '@/store'
import { getIsuCateAll } from '@/api/isuqu'

const getIsuCateById = async function (cateId) {
  let cateList = store.getters['app/isuCateList']
  if (!cateList || !Array.isArray(cateList) || cateList.length === 0) {
    let res = await getIsuCateAll()
    if (res.code === 0) {
      const _res = res.data
      cateList = _res
      store.dispatch('app/setIsuCateList', cateList)
    }
  }

  if (cateList && Array.isArray(cateList)) {
    const cate = cateList.find((el) => el.cateId === cateId)
    return cate
  }
}

module.exports = {
  getIsuCateById
}
