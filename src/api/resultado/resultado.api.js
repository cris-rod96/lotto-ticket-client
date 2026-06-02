import { instance } from '../base.api'

const model = 'resultados'

const resultadoAPI = {
  registrar: async (data) => {
    return instance.post(`/${model}/registrar`, data)
  },

  actualizar: async (data) => {
    console.log(data)
    return instance.put(`/${model}/actualizar`, data)
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

  listarPorPunto: async (filtros = {}) => {
    // Aquí recibimos puntoVentaId, page y limit
    const { puntoVentaId, page, limit } = filtros

    return instance.get(`/${model}/listar/por-punto`, {
      params: {
        puntoVentaId: puntoVentaId || undefined,
        page: page || 1,
        limit: limit || 6,
      },
    })
  },
}

export default resultadoAPI
