import axios from 'axios'

const isDev = import.meta.env.NODE_ENV === 'development'
const PORT = import.meta.env.VITA_PORT

const api = axios.create({
  baseURL: `http://localhost:${isDev ? PORT : 3000}/api`,
})

export default api
