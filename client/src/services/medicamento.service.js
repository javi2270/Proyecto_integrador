import api from "./api";

export const getAllMedicamentos = async () => {
  const res = await api.get("/medicamento/all");
  const data = res.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.medicamentos)) return data.medicamentos;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};

export const getMedicamento = async (codigoBarras) => {
  const res = await api.get(`/medicamento?codigoBarras=${codigoBarras}`);
  return res.data;
};

export const createMedicamento = async (data) => {
  const res = await api.post("/medicamento", data);
  return res.data;
};

export const updateMedicamento = async (codigoBarras, data) => {
  const res = await api.put(`/medicamento/${codigoBarras}`, data);
  return res.data;
};

export const deleteMedicamento = async (codigoBarras) => {
  const res = await api.delete(`/medicamento/${codigoBarras}`);
  return res.data;
};

export const addStock = async (codigoBarras, cantidad) => {
  const res = await api.post(`/medicamento/${codigoBarras}/ingreso-stock`, {
    cantidad: Number(cantidad),
  });
  return res.data;
};
