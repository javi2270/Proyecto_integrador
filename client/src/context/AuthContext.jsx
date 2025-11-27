import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!usuario;

  const isAdmin = usuario?.rol?.nombre === "Administrador";
  const isEmpleado = usuario?.rol?.nombre === "Empleado";

  // 🔐 LOGIN
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    setUsuario(res.data.usuario);

    // Guardar token
    localStorage.setItem("token", res.data.token);
  };

  // 🔓 LOGOUT
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("token");
  };

  // 🔁 Verificar sesión al cargar la app
  useEffect(() => {
    const verificarSesion = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/profile"); 
        setUsuario(res.data);
      } catch (err) {
        setUsuario(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    verificarSesion();
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
