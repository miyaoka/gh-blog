<template>
  <div class="app">
    <div class="content-wrapper">
      <AppHeader/>
      <section class="content">
        <nuxt/>
      </section>
      <span v-if="mounted">
        <script async defer src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
      </span>
    </div>
    <AppFooter class="footer"/>
  </div>
</template>

<script>
import AppHeader from '~/components/AppHeader.vue'
import AppFooter from '~/components/AppFooter.vue'

export default {
  components: {
    AppHeader,
    AppFooter
  },
  data() {
    return {
      mounted: false
    }
  },
  async mounted() {
    this.mounted = true
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/mixin/_mediaquery.scss';
$footer-height: 120px;

.content-wrapper {
  min-height: calc(100vh- #{$footer-height});
  padding-bottom: 3rem;
}
.content {
  max-width: 960px;
  margin: auto;
  padding: 0 1rem;

  transition: 0.2s ease-out;

  @include mq(tb) {
    max-width: 560px;
    padding: 0 0.5rem;
  }
}
.footer {
  height: $footer-height;
}
</style>
