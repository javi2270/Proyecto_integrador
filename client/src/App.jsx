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
import UsuariosPage from "./pages/UsuariosPage";
import TemperaturaPage from "./pages/TemperaturaPage";

// Componentes
import RutaProtegida from "./components/RutaProtegida";
import RutaAdmin from "./components/RutaAdmin";

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

        {/* ADMIN */}
        <Route element={<RutaAdmin />}>
          <Route path="/laboratorios" element={<LaboratoriosPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/temperatura" element={<TemperaturaPage />} />
          <Route path="/medicamentos/nuevo" element={<NuevoMedicamentoPage />} />
        </Route>

        {/* ADMIN y EMPLEADO */}
        <Route path="/medicamentos" element={<MedicamentosPage />} />
        <Route path="/alertas" element={<AlertasPage />} />
        <Route path="/ventas" element={<VentasPage />} />
      </Route>

      {/* Rutas inválidas */}
      <Route
        path="*"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;
