import { instance } from '../base.api'

const model = 'tickets'

const ticketAPI = {
  listarTodos: async () => {
    return instance.get(`/${model}/listar/todos`)
  },

  listarPorPuntoDeVenta: async (id) => {
    return instance.get(`/${model}/listar/punto-de-venta/${id}`)
  },

  vender: async (data) => {
    return instance.post(`/${model}/vender`, data)
  },

  eliminar: async (id) => {
    return instance.delete(`/${model}/eliminar/${id}`)
  },

  verificarCupo: async (SorteoId, numero, monto) => {
    return instance.post(`/${model}/verificar-cupo`, {
      SorteoId,
      numero,
      monto,
    })
  },

  pagarTicket: async (TicketId, UsuarioId, CajaId) => {
    return instance.patch(`/${model}/pagar-ticket`, { TicketId, UsuarioId, CajaId })
  },
}

export default ticketAPI
