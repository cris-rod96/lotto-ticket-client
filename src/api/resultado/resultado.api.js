import { instance } from '../base.api'

const model = 'resultados'

const resultadoAPI = {
  registrar: async (data) => {
    return instance.post(`/${model}/registrar`, data)
  },

  listar: async (filtros = {}) => {
    // Desestructuramos los nuevos filtros
    const { fecha, jornada, utilidad, page, limit } = filtros

    return instance.get(`/${model}/listar/todos`, {
      params: {
        // Usamos || undefined para que axios no incluya estos parámetros si son nulos/vacíos
        fecha: fecha || undefined,
        jornada: jornada !== 'Todos' ? jornada : undefined,
        utilidad: utilidad !== 'Todos' ? utilidad : undefined,
        page: page || 1,
        limit: limit || 10,
      },
    })
  },
}

export default resultadoAPI
