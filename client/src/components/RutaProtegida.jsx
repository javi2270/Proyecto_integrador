import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppNavbar from "./Navbar";

const RutaProtegida = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="container mt-5">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <AppNavbar />
      <div className="container fade-in">
        <Outlet />
      </div>
    </>
  );
};

export default RutaProtegida;
