import { instance } from '../base.api'
const model = 'estadisticas'

const statsAPI = {
  // Estadísticas globales del dashboard principal
  listarEstadisticas: async () => {
    return instance.get(`/${model}/listar`)
  },

  // Nuevas estadísticas parametrizadas para el módulo de reportes
  obtenerReporteFinanciero: async (dateFilter, puntoVentaId) => {
    return instance.get(`/${model}/reporte-financiero`, {
      params: {
        dateFilter,
        puntoVentaId,
      },
    })
  },
}

export default statsAPI
