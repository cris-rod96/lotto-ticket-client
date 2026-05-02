import { server } from '@/config/index.config'
import { useAuthStore } from '@/store/useAuthStore'
import axios from 'axios'

export const instance = axios.create({
  baseURL: server,
})

instance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers['x-token'] = token
    }
    return config
  },
  (error) => Promise.reject(error)
)
