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

  obtenerDetalles: (id) => {
    return instance.get(`/${model}/obtener-detalle/punto-venta/${id}`)
  },

  // NUEVO MÉTODO: Trae los tickets del punto fraccionados por páginas
  obtenerTicketsPaginados: (id, page = 1, limit = 20) => {
    return instance.get(`/${model}/puntos-ventas/${id}/tickets`, {
      params: {
        page,
        limit,
      },
    })
  },
}

export default puntosVentaAPI
