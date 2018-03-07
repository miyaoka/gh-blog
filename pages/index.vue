<template>
  <section class="container">
    <header>
      <h2>Issues</h2>
      <small>count: {{totalCount}}</small>
    </header>
    <input v-model="inputRepoOwner"> / <input v-model="inputRepoName">
    <button @click="changeRepo">change repo</button>

    <div>
      page: <button
        v-if="pageInfo.hasPreviousPage"
        @click="fetchPrev">« newer</button>
      <button
        v-if="pageInfo.hasNextPage"
        @click="fetchNext">older »</button>
    </div>

    <entry-item
      v-for="post in nodes"
      :key="post.id"
      :post="post"
    />
  </section>
</template>

<script>
import VueNotifications from 'vue-notifications'
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
  computed: {
    ...mapState([
      'repoOwner',
      'repoName',
      'fetchIssuePerPage',
      'totalCount',
      'nodes',
      'pageInfo'
    ])
  },
  methods: {
    ...mapMutations(['setRepoOwner', 'setRepoName', 'setIssues']),
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
      try {
        const { data } = await this.$apollo.getClient().query({
          query: variables && variables.startCursor ? getPrevIssues : getIssues,
          variables: {
            ...variables,
            repoOwner: this.repoOwner,
            repoName: this.repoName,
            fetchIssuePerPage: this.fetchIssuePerPage
          }
        })
        this.setIssues(data.repository.issues)
      } catch (err) {
        console.error(err)
        this.showErrorMsg({ message: err.message, timeout: 7000 })
      }
    }
  },
  notifications: {
    showErrorMsg: {
      type: VueNotifications.types.error,
      title: 'Error'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
