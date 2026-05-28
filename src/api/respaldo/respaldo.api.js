import { instance } from '../base.api'
const model = 'respaldos'

const respaldoAPI = {
  listarTodos: async () => {
    return instance.get(`/${model}/listar-respaldos`)
  },
}

export default respaldoAPI
