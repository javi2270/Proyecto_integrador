// client/src/pages/DashboardPage.jsx
import React from 'react'
import { useAuth } from '../context/AuthContext' // Asegúrate que este nombre coincida con tu archivo

const DashboardPage = () => {
    // Saco el usuario y la función logout del contexto
    const { usuario, logout } = useAuth()

    const handleLogout = () => {
        console.log("Cerrando sesión..."); // 1. Veremos esto en la consola
        logout(); // 2. Limpiamos el estado y el localStorage
        // 3. Forzamos la ida al login (Esto soluciona cualquier problema de refresco)
        window.location.href = "/login"; 
    }

  return (
    <div className="container mt-5">
        <h1>Bienvenido, {usuario ? usuario.nombre : 'Usuario' }</h1>
        <p className="lead">Página principal del sistema (Dashboard)</p>
        <hr />
        
        {/* Botón  */}
        <button className="btn btn-danger" onClick={handleLogout}>
            Cerrar Sesión
        </button>
    </div>
  )
}

export default DashboardPage