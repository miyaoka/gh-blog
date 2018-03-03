<template>
  <section class="container">
    <header>
      <h2>Issues</h2>
      <small>count: {{issues.totalCount}}</small>
    </header>
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
