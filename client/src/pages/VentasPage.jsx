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

import { getAllMedicamentos } from "../services/medicamento.service";
import { 
  getVentas, 
  registrarVenta, 
  getVentasByMedicamento,
} from "../services/venta.service";

const VentasPage = () => {
  const [ventas, setVentas] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);

  const [identificador, setIdentificador] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("");

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const cargarDatos = async () => {
    try {
      const v = await getVentas();
      const m = await getAllMedicamentos();
      setVentas(v);
      setMedicamentos(m);
    } catch {
      setError("No se pudieron cargar las ventas.");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleRegistrar = async () => {
    setError("");
    setMsg("");

    if (!identificador || !cantidad || !motivo.trim()) {
      setError("Debe seleccionar medicamento, cantidad y motivo.");
      return;
    }

    try {
      await registrarVenta({
        identificador,
        cantidad: Number(cantidad),
        motivo,
      });

      setMsg("Venta registrada correctamente.");
      setCantidad("");
      setIdentificador("");
      setMotivo("");

      cargarDatos();
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo registrar la venta.");
    }
  };

  const buscarPorMedicamento = async () => {
    setError("");

    if (!identificador) return;

    try {
      const data = await getVentasByMedicamento(identificador);
      setVentas(data);
    } catch {
      setError("No se encontraron ventas.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Ventas</h2>

      {msg && <Alert variant="success">{msg}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        {/* Selector medicamento */}
        <Col md={3}>
          <Form.Select
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
          >
            <option value="">Seleccionar medicamento</option>
            {medicamentos.map((m) => (
              <option key={m._id} value={m.codigoBarras}>
                {m.nombre} ({m.codigoBarras})
              </option>
            ))}
          </Form.Select>
        </Col>

        {/* Cantidad */}
        <Col md={2}>
          <Form.Control
            type="number"
            placeholder="Cantidad"
            value={cantidad}
            min="1"
            onChange={(e) => setCantidad(e.target.value)}
          />
        </Col>

        {/* Motivo */}
        <Col md={3}>
          <Form.Control
            placeholder="Motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </Col>

        {/* Botón registrar */}
        <Col md={2}>
          <Button onClick={handleRegistrar}>Registrar Venta</Button>
        </Col>

        {/* Buscar */}
        <Col md={2}>
          <Button variant="secondary" onClick={buscarPorMedicamento}>
            Buscar Ventas
          </Button>
        </Col>
      </Row>

      {/* Tabla */}
      <Table bordered hover>
        <thead>
          <tr>
            <th>Medicamento</th>
            <th>Código</th>
            <th>Cantidad</th>
            <th>Fecha</th>
            <th>Vendido por</th>
          </tr>
        </thead>

        <tbody>
          {ventas.map((v) => (
            <tr key={v._id}>
              <td>{v.medicamento?.nombre}</td>
              <td>{v.medicamento?.codigoBarras}</td>
              <td>{v.cantidad}</td>
              <td>{new Date(v.fecha).toLocaleString()}</td>
              <td>{v.usuario?.nombre}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default VentasPage;
