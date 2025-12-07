import api from "./api";

export const getAllMedicamentos = async () => {
  const res = await api.get("/medicamentos/all");
  const data = res.data;

  console.log("DEBUG getAllMedicamentos →", data);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.medicamentos)) return data.medicamentos;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};

export const getMedicamento = async (codigoBarras) => {
  const res = await api.get(`/medicamentos?codigoBarras=${codigoBarras}`);
  return res.data;
};

export const createMedicamento = async (data) => {
  const res = await api.post("/medicamentos", data);
  return res.data;
};

export const updateMedicamento = async (codigoBarras, data) => {
  const res = await api.put(`/medicamentos/${codigoBarras}`, data);
  return res.data;
};

export const deleteMedicamento = async (codigoBarras) => {
  const res = await api.delete(`/medicamentos/${codigoBarras}`);
  return res.data;
};

export const addStock = async (codigoBarras, cantidad) => {
  const res = await api.post(`/medicamentos/${codigoBarras}/ingreso-stock`, {
    cantidad: Number(cantidad),
  });
  return res.data;
};
