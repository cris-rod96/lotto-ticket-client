import { instance } from '../base.api'
const model = 'respaldos'

const respaldoAPI = {
  // Ahora aceptamos parámetros opcionales para la paginación
  listarTodos: async (params = { page: 1, limit: 10 }) => {
    return instance.get(`/${model}/listar-respaldos`, {
      params: {
        page: params.page,
        limit: params.limit,
      },
    })
  },
}

export default respaldoAPI
