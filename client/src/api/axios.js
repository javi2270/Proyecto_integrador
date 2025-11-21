import axios from "axios";

// creo una instancia base
const instance = axios.create({
  baseURL: "/api", // uso el proxy de Vite
  withCredentials: true,
});

// INTERCEPTOR
// antes de enviar cualquier peticion, reviso si hay token y lo pego
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

export default instance
