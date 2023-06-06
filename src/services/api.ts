import axios from 'axios'

const isDev = process.env.NODE_ENV !== 'production'
const PORT = '3001'

const api = axios.create({
  baseURL: `http://localhost:${isDev ? PORT : 3000}/api`,
})

export default api
