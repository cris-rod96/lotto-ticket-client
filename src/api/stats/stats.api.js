import { instance } from '../base.api'
const model = 'estadisticas'

const statsAPI = {
  // Estadísticas globales del dashboard principal
  listarEstadisticas: async () => {
    return instance.get(`/${model}/listar`)
  },

  listarVendedorEstadisticas: async (id) => {
    return instance.get(`/${model}/listar/punto-venta/${id}`)
  },

  // Estadísticas financieras con rangos de fechas personalizados
  obtenerReporteFinanciero: async (fechaInicio, fechaFin, puntoVentaId) => {
    return instance.get(`/${model}/reporte-financiero`, {
      params: {
        fechaInicio,
        fechaFin,
        puntoVentaId,
      },
    })
  },
}

export default statsAPI
