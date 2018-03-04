export const state = () => ({
  repoOwner: '',
  repoName: ''
})

export const mutations = {
  setRepoOwner(state, repoOwner) {
    state.repoOwner = repoOwner
  },
  setRepoName(state, repoName) {
    state.repoName = repoName
  }
}

export const actions = {
  nuxtServerInit({ commit }, { app }) {
    commit('setRepoOwner', 'miyaoka')
    commit('setRepoName', 'gh-blog')
  }
}
