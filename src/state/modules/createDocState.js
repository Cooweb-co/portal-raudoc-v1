export const state = {
  stateDoc: [],// Init variable with session storage key
}

export const mutations = {
  SET_STATE_DOC(state, newValue) {
      state.stateDoc = newValue
  },
}

export const actions = {
  STATE_DOC({ commit }, { newValue }) {
    commit('SET_STATE_DOC', newValue)
  }
}