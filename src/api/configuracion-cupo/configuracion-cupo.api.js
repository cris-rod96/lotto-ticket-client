import { instance } from "../base.api";
const model = "cupo-jornadas";

const configuracionCupoAPI = {
  registrarConfiguracion: (data) => {
    return instance.post(`/${model}/registrar`, data);
  },
  actualizar: (id, data) => {
    return instance.patch(`/${model}/actualizar/${id}`, data);
  },

  listarTodos: () => {
    return instance.get(`/${model}/listar/todos`);
  },
};

export default configuracionCupoAPI;
