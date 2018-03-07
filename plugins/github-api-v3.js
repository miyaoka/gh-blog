import axios from 'axios'

export default ({ env }, inject) => {
  inject(
    'ghApiV3',
    axios.create({
      baseURL: 'https://api.github.com',
      timeout: 3000,
      headers: { authorization: `token ${env.GH_TOKEN}` }
    })
  )
}
