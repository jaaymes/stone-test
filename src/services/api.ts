import axios from 'axios'

const isDev = process.env.NODE_ENV !== 'production'

const api = axios.create({
  baseURL: `http://localhost:${isDev ? 3001 : 3000}/api`,
})

export default api
