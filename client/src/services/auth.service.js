import axios from "axios";

const API_URL = "/api/auth";

// Funcion para iniciar sesion

export const loginService = async (email, password) => {
  // uso axios para hacer un POST a la ruta /api/auth/login
  // le envio el email y la contraseña que el usuario escribio
  const response = await axios.post(`${API_URL}/login`, {
    email: email,
    password: password,
  });
  // si la API me devuelve datos
  if (response.data) {
    // guardo el token y el usuario en el localStorage del navegador
    // uso el JSON.stringify para convertir el objeto "usuario" en texto
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
  }
  // devulvo la respuesta que incluye el token y el usuario
  return response.data;
};

export const registerService = async (nombre, email, password) => {
  // hago un POST a /api/auth/register y le paso los tres campos que espera la api	
	const response = await axios.post(`${API_URL}/register`, {
		nombre,
		email,
		password
	})
	return response.data
};

// Funcion para cerrar sesion

export const logoutService = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};
