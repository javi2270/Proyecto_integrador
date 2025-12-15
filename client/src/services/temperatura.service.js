import api from "./api";

export const registrarTemperatura = async (valor) => {
  const res = await api.post("/temperatura", { valor });
  return res.data;
};

export const getTemperaturaMes = async () => {
  const res = await api.get("/temperatura/mes");
  return res.data;
};
