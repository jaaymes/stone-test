import axios from 'axios'

const isDev = process.env.NODE_ENV !== 'production'
let PORT = import.meta.env.VITE_PORT

console.log('🚀 ~ isDev:', isDev)
console.log('🚀 ~ PORT:', PORT)
if (isDev) {
  PORT = 3001
}

const api = axios.create({
  baseURL: `http://localhost:${PORT}/api`,
})

export default api
