<template>
  <section class="container">
    <header>
      <h2>Issues</h2>
      <small>count: {{issues.totalCount}}</small>
    </header>
    <input v-model="inputRepoOwner"> / <input v-model="inputRepoName">
    <button @click="changeRepo">change repo</button>

    <div>
      page: <button
        v-if="issues.pageInfo.hasPreviousPage"
        @click="fetchPrev">« newer</button>
      <button
        v-if="issues.pageInfo.hasNextPage"
        @click="fetchNext">older »</button>
    </div>

    <entry-item
      v-for="post in issues.nodes"
      :key="post.url"
      :post="post"/>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import getIssues from '~/apollo/queries/getIssues'
import getPrevIssues from '~/apollo/queries/getPrevIssues'
import EntryItem from '~/components/EntryItem.vue'

export default {
  components: {
    EntryItem
  },
  data() {
    return {
      inputRepoOwner: '',
      inputRepoName: ''
    }
  },
  created() {
    this.inputRepoOwner = this.repoOwner
    this.inputRepoName = this.repoName
  },
  async asyncData({ app, store }) {
    const fetchIssueCount = 5

    const { data } = await app.apolloProvider.defaultClient.query({
      query: getIssues,
      variables: {
        repoOwner: store.state.repoOwner,
        repoName: store.state.repoName,
        fetchIssueCount
      }
    })

    const issues = data.repository.issues

    return {
      issues,
      fetchIssueCount
    }
  },
  computed: {
    ...mapState(['repoOwner', 'repoName'])
  },
  methods: {
    ...mapMutations(['setRepoOwner', 'setRepoName']),
    fetchPrev() {
      this.fetchIssue({ startCursor: this.issues.pageInfo.startCursor })
    },
    fetchNext() {
      this.fetchIssue({ endCursor: this.issues.pageInfo.endCursor })
    },
    changeRepo() {
      this.setRepoOwner(this.inputRepoOwner)
      this.setRepoName(this.inputRepoName)
      this.fetchIssue()
    },
    async fetchIssue(variables) {
      const { data } = await this.$apollo.getClient().query({
        query: variables && variables.startCursor ? getPrevIssues : getIssues,
        variables: {
          ...variables,
          repoOwner: this.repoOwner,
          repoName: this.repoName,
          fetchIssueCount: this.fetchIssueCount
        }
      })

      this.issues = data.repository.issues
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
