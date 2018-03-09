import getIssues from '~/apollo/queries/getIssues'

export const state = (a) => ({
  repoOwner: '',
  repoName: '',
  fetchIssuePerPage: 20,
  totalCount: 0,
  nodes: [],
  pageInfo: {}
})

export const mutations = {
  setRepoOwner(state, repoOwner) {
    state.repoOwner = repoOwner
  },
  setRepoName(state, repoName) {
    state.repoName = repoName
  },
  clearIssues(state) {
    state.totalCount = 0
    state.nodes = []
    state.pageInfo = {}
  },
  setIssues(state, { totalCount, nodes, pageInfo, append }) {
    state.totalCount = totalCount
    state.nodes = append ? [...state.nodes, ...nodes] : nodes
    state.pageInfo = pageInfo
  },
  updateNode(state, node) {
    const i = state.nodes.findIndex((n) => n.id === node.id)
    if (i >= 0) {
      state.nodes = [
        ...state.nodes.slice(0, i),
        node,
        ...state.nodes.slice(i + 1)
      ]
    }
  }
}

export const actions = {
  async nuxtServerInit({ commit, state }, { app, env }) {
    const repoOwner = env.GH_REPO_OWNER
    const repoName = env.GH_REPO_NAME

    commit('setRepoOwner', repoOwner)
    commit('setRepoName', repoName)

    try {
      const { data } = await app.apolloProvider.defaultClient.query({
        query: getIssues,
        variables: {
          repoOwner: repoOwner,
          repoName: repoName,
          fetchIssuePerPage: state.fetchIssuePerPage
        }
      })
      commit('setIssues', data.repository.issues)
    } catch (err) {
      console.error(err)
    }
  }
}
