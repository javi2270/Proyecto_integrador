import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RutaAdmin = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RutaAdmin;
