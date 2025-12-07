import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Row,
  Col,
  Alert,
} from "react-bootstrap";

import {
  getLaboratorios,
  crearLaboratorio,
  eliminarLaboratorio,
} from "../services/laboratorio.service";

const LaboratoriosPage = () => {
  const [laboratorios, setLaboratorios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const cargarLabs = async () => {
    try {
      const data = await getLaboratorios();
      setLaboratorios(data);
    } catch {
      setError("No se pudieron cargar los laboratorios.");
    }
  };

  useEffect(() => {
    cargarLabs();
  }, []);

  const handleGuardar = async () => {
    setError("");
    setMsg("");

    if (!nombre) {
      setError("Debe ingresar un nombre.");
      return;
    }

    try {
      await crearLaboratorio({ nombre });
      setMsg("Laboratorio creado correctamente.");
      setNombre("");
      cargarLabs();
    } catch {
      setError("Error al guardar.");
    }
  };

  const handleEliminar = async (nombre) => {
    if (!window.confirm("¿Seguro que desea eliminar?")) return;

    try {
      await eliminarLaboratorio(nombre);
      setMsg("Laboratorio eliminado.");
      cargarLabs();
    } catch {
      setError("No se pudo eliminar.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Laboratorios</h2>

      {msg && <Alert variant="success">{msg}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            placeholder="Nombre del laboratorio"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </Col>

        <Col md={3}>
          <Button onClick={handleGuardar}>Crear</Button>
        </Col>
      </Row>

      <Table bordered>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {laboratorios.map((l) => (
            <tr key={l._id}>
              <td>{l.nombre}</td>
              <td>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleEliminar(l.nombre)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default LaboratoriosPage;

