import api from "../api/axios";

const API_URL = "/api"; // Por si lo usas después, aunque api ya incluye /api

// =========================
//  Obtener todos los medicamentos
// =========================
export const getMedicamentos = async () => {
  try {
    const response = await api.get("/medicamentos/all"); // ✔ Ruta correcta
    return response.data;
  } catch (error) {
    console.error("Error al obtener medicamentos:", error);
    throw error;
  }
};

// =========================
//  Crear medicamento
// =========================
export const createMedicamento = async (datos) => {
  try {
    const response = await api.post("/medicamentos", datos);
    return response.data;
  } catch (error) {
    console.error("Error al crear medicamento:", error);
    throw error;
  }
};

// =========================
//  Eliminar medicamento (soft delete)
// =========================
export const deleteMedicamento = async (codigoBarras) => {
  try {
    const response = await api.delete(`/medicamentos/${codigoBarras}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar medicamento:", error);
    throw error;
  }
};

// =========================
//  Agregar stock
// =========================
export const addStock = async (codigoBarras, cantidad) => {
  try {
    const response = await api.post(
      `/medicamentos/${codigoBarras}/ingreso-stock`,
      { cantidad: Number(cantidad) }
    );
    return response.data;
  } catch (error) {
    console.error("Error al agregar stock:", error);
    throw error;
  }
};
