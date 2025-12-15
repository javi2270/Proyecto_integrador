import api from "./api";

export const registrarTemperatura = (valor) => {
  return api.post("/temperatura", { valor });
};
