![github-blog](https://user-images.githubusercontent.com/1443118/37141522-a05a276a-22f8-11e8-9d4c-652150986e93.png)

# gh-blog

> GitHub Issue as Blog

## Article

- [tweet: "azuさんがGitHubのIssueをコンテンツに使う話してて面白そうだったので、とりあえず作ってみてる"](https://twitter.com/miyaoka/status/970040889513922561)
- [GitHub Issuesでブログを作る - Qiita](https://qiita.com/miyaoka/items/1922d5d8528fe31016b9)

## Demo

Demo site: https://gh-blog.netlify.com/

<img src="https://user-images.githubusercontent.com/1443118/37316843-c3439612-26a4-11e8-90e1-1134a4b6a0da.gif" width="600">

## Env settings

### Use direnv

* Copy `.envrc.example` to `.envrc`

### Fill out params

Create your OAuth tokens at [Personal Access Tokens](https://github.com/settings/tokens), and set below.

* `GH_READONLY_TOKEN`: (Required) To fetch issues.
  * Select scopes: Turn off all scopes. (will display as `public access`)
* `GH_WRITE_TOKEN`: (Optional) To edit issues on blog site. Don't use in public!!
  * Select scopes: Only `public_repo` scope.

Set target repository

* `GH_REPO_OWNER`
* `GH_REPO_NAME`

## Build Setup

```bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).
