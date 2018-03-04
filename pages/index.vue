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

    <article
      class="article"
      v-for="post in issues.nodes"
      :key="post.url">
      <header>
        <h3 class="title">{{post.title}}</h3>
        <a :href="post.url" target="_blank" rel="noopener">[Issue URL]</a>
        <p>{{post.createdAt}}</p>
      </header>
      <div class="body">
        <div class="author">
          <img :src="post.author.avatarUrl">
          <p class="author-name">{{post.author.login}}</p>
        </div>
        <vue-markdown
          class="marked"
          :source="post.body"
          :anchorAttributes="{
            target: '_blank',
            rel: 'noopener'
          }"/>
      </div>
    </article>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import getIssues from '~/apollo/queries/getIssues'
import getPrevIssues from '~/apollo/queries/getPrevIssues'

export default {
  components: {
    VueMarkdown
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
.article {
  margin: 2rem 0;
  padding: 1rem;
  border-radius: 1rem;

  background: #fff;

  .title {
    font-size: 1.8rem;
    margin: 0;
  }
  .author {
    display: grid;
    grid-template-columns: auto auto;
    img {
      width: 40px;
    }
  }
  .body {
    border: 1px solid #eee;
    padding: 1rem;
  }
}
</style>
