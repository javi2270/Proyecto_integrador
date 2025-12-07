import api from "./api";

// Obtener alertas activas
export const getAlertasActivas = async () => {
  const res = await api.get("/alerta");
  return res.data;
};

// Marcar UNA alerta como leída
export const marcarComoLeida = async (id) => {
  const res = await api.patch(`/alerta/${id}/leida`);
  return res.data;
};

//// Marcar TODAS las alertas de un tipo como leídas
//export const marcarTodasPorTipo = async (tipo) => {
//  return await api.patch(`/alertas/tipo/${tipo}/leidas`);
//};

