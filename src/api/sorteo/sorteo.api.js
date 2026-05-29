import { instance } from '../base.api'
const model = 'sorteos'

const sorteoAPI = {
  // Ahora recibe un objeto params (ej: { page: 1, limit: 5, estado: 'Abierto' })
  listarTodos: async (params = {}) => {
    return instance.get(`/${model}/listar/todos`, { params })
  },

  crear: async (data) => {
    return instance.post(`/${model}/crear`, data)
  },

  actualizar: async (id, data) => {
    return instance.patch(`/${model}/actualizar-sorteo/${id}`, data)
  },

  // También añadimos params aquí por si necesitas paginar o filtrar los abiertos
  listarAbiertos: async (params = {}) => {
    return instance.get(`/${model}/listar/abiertos`, { params })
  },

  // También añadimos params aquí por si necesitas paginar o filtrar los cerrados
  listarCerrados: async (params = {}) => {
    return instance.get(`/${model}/listar/cerrados`, { params })
  },

  eliminar: async (id) => {
    return instance.delete(`/${model}/eliminar/${id}`)
  },
}

export default sorteoAPI
