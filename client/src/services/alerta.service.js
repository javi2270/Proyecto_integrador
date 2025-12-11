import api from "./api";

// Obtener alertas activas
export const getAlertasActivas = async () => {
  const res = await api.get("/alerta");
  return res.data;
};

// Marcar alerta como leida
export const marcarComoLeida = async (id) => {
  const res = await api.patch(`/alerta/${id}/leida`);
  return res.data;
};


