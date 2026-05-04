import { instance } from '../base.api'
const model = 'roles'

const rolAPI = {
  listarTodos: () => {
    return instance.get(`/${model}/listar/todos`)
  },

  agregar: () => {
    return instance.post(`/${model}/agregar`)
  },
}

export default rolAPI
