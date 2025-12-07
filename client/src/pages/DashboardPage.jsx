// client/src/pages/DashboardPage.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

const DashboardPage = () => {
  const { usuario } = useAuth();

  return (
    <div className="mt-4">
      <h2>Panel</h2>

      <Card className="my-3 p-3 shadow-sm">
        <h5>Bienvenido</h5>

        <p>
          <strong>{usuario?.nombre || "Usuario"}</strong>
          {usuario?.rol?.nombre && ` — ${usuario.rol.nombre}`}
        </p>

        <div className="d-flex flex-wrap gap-2 mt-3">
          <Button as={Link} to="/medicamentos" variant="primary">
            Ver Medicamentos
          </Button>

          <Button as={Link} to="/alertas" variant="warning">
            Ver Alertas
          </Button>

          <Button as={Link} to="/ventas" variant="success">
            Ventas
          </Button>
        </div>
      </Card>

      <p className="text-muted">Accedé a las secciones según tu rol.</p>
    </div>
  );
};

export default DashboardPage;
