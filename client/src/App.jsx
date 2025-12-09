import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Páginas
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import MedicamentosPage from "./pages/MedicamentosPage";
import NuevoMedicamentoPage from "./pages/NuevoMedicamentoPage";
import AlertasPage from "./pages/AlertasPage";
import VentasPage from "./pages/VentasPage";
import LaboratoriosPage from "./pages/LaboratoriosPage";

// Componentes
import RutaProtegida from "./components/RutaProtegida";
import RutaAdmin from "./components/RutaAdmin"; // crear este archivo si no lo tenés

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="container mt-5">Cargando...</div>;

  return (
    <Routes>
      {/* PUBLICAS */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />

      {/* PROTEGIDAS */}
      <Route element={<RutaProtegida />}>
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Rutas accesibles a Admin únicamente */}
        <Route element={<RutaAdmin />}>
          <Route path="/laboratorios" element={<LaboratoriosPage />} />
          <Route path="/medicamentos/nuevo" element={<NuevoMedicamentoPage />} />
        </Route>

        {/* Rutas accesibles a Admin y Empleado */}
        <Route path="/medicamentos" element={<MedicamentosPage />} />
        <Route path="/alertas" element={<AlertasPage />} />
        <Route path="/ventas" element={<VentasPage />} />
      </Route>

      {/* fallback: si está autenticado lo mandamos al dashboard, sino al login */}
      <Route
        path="*"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;

