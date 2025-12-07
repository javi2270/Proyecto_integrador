import api from "./api";

const API_URL = "/auth";

export const loginService = async (email, password) => {
  const res = await api.post(`${API_URL}/login`, { email, password });
  return res.data;
};

export const registerService = async (nombre, email, password) => {
  const res = await api.post(`${API_URL}/register`, {
    nombre,
    email,
    password,
  });
  return res.data;
};
