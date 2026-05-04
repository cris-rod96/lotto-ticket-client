import { instance } from '../base.api'

const model = 'suertes'

const suerteAPI = {
  agregar: (data) => {
    return instance.post(`/${model}/agregar`, data)
  },

  listarTodas: () => {
    return instance.get(`/${model}/listar/todas`)
  },

  actualizarPremio: (id, data) => {
    return instance.patch(`/${model}/actualizar/premio/${id}`, data)
  },

  eliminar: (id) => {
    return instance.delete(`/${model}/eliminar/${id}`)
  },
}

export default suerteAPI
