import { instance } from '../base.api'
const model = 'sorteos'

const sorteoAPI = {
  listarTodos: async () => {
    return instance.get(`/${model}/listar/todos`)
  },

  crear: async (data) => {
    return instance.post(`/${model}/crear`, data)
  },

  actualizar: async (id, data) => {
    return instance.patch(`/${model}/actualizar-sorteo/${id}`, data)
  },
}

export default sorteoAPI
