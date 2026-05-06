import { instance } from '../base.api'
const model = 'usuarios'

const usuarioAPI = {
  listarTodos: async () => instance.get(`/${model}/listar/todos`),
  agregar: async (data) => instance.post(`/${model}/agregar`, data),
  actualizarInformacion: async (id, data) =>
    instance.patch(`/${model}/actualizar/informacion/${id}`, data),
  actualizarClave: async (id, clave) =>
    instance.patch(`/${model}/actualizar/clave/${id}`, { clave }),
  eliminar: async (id) => instance.delete(`/${model}/eliminar/${id}`),

  restaurar: async (id) => instance.patch(`/${model}/restaurar/${id}`),
}
export default usuarioAPI
