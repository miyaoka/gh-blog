<template>
  <article class="article">
    <header>
      <h3 class="title">{{post.title}}</h3>
      <a :href="post.url" target="_blank" rel="noopener">[Issue URL]</a>
      <p>{{post.createdAt}}</p>
      <div class="author">
        <img :src="post.author.avatarUrl">
        <p class="author-name">{{post.author.login}}</p>
      </div>
    </header>
    <div class="body">
      <vue-markdown
        class="marked"
        :source="previewBody"
        :anchorAttributes="{
          target: '_blank',
          rel: 'noopener'
        }"/>
      <transition name="fade">
      <div
        v-if="isEditing"
        class="edit"
        >
        <textarea
          v-model="editorBody"
          :disabled="isCommiting"
        />
      </div>
      </transition>
    </div>
    <div v-if="isDev">
      <button @click="toggleEdit">{{isEditing ? 'プレビュー' : '編集'}}</button>
      <div v-if="hasDiff">
        <button
          @click="discardEdit"
          :disabled="isCommiting"
          >キャンセル</button>
        <button
          @click="saveEdit"
          :disabled="isCommiting"
          >保存</button>
      </div>
    </div>
  </article>
</template>

<script>
import VueNotifications from 'vue-notifications'
import VueMarkdown from 'vue-markdown'
import { mapState } from 'vuex'

export default {
  components: {
    VueMarkdown
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
        this.showSuccessMsg({ message: 'Saved.', timeout: 1000 })
        this.$emit('update:post', { ...this.post, body: this.editorBody })
        this.isEditing = false
      } catch (err) {
        this.showErrorMsg({ message: err.message, timeout: 7000 })
        console.log(err)
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
  },
  notifications: {
    showSuccessMsg: {
      type: VueNotifications.types.success,
      title: 'Success',
      message: ''
    },
    showInfoMsg: {
      type: VueNotifications.types.info,
      title: 'Info',
      message: ''
    },
    showWarnMsg: {
      type: VueNotifications.types.warn,
      title: 'Warning',
      message: ''
    },
    showErrorMsg: {
      type: VueNotifications.types.error,
      title: 'Error',
      message: ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/css/mixin/_mediaquery.scss';
$date-size: 50px;
$date-pad: 6px;

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

.body {
  position: relative;
  min-height: 3rem;
  .marked {
    font-size: 1.1rem;
    line-height: 1.5;
  }
  .edit {
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
</style>
