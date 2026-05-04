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
}

export default ticketAPI
