import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!usuario;
  const isAdmin = usuario?.rol?.nombre === "Administrador";
  const isEmpleado = usuario?.rol?.nombre === "Empleado";

  // LOGIN
  const login = async (email, password) => {
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);

      // Obtener perfil para consistencia
      const perfil = await api.get("/auth/profile");
      setUsuario(perfil.data);
    } catch (error) {
      // Si falla el login, limpiamos estado y propagamos el error
      localStorage.removeItem("token");
      setUsuario(null);
      throw error;
    } finally {
      // IMPORTANTE: evitar loading infinito
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
  };

  // Verificación automática de sesión
  useEffect(() => {
    const verificar = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/profile");
        setUsuario(res.data);
      } catch (err) {
        localStorage.removeItem("token");
        setUsuario(null);
      } finally {
        setLoading(false);
      }
    };

    verificar();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAuthenticated,
        loading,
        login,
        logout,
        isAdmin,
        isEmpleado,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
