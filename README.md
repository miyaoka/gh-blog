![github-blog](https://user-images.githubusercontent.com/1443118/37141522-a05a276a-22f8-11e8-9d4c-652150986e93.png)

# gh-blog

> GitHub Issue as Blog

Detail: https://twitter.com/miyaoka/status/970040889513922561

## Demo

Demo site: https://gh-blog.netlify.com/

<img width="600" alt="demo" src="https://user-images.githubusercontent.com/1443118/36947961-c069e93a-2016-11e8-9991-7e5605d071b0.png">

## Env settings

### Use direnv

- Copy `.envrc.example` to `.envrc`

### Fill out params

Create your OAuth tokens at [Personal Access Tokens](https://github.com/settings/tokens) and set below.

- `GH_QUERY_TOKEN` (Required: To fetch issues)
  - Select scopes: Turn off all scopes. (only public access)
- `GH_MUTATION_TOKEN` (Optional: To edit issues on blog site. Don't use in public!!)
  - Select scopes: Only `public_repo` scope.

Target repository config

- `GH_REPO_OWNER`
- `GH_REPO_NAME`

## Build Setup

``` bash
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
