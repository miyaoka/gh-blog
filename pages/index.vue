<template>
  <section class="container">
    <header>
      <h2>Issues</h2>
      <small>count: {{totalCount}}</small>
    </header>
    <input v-model="inputRepoOwner"> / <input v-model="inputRepoName">
    <button @click="changeRepo">change repo</button>

    <entry-item
      v-for="post in nodes"
      :key="post.id"
      :post="post"
    />
    <no-ssr>
      <infinite-loading @infinite="loadMore" ref="infiniteLoading">
        <span slot="no-results">
          no more articles
        </span>
        <span slot="no-more">
          no more articles
        </span>
      </infinite-loading>
    </no-ssr>
    <div class="page">
      {{nodes.length}} / {{totalCount}}
    </div>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import getIssues from '~/apollo/queries/getIssues'
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
    ...mapMutations([
      'setRepoOwner',
      'setRepoName',
      'setIssues',
      'clearIssues'
    ]),
    async loadMore($state) {
      await this.fetchIssue(this.pageInfo.endCursor)

      this.pageInfo.hasNextPage ? $state.loaded() : $state.complete()
    },
    changeRepo() {
      this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')

      this.setRepoOwner(this.inputRepoOwner)
      this.setRepoName(this.inputRepoName)
      this.fetchIssue()
    },
    async fetchIssue(endCursor) {
      try {
        const { data } = await this.$apollo.getClient().query({
          query: getIssues,
          variables: {
            endCursor,
            repoOwner: this.repoOwner,
            repoName: this.repoName,
            fetchIssuePerPage: this.fetchIssuePerPage
          }
        })
        this.setIssues({ ...data.repository.issues, append: !!endCursor })
      } catch (err) {
        console.error(err)
        this.clearIssues()
        this.showErrorMsg({ message: err.message })
      }
    }
  }
}
</script>

<style lang="scss">
@import '~assets/css/_vars.scss';

.infinite-loading-container {
  .infinite-status-prompt {
    color: $clr-w-d !important;
  }
  .loading-default {
    border-color: $clr-w !important;
    &:before {
      background-color: $clr-w !important;
    }
  }
}
</style>
<style lang="scss" scoped>
@import '~assets/css/_vars.scss';

.page {
  text-align: center;
  color: $clr-w;
}
</style>
