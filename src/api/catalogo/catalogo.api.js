import { instance } from '../base.api'
const model = 'catalogos'

const catalogoAPI = {
  listarTodos: () => {
    return instance.get(`/${model}/listar/todos`)
  },

  agregar: (data) => {
    return instance.post(`/${model}/agregar`, data)
  },

  actualizar: (id, data) => {
    return instance.patch(`/${model}/actualizar/${id}`, data)
  },

  eliminar: (id) => {
    return instance.delete(`/${model}/eliminar/${id}`)
  },
}

export default catalogoAPI
