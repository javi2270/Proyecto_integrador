import { Route, Routes, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import RutaProtegida from './components/RutaProtegida'
import RegisterPage from './pages/RegisterPage'
import AlertasPage from './pages/alertasPage'
import MedicamentosPage from './pages/MedicamentosPage'

function App() {
  // Leo el estado de autenticacion desde Context 
  const { isAuthenticated, loading } = useAuth()
  // Manejo de carga ( evita que la app parpadee y muestre el loading por 0.1seg)
  if ( loading ){
    return <div>Cargando...</div>
  }
  // El enrutador principal
  return (
    <Routes>
      {/* Ruta Pública: LOGIN */}
      {/* Si ya estoy logueado, no quiero ver el login, llévame al dashboard */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
      />

      <Route 
        path='/alertas'
        element={<AlertasPage />}
      />

      <Route 
      path="/medicamentos" 
      element={<MedicamentosPage />} />
  
      <Route 
        path="/register"
        element={isAuthenticated ? <Navigate to='/dashboard' /> : <RegisterPage />}
      />

      {/* Grupo de Rutas Protegidas */}
      {/* Este <Route> "envuelve" a las demás. 
        Primero se "dibuja" <RutaProtegida>.
        Si el guardia nos deja pasar (isAuthenticated), dibujará el <Outlet />.
        Y dentro de ese <Outlet /> se dibujará la ruta hija que coincida (ej. /dashboard).
      */}
      <Route element={<RutaProtegida />}> 
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Futuras rutas protegidas irán aquí: */}
        {/* <Route path="/medicamentos" element={<MedicamentosPage />} /> */}
        {/* <Route path="/alertas" element={<AlertasPage />} /> */}
      </Route>

      {/* Redirección por defecto */}
      {/* Si entro a cualquier URL, me redirige a la ruta principal
          que, gracias a la lógica de arriba, será /login o /dashboard. */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}


export default App




