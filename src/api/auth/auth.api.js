import { instance } from '@/api/base.api.js'

const model = 'auth'

const authAPI = {
  iniciarSesion: ({ alias, clave }) => {
    return instance.post(`/${model}/iniciar-sesion`, { alias, clave })
  },
}

export default authAPI
