import api from "./api";

// Obtener todos
export const getLaboratorios = async () => {
  const res = await api.get("/laboratorio");
  return res.data;
};

// Crear laboratorio
export const crearLaboratorio = async (data) => {
  const res = await api.post("/laboratorio", data);
  return res.data;
};

// Eliminar laboratorio por nombre
export const eliminarLaboratorio = async (nombre) => {
  const res = await api.delete(`/laboratorio/${nombre}`);
  return res.data;
};
