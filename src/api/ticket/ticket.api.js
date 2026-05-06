import { instance } from '../base.api'

const model = 'tickets'

const ticketAPI = {
  listarTodos: () => {
    return instance.get(`/${model}/listar/todos`)
  },

  vender: (data) => {
    return instance.post(`/${model}/vender`, data)
  },

  eliminar: (id) => {
    return instance.delete(`/${model}/eliminar/${id}`)
  },

  verificarCupo: (SorteoId, numero, monto) => {
    return instance.post(`/${model}/verificar-cupo`, {
      SorteoId,
      numero,
      monto,
    })
  },
}

export default ticketAPI
