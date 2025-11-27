import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Alert,
  Spinner,
} from "react-bootstrap";

import { getMedicamentos } from "../services/medicamento.service";
import { crearVenta, getVentas } from "../services/venta.service";

const VentasPage = () => {
  // estados para IU
  const [medicamentos, setMedicamentos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // estado del formulario
  const [form, setForm] = useState({
    medicamentoCodigo: "",
    cantidad: 1,
    motivo: "",
  });

  // estado para mensajes
  const [successMsg, setSuccessMsg] = useState("");

  // cargar medicamentos + ventas al iniciar
  useEffect(() => {
    cargarInicial();
  }, []);

  const cargarInicial = async () => {
    try {
      setLoading(true);
      const meds = await getMedicamentos();
      setMedicamentos(meds);

      const ventasResp = await getVentas();
      setVentas(ventasResp);
    } catch (err) {
      console.error(err);
      setError("Error al cargar datos.");
    } finally {
      setLoading(false);
    }
  };

  // manejo de campos del formulario — AQUÍ ESTABA TU ERROR
  const handleChange = (e) => {
    const { name, value } = e.target; // ← CORRECTO
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validarFormulario = () => {
    if (!form.medicamentoCodigo) {
      setError("Seleccioná un medicamento.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!validarFormulario()) return;

    try {
      await crearVenta({
        identificador: form.medicamentoCodigo, // backend usa este campo
        cantidad: Number(form.cantidad),
        motivo: form.motivo || "Venta",
      });

      setSuccessMsg("Venta registrada correctamente.");
      setForm({ medicamentoCodigo: "", cantidad: 1, motivo: "" });

      await cargarInicial(); // recargar stock y ventas
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Error al registrar la venta.";
      setError(msg);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Registrar Venta</h2>

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}

      {successMsg && (
        <Alert variant="success" onClose={() => setSuccessMsg("")} dismissible>
          {successMsg}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Medicamento</Form.Label>
              <Form.Select
                name="medicamentoCodigo"
                value={form.medicamentoCodigo}
                onChange={handleChange}
              >
                <option value="">-- Seleccioná --</option>
                {medicamentos.map((m) => (
                  <option key={m._id} value={m.codigoBarras}>
                    {m.nombre} — stock: {m.stock}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="cantidad"
                min="1"
                value={form.cantidad}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Motivo (opcional)</Form.Label>
              <Form.Control
                type="text"
                name="motivo"
                placeholder="Ej: Venta mostrador"
                value={form.motivo}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="success" type="submit">
              Registrar Venta
            </Button>
          </Form>
        </Col>

        <Col md={6}>
          <h5>Últimas ventas</h5>
          <small className="text-muted">
            Las más recientes aparecen primero
          </small>

          <Table striped bordered hover size="sm" className="mt-2">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Medicamento</th>
                <th>Código</th>
                <th>Cantidad</th>
                <th>Usuario</th>
              </tr>
            </thead>

            <tbody>
              {ventas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No hay ventas registradas.
                  </td>
                </tr>
              ) : (
                ventas.map((v) => (
                  <tr key={v._id}>
                    <td>{new Date(v.fecha || v.createdAt).toLocaleString()}</td>
                    <td>{v.medicamento?.nombre || "—"}</td>
                    <td>{v.medicamento?.codigoBarras || "—"}</td>
                    <td>{v.cantidad}</td>
                    <td>{v.usuario?.email || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default VentasPage;
