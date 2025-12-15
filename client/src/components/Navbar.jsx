import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navbar as BSNavbar, Nav, Container, Button } from "react-bootstrap";

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const esAdmin = usuario?.rol?.nombre === "Administrador";

  return (
    <BSNavbar bg="dark" variant="dark" expand="lg">
      <Container>

        <BSNavbar.Brand as={Link} to="/dashboard">
          SGMR
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="nav" />

        <BSNavbar.Collapse id="nav">
          <Nav className="me-auto">

            {usuario && (
              <>
                <Nav.Link as={Link} to="/medicamentos">Medicamentos</Nav.Link>
                <Nav.Link as={Link} to="/ventas">Ventas</Nav.Link>
                <Nav.Link as={Link} to="/alertas">Alertas</Nav.Link>

                {esAdmin && (
                  <>
                    <Nav.Link as={Link} to="/laboratorios">Laboratorios</Nav.Link>
                    <Nav.Link as={Link} to="/usuarios">Usuarios</Nav.Link>
                    <Nav.Link as={Link} to="/temperatura">Temperatura</Nav.Link>
                  </>
                )}
              </>
            )}

          </Nav>

          <Nav>
            {!usuario ? (
              <>
                <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
                <Nav.Link as={Link} to="/register">Registrarse</Nav.Link>
              </>
            ) : (
              <>
                <span
                  style={{
                    color: "white",
                    marginRight: "10px",
                    fontWeight: "500",
                  }}
                >
                  {usuario.nombre}
                  {usuario.rol?.nombre && ` (${usuario.rol.nombre})`}
                </span>

                <Button variant="outline-light" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </>
            )}
          </Nav>

        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;
