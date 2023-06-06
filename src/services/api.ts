import axios from 'axios'

const isDev = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT

const api = axios.create({
  baseURL: `http://localhost:${isDev ? 3001 : PORT}/api`,
})

export default api
