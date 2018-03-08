import Vue from 'vue'
import Prism from 'prismjs'

Vue.use(Prism)

Vue.mixin({
  mounted() {
    Prism.highlightAll()
  }
})
