// client/src/components/RutaProtegida.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import AppNavbar from './Navbar'; // Importamos la Navbar

const RutaProtegida = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="container mt-5">Cargando...</div>;
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <>
      {/* 1. La Barra de Navegación arriba */}
      <AppNavbar />
      
      {/* 2. El contenido de la página (Dashboard, Alertas, etc.) */}
      <div className="container fade-in"> 
        <Outlet />
      </div>
    </>
  );
};

export default RutaProtegida;
