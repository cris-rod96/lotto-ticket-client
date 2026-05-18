import { instance } from '../base.api'

const model = 'resultados'

const resultadoAPI = {
  registrar: async (data) => {
    return instance.post(`/${model}/registrar`, data)
  },

  listar: async () => {
    return instance.get(`/${model}/listar/todos`)
  },
}

export default resultadoAPI
