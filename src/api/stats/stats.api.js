import { instance } from '../base.api'
const model = 'estadisticas'

const statsAPI = {
  listarEstadisticas: async () => {
    return instance.get(`/${model}/listar`)
  },
}

export default statsAPI
