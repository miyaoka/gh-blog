<template>
  <section class="container">
    <header>
      <h2>Issues</h2>
      <small>count: {{issues.totalCount}}</small>
    </header>
    <article
      class="article"
      v-for="post in latestIssues"
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
import VueMarkdown from 'vue-markdown'
import gql from 'graphql-tag'
import getIssues from '~/apollo/queries/getIssues'

export default {
  components: {
    VueMarkdown
  },
  data: () => ({
    issues: {}
  }),
  apollo: {
    issues: {
      prefetch: true,
      query: getIssues,
      variables: {
        repoOwner: 'nuxt',
        repoName: 'nuxt.js',
        fetchIssueCount: 5,
        fetchCommentCount: 5
      },
      update: ({ repository }) => repository.issues
    }
  },
  computed: {
    latestIssues() {
      return this.issues.nodes.slice().reverse()
    }
  }
}
</script>

<style scoped>
.container {
  margin: 2rem;
}
.article {
  margin: 2rem;
}
.title {
  font-size: 1.8rem;
  margin: 0;
}
.author {
  display: grid;
  grid-template-columns: auto auto;
}
.author img {
  width: 40px;
}
.body {
  border: 1px solid #eee;
  padding: 1rem;
}
</style>
