import axios from 'axios'

const token = process.env.GH_TOKEN

const client = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 1000,
  headers: { authorization: `token ${token}` }
})

export default client
