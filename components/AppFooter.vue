<template>
  <footer>
    <div class="footer-inner">
      <nav class="links">
        <a
          href="https://github.com/miyaoka/gh-blog"
          rel="nofollow noopener"
          target=“_blank”>
          <img
            src="/img/logo/github.png"
            alt="Powered by GitHub">
        </a>

        <a
          href="https://www.netlify.com/"
          rel="nofollow noopener"
          target=“_blank”>
          <img
            src="/img/logo/netlify.svg"
            alt="Powered by Netlify">
        </a>
      </nav>
    </div>
  </footer>
</template>

<script>
</script>

<style lang="scss" scoped>
@import '~assets/css/mixin/_mediaquery.scss';

footer {
  position: relative;
  background: rgba(255, 255, 255, 0.7);
}
.footer-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.links {
  display: grid;
  grid-template-columns: repeat(2, 80px);
  grid-gap: 1rem;
  align-items: center;
  margin: 2rem auto;
  width: 200px;
  img {
    width: 80px;
  }
}
</style>
