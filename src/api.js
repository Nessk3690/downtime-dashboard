import axios from 'axios'

const client = axios.create({
  baseURL: '/api',     // Vite proxy → http://10.0.0.134:8000
  timeout: 20000,
})

export default client
