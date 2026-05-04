import { instance } from '../base.api'
const model = 'sorteos'

const sorteoAPI = {
  listarTodos: () => {
    return instance.get(`/${model}/listar/todos`)
  },

  crear: (data) => {
    return instance.post(`/${model}/crear`, data)
  },

  actualizar: (id, data) => {
    return instance.patch(`/${model}/actualizar-sorteo/${id}`, data)
  },
}

export default sorteoAPI
