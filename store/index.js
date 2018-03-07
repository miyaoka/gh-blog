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
  nuxtServerInit({ commit }, { env }) {
    console.log(env)
    commit('setRepoOwner', env.GH_REPO_OWNER)
    commit('setRepoName', env.GH_REPO_NAME)
  }
}
