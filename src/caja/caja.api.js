import { instance } from '@/api/base.api'

const model = 'cajas'

const cajaAPI = {
  listarTodas: () => {
    return instance.get(`/${model}/listar/todas`)
  },

  listarPorPuntoDeVenta: (id) => {
    return instance.get(`/${model}/listar/punto-de-venta/${id}`)
  },

  obtenerCajaAbierta: (id) => {
    return instance.get(`/${model}/obtener-abierta/punto-venta/${id}`)
  },
  obtenerAbiertas: () => {
    return instance.get(`/${model}/obtener-abiertas`)
  },

  abrirCaja: (data) => {
    return instance.post(`/${model}/abrir-caja`, data)
  },

  cerrarCaja: (id, data) => {
    return instance.patch(`/${model}/cerrar-caja/${id}`, data)
  },

  registrarInyeccion: (data) => {
    return instance.patch(`/${model}/registrar-inyeccion`, data)
  },
}
export default cajaAPI
