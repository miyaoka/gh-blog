require('dotenv').config()

module.exports = {
  modules: [
    '@nuxtjs/apollo',
    ['@nuxtjs/google-analytics', { id: 'UA-3536169-21' }]
  ],
  plugins: [
    '~/plugins/github-api-v3.js',
    { src: '~/plugins/vue-notifications', ssr: false }
  ],
  apollo: {
    clientConfigs: {
      default: '~/apollo/client-configs/default.js'
    }
  },
  css: ['~/assets/css/base.scss'],
  env: {
    GH_TOKEN: process.env.GH_TOKEN,
    GH_REPO_OWNER: process.env.GH_REPO_OWNER,
    GH_REPO_NAME: process.env.GH_REPO_NAME
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'gh-blog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'GH Blog' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    vendor: ['vue-notifications', 'luxon'],
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
