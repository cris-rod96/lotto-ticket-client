import { instance } from '../base.api.js'
const model = 'cifras'

const cifraAPI = {
  listarTodas: () => {
    return instance.get(`/${model}/listar/todas`)
  },

  agregar: (data) => {
    return instance.post(`/${model}/agregar`, data)
  },

  actualizarCupo: (id, data) => {
    return instance.patch(`/${model}/actualizar/cupo-maximo/${id}`, data)
  },

  eliminar: (id) => {
    return instance.delete(`/${model}/eliminar/${id}`)
  },
}

export default cifraAPI
