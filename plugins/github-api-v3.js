import axios from 'axios'

export default ({ env }, inject) => {
  inject(
    'ghApiV3',
    axios.create({
      baseURL: 'https://api.github.com',
      timeout: 10000,
      headers: { authorization: `token ${env.GH_MUTATION_TOKEN}` }
    })
  )
}
