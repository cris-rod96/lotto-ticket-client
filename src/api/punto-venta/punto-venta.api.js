import { instance } from '../base.api'
const model = 'puntos-ventas'

const puntosVentaAPI = {
  listarTodos: () => {
    return instance.get(`/${model}/listar/todos`)
  },

  crear: (data) => {
    return instance.post(`/${model}/agregar`, data)
  },

  actualizarInformacion: (id, data) => {
    return instance.patch(`/${model}/actualizar-informacion/${id}`, data)
  },

  eliminar: (id) => {
    return instance.delete(`/${model}/eliminar/${id}`)
  },

  restaurar: (id) => {
    return instance.patch(`/${model}/restaurar/${id}`)
  },
}

export default puntosVentaAPI
