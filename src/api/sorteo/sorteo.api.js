import { instance } from '../base.api'
const model = 'sorteos'

const sorteoAPI = {
  listarTodos: async (params = {}) => {
    return instance.get(`/${model}/listar/todos`, { params })
  },

  // AÑADE ESTO:
  listarPorPunto: async (puntoVentaId, params = {}) => {
    return instance.get(`/${model}/listar/por-punto/${puntoVentaId}`, { params })
  },

  crear: async (data) => {
    return instance.post(`/${model}/crear`, data)
  },

  actualizar: async (id, data) => {
    return instance.patch(`/${model}/actualizar-sorteo/${id}`, data)
  },

  listarAbiertos: async (params = {}) => {
    return instance.get(`/${model}/listar/abiertos`, { params })
  },

  listarCerrados: async (params = {}) => {
    return instance.get(`/${model}/listar/cerrados`, { params })
  },

  eliminar: async (id) => {
    return instance.delete(`/${model}/eliminar/${id}`)
  },
}

export default sorteoAPI
