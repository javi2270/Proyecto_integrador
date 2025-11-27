import api from "../api/axios";

const API_URL = "/auth"; 
// OJO: axios ya tiene baseURL="/api", por eso acá NO se pone /api/auth

export const loginService = async (email, password) => {
  const response = await api.post(`${API_URL}/login`, {
    email,
    password,
  });

  if (response.data) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
  }

  return response.data;
};

export const registerService = async (nombre, email, password) => {
  const response = await api.post(`${API_URL}/register`, {
    nombre,
    email,
    password,
  });

  return response.data;
};

export const logoutService = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};
