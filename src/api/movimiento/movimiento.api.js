import { instance } from '../base.api'
const model = 'movimientos'

const movimientoAPI = {
  listarTodos: () => {
    return instance.get(`/${model}/listar/todas`)
  },

  listarPorCaja: (id) => {
    return instance.get(`/${model}/listar/caja/${id}`)
  },

  listarPorUsuario: (id) => {
    return instance.get(`/${model}/listar/usuario/${id}`)
  },

  listarPorPuntoVenta: (id) => {
    return instance.get(`/${model}/listar/punto-venta/${id}`)
  },
}

export default movimientoAPI
