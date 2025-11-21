import axios from "../api/axios";

// Obtengo todos los medicamentos
export const getMedicamentos = async () => {
  // La API tiene la ruta configurada en '/medicamentos/all'
  const response = await axios.get("/medicamentos/all");
  return response.data;
};

// Eliminar mediamentos (solo administradores)
export const deleteMedicamento = async (codigoBarras) => {
  // La API espera el codigo de barras en la URL
  const response = await axios.delete(`/medicamentos/${codigoBarras}`);
  return response.data;
};

// Crear medicamentos
export const createMedicamento = async (datos) => {
  // Hago una peticion POST a /medicamentos, envio el objeto 'datos' con toda la info del form
  const response = axios.post("/medicamentos", datos);
  return response.data;
};
