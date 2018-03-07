import axios from 'axios'

export default ({ env }, inject) => {
  inject(
    'ghApiV3',
    axios.create({
      baseURL: 'https://api.github.com',
      timeout: 1000,
      headers: { authorization: `token ${env.GH_TOKEN}` }
    })
  )
}
