<template>
  <article class="article">
    <div class="author">
      <div class="icon">
        <img :src="post.author.avatarUrl">
      </div>
      <div class="author-name">{{post.author.login}}</div>
    </div>

    <div class="main">
      <div class="bubble">
        <header>
          <h3 class="title"><a :href="post.url" target="_blank" rel="noopener">{{post.title}}</a></h3>
        </header>
        <div class="body" :class="{hasDiff}">
          <section>
            <vue-markdown
              class="marked"
              :source="previewBody"
              :anchorAttributes="{
                target: '_blank',
                rel: 'noopener'
              }"
            />
          </section>
          <transition name="fade">
          <div
            v-if="isEditing"
            class="editor"
            >
            <textarea
              v-model="editorBody"
              :disabled="isCommiting"
            />
          </div>
          </transition>

          <div class="edit-toggle" v-if="isDev">
            <button @click="toggleEdit">{{isEditing ? 'プレビュー' : '編集'}}</button>
          </div>
          <transition name="edit-action">
          <div class="edit-action" v-if="hasDiff">
            <button
              @click="discardEdit"
              :disabled="isCommiting"
              >変更を破棄</button>
              /
            <button
              @click="saveEdit"
              :disabled="isCommiting"
              >保存</button>
          </div>
          </transition>

        </div>
      </div>
      <div class="date" :title="post.createdAt | fullDate">{{post.createdAt | date}}</div>
      <div class="comments" v-if="post.comments.totalCount > 0">
        comments: {{post.comments.totalCount}}
        <a
          v-for="comment in post.comments.nodes"
          :key="comment.id"
          :href="comment.url"
          target="_blank"
          rel="noopener"
        ><img :src="comment.author.avatarUrl"></a>
      </div>

    </div>

  </article>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import { mapState, mapMutations } from 'vuex'
import { DateTime } from 'luxon'

export default {
  components: {
    VueMarkdown
  },
  filters: {
    date(time) {
      return DateTime.fromISO(time, { zone: 'Asia/Tokyo' }).toFormat(
        'MM/dd HH:mm'
      )
    },
    fullDate(time) {
      return DateTime.fromISO(time, { zone: 'Asia/Tokyo' }).toFormat(
        'yyyy/MM/dd HH:mm:ss'
      )
    }
  },
  props: {
    post: { type: Object }
  },
  data() {
    return {
      previewBody: '',
      editorBody: '',
      isCommiting: false,
      isEditing: false,
      isDev: process.env.NODE_ENV === 'development'
    }
  },
  created() {
    this.initBody()
  },
  computed: {
    ...mapState(['repoOwner', 'repoName']),
    hasDiff() {
      return this.post.body !== this.editorBody
    }
  },
  methods: {
    ...mapMutations(['updateNode']),
    initBody() {
      this.previewBody = this.editorBody = this.post.body
    },
    toggleEdit() {
      this.isEditing = !this.isEditing
    },
    discardEdit() {
      this.initBody()
      this.isEditing = false
    },
    async saveEdit() {
      this.isCommiting = true
      try {
        const res = await this.$ghApiV3.patch(
          `/repos/${this.repoOwner}/${this.repoName}/issues/${
            this.post.number
          }`,
          {
            body: this.editorBody
          }
        )
        this.showSuccessMsg({ message: 'Saved.' })
        this.updateNode({ ...this.post, body: this.editorBody })
        this.isEditing = false
      } catch (err) {
        this.showErrorMsg({ message: err.message })
        console.error(err)
      } finally {
        this.isCommiting = false
      }
    }
  },
  watch: {
    isEditing(val) {
      if (!val) {
        this.previewBody = this.editorBody
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/mixin/_mediaquery.scss';
@import '~assets/css/_vars.scss';

$bubble-border-clr: $clr-w-d;
$bubble-border-width: 5px;
$bubble-bg-clr: $clr-w-ll;
$bubble-arrow-size: 25px;

.article {
  margin: 4rem 0;
  display: grid;
  grid-template-columns: 150px 650px;
  width: 600px;

  @include mq(tb) {
    display: block;
    width: auto;
  }
}
.author {
  justify-self: center;
  align-self: start;
  position: relative;
  display: grid;
  grid-template-rows: auto;
  justify-items: center;
  grid-gap: 0.5rem;
  color: $clr-w;

  .icon {
    width: 100px;
    height: 100px;
    overflow: hidden;
    position: relative;
    border-radius: 50%;
    border: 5px solid $clr-w-d;
    background: #fff;
  }
  img {
    position: absolute;
    width: 100px;
    height: 100px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

.main {
  position: relative;
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: minmax(100%, 100%);

  .bubble {
    padding: 1rem;
    border-radius: 1rem;
    background: $bubble-bg-clr;
    border: $bubble-border-width solid $bubble-border-clr;
    position: relative;
    padding-left: 20px;

    &:before,
    &:after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border: $bubble-arrow-size dashed transparent;
      font-size: 0;
      right: 100%;
      top: 45px;
    }
    &:before {
      border-right-style: solid;
      border-right-color: $bubble-border-clr;
      margin-top: -$bubble-arrow-size;
    }
    &:after {
      border: calc(#{$bubble-arrow-size} - #{$bubble-border-width * 1.4}) dashed
        transparent;
      border-right-style: solid;
      border-right-color: $bubble-bg-clr;
      margin-top: calc(-#{$bubble-arrow-size} + #{$bubble-border-width * 1.4});
    }
    @include mq(tb) {
      &:before,
      &:after {
        content: none;
      }
    }
  }

  .title {
    font-size: 1.8rem;
    margin: 0;
    a {
      color: inherit;
    }
  }
  .body {
    position: relative;
    padding: 1rem;
    min-height: 3rem;

    @include mq(tb) {
      padding: 1rem 0;
    }

    &.hasDiff {
      border: 2px $clr-1 dashed;
    }

    .marked {
      font-size: 1.1rem;
      line-height: 1.5;
    }
    .editor {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      textarea {
        background: hsla(0, 0%, 0%, 0.9);
        color: hsla(0, 0%, 100%, 0.9);
        width: 100%;
        height: 100%;
        min-height: 10rem;
      }
    }
  }
  .date {
    text-align: right;
    color: $clr-w;
  }

  .edit-toggle {
    position: absolute;
    right: 0;
    bottom: 100%;
  }
  .edit-action {
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translateX(-50%);
    background: $clr-2-d;
    border: $clr-2 1px solid;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
  }

  .comments {
    text-align: right;
    color: $clr-w-d;
    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 3px solid $clr-w-d;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.2s ease-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.edit-action-enter-active,
.edit-action-leave-active {
  transition: 0.2s ease-out;
}
.edit-action-enter,
.edit-action-leave-to {
  opacity: 0;
}
</style>
