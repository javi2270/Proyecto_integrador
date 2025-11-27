// client/src/App.jsx
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RutaProtegida from "./components/RutaProtegida";
import RegisterPage from "./pages/RegisterPage";
import AlertasPage from "./pages/AlertasPage";
import MedicamentosPage from "./pages/MedicamentosPage";
import NuevoMedicamentoPage from "./pages/NuevoMedicamentoPage";
import VentasPage from "./pages/VentasPage";

function App() {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  if (loading) return <div>Cargando...</div>;

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />
        }
      />

      {/* Rutas protegidas */}
      <Route element={<RutaProtegida />}>
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* SOLO ADMIN */}
        <Route
          path="/medicamentos"
          element={
            isAdmin ? <MedicamentosPage /> : <Navigate to="/dashboard" />
          }
        />
        <Route
          path="/medicamentos/nuevo"
          element={
            isAdmin ? <NuevoMedicamentoPage /> : <Navigate to="/dashboard" />
          }
        />

        {/* ADMIN + EMPLEADO */}
        <Route path="/ventas" element={<VentasPage />} />
        <Route path="/alertas" element={<AlertasPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
