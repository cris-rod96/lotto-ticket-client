import { instance } from '../base.api.js'
const model = 'cifras'

const cifraAPI = {
  listarTodas: async () => {
    return instance.get(`/${model}/listar/todas`)
  },

  agregar: async (data) => {
    return instance.post(`/${model}/agregar`, data)
  },

  actualizarCupo: async (id, data) => {
    return instance.patch(`/${model}/actualizar/cupo-maximo/${id}`, data)
  },

  eliminar: async (id) => {
    return instance.delete(`/${model}/eliminar/${id}`)
  },
}

export default cifraAPI
