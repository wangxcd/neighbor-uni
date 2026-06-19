import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

const path = require('path')

const requireModules = require.context('./modules', true, /index\.(ts|js)$/iu)
const modules = {}
requireModules.keys().forEach(filePath => {
  const modular = requireModules(filePath)
  let name = path.dirname(filePath)
  name = name.split('/').pop()
  modules[name] = {
    namespaced: true,
    ...modular.default
  }
})

/* const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },
  getters: {
  },
  actions: {
  }
}) */

const store = new Vuex.Store({
  modules: {
    ...modules
  },
  getters
})

export default store
