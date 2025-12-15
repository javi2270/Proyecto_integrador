import api from "./api";

// Obtener todos los usuarios (solo admin)
export const getUsuarios = async () => {
  const res = await api.get("/usuario");
  return res.data;
};

// Cambiar rol de un usuario (solo admin)
export const cambiarRol = async (usuarioId, rolId) => {
  const res = await api.put(`/usuario/${usuarioId}/rol`, {
    rolId
  });
  return res.data;
};
