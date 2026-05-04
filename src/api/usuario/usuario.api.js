import { instance } from '../base.api'
const model = 'usuarios'

const usuarioAPI = {
  listarTodos: () => instance.get(`/${model}/listar/todos`),
  agregar: (data) => instance.post(`/${model}/agregar`, data),
  actualizarInformacion: (id, data) =>
    instance.patch(`/${model}/actualizar/informacion/${id}`, data),
  actualizarClave: (id, clave) => instance.patch(`/${model}/actualizar/clave/${id}`, { clave }),
  eliminar: (id) => instance.delete(`/${model}/eliminar/${id}`),
}
export default usuarioAPI
