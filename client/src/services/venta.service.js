import api from "./api";

// Obtener todas las ventas
export const getVentas = async () => {
  const res = await api.get("/venta");
  return res.data;
};

// Registrar una venta
export const registrarVenta = async ({ identificador, cantidad, motivo }) => {
  const res = await api.post("/venta", {
    identificador,
    cantidad,
    motivo,
  });
  return res.data;
};

// Obtener ventas por medicamento
export const getVentasByMedicamento = async (identificador) => {
  const res = await api.get(`/venta/${identificador}`);
  return res.data;
};
