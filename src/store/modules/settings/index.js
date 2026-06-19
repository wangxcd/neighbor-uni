const state = {
  backgroundColor: "#fff"
}

const mutations = {
  BACKGROUND_COLOR (state, color) {
    state.color = color;
    document.body.style.backgroundColor = color;
  }
}

const actions = {
}

const getters = {
  backgroundColor: state => state.backgroundColor
}

export default {
  state,
  mutations,
  actions,
  getters
}
