// client/src/components/Navbar.jsx
import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppNavbar = () => {
  const { usuario, logout, isAdmin, isEmpleado } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4 shadow-sm">
      <Container>
        <Navbar.Brand as={NavLink} to="/dashboard" className="fw-bold">
          SGMR Farmacia
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto gap-2">
            <Nav.Link as={NavLink} to="/dashboard">
              Inicio
            </Nav.Link>

            {/* SOLO ADMIN */}
            {isAdmin && (
              <>
                <Nav.Link as={NavLink} to="/alertas">Alertas</Nav.Link>
                <Nav.Link as={NavLink} to="/medicamentos">Medicamentos</Nav.Link>
              </>
            )}

            {/* EMPLEADO Y ADMIN */}
            <Nav.Link as={NavLink} to="/ventas">Ventas</Nav.Link>
          </Nav>

          {/* Usuario a la derecha */}
          <Nav className="align-items-center gap-3 mt-3 mt-lg-0">
            {usuario && (
              <span className="text-light text-center text-lg-start">
                <i className="bi bi-person-circle me-1"></i>
                Hola, <strong>{usuario.nombre}</strong>
                <span className="badge bg-light text-primary ms-2">
                  {usuario.rol?.nombre}
                </span>
              </span>
            )}

            <Button
              variant="outline-light"
              size="sm"
              className="fw-bold"
              onClick={handleLogout}
            >
              Salir
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
