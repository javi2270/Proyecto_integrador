// client/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginService, logoutService } from '../services/auth.service';

const AuthContext = createContext();


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
    
    // Estados
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Efecto
    useEffect( () => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('usuario');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUsuario(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    // Login
    const login = async (email, password) => {
        try {
            const data = await loginService(email, password);
            setUsuario(data.usuario);
            setToken(data.token);
            setIsAuthenticated(true); 
            localStorage.setItem('token', data.token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));

        } catch (error) {
            setUsuario(null);
            setToken(null);
            setIsAuthenticated(false);
            throw error;
        }
    };

    // Logout
    const logout = () => {
        logoutService(); 
        setUsuario(null);
        setToken(null);
        setIsAuthenticated(false); 
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    };

    return (
        <AuthContext.Provider value={{
            usuario,
            token,
            isAuthenticated, 
            loading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}