import axios from 'axios'

const api = axios.create({
  baseURL: `https://api-stone-test.onrender.com/api`,
})

export default api
