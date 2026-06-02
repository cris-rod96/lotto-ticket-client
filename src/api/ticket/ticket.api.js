import { instance } from '../base.api'

const model = 'tickets'

const ticketAPI = {
  listarTodos: async (params = {}) => {
    console.log(params)
    return instance.get(`/${model}/listar/todos`, { params })
  },

  // Ahora acepta opcionalmente parámetros de paginación además del ID
  listarPorPuntoDeVenta: async (id, params = {}) => {
    console.log(params)
    return instance.get(`/${model}/listar/punto-de-venta/${id}`, { params })
  },

  vender: async (data) => {
    return instance.post(`/${model}/vender`, data)
  },

  anularTicket: async (id, usuarioId) => {
    usuarioId
    return instance.patch(`/${model}/anular/${id}`, { usuarioId })
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
