import axios from 'axios'

const port = process.env.VITE_API_PORT || 3000

const api = axios.create({
  baseURL: `http://localhost:${port}/api`,
})

export default api
