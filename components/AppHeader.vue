<template>
  <header>
    <nuxt-link to="/">
      <h1>gh-blog</h1>
    </nuxt-link>
    <div>GitHub Issue as Blog</div>
  </header>
</template>

<script>
</script>

<style lang="scss" scoped>
@import '~assets/css/mixin/_mediaquery.scss';

header {
  text-align: center;
  padding: 1rem 1rem 2rem;
  margin-bottom: 2rem;
  background: url('/img/github-blog.png') center center #fff8e9 no-repeat;
  height: 240px;
  transition: 0.2s ease-out;

  @include mq() {
    height: 180px;
    background-size: cover;
  }
  & > * {
    display: none;
  }
}
h1 {
  font-size: 3rem;
  @include mq() {
    font-size: 2rem;
  }
}
</style>
