import { instance } from '../base.api'

const model = 'resultados'

const resultadoAPI = {
  registrar: async (data) => {
    return instance.post(`/${model}/registrar`, data)
  },

  // Modificamos listar para que acepte un objeto de filtros (con valores vacíos por defecto)
  listar: async (filtros = {}) => {
    const { fecha, page, limit } = filtros

    return instance.get(`/${model}/listar/todos`, {
      params: {
        fecha: fecha || undefined, // Si no hay fecha, no la envía en la URL
        page: page || 1,
        limit: limit || 10,
      },
    })
  },
}

export default resultadoAPI
