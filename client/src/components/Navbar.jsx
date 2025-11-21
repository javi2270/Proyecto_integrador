// client/src/components/Navbar.jsx
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppNavbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Forzamos la redirección al salir
  }

  return (
    // 'expand="lg"' hace que el menú se colapse en celulares (Diseño Responsivo)
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4 shadow-sm">
      <Container fluid>
        {/* Marca del sitio */}
        <Navbar.Brand as={NavLink} to="/dashboard" className="fw-bold">
          SGMR Farmacia
        </Navbar.Brand>
        
        {/* Botón hamburguesa para móviles */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        {/* Contenido colapsable */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Enlaces de Navegación con NavLink para estado activo */}
            <Nav.Link as={NavLink} to="/dashboard" end>
              Inicio
            </Nav.Link>
            
            {/* Futuros enlaces */}
             <Nav.Link as={NavLink} to="/alertas">Alertas</Nav.Link>
             <Nav.Link as={NavLink} to="/medicamentos">Medicamentos</Nav.Link>
          </Nav>

          {/* Lado Derecho: Info Usuario y Logout */}
          <Nav className="align-items-center gap-3 mt-2 mt-lg-0">
            {usuario && (
              <span className="text-light">
                <i className="bi bi-person-circle me-2"></i>
                Hola, <strong>{usuario.nombre}</strong>
                {/* Mostramos el rol en pequeño */}
                <span className="badge bg-light text-primary ms-2" style={{fontSize: '0.7em'}}>
                  {usuario.rol?.nombre}
                </span>
              </span>
            )}
            <Button 
                variant="outline-light" 
                size="sm" 
                onClick={handleLogout}
                className="fw-bold"
            >
              Salir
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container >
    </Navbar>
  );
};

export default AppNavbar;