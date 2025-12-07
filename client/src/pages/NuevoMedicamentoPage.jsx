import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createMedicamento } from "../services/medicamento.service";
import { getLaboratorios } from "../services/laboratorio.service";

const NuevoMedicamentoPage = () => {
  const navigate = useNavigate();

  const [laboratorios, setLaboratorios] = useState([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    codigoBarras: "",
    lote: "",
    fechaVencimiento: "",
    stock: 0,
    stockMinimo: 0,
    laboratorio: "",
  });

  useEffect(() => {
    cargarLaboratorios();
  }, []);

  const cargarLaboratorios = async () => {
    try {
      const data = await getLaboratorios();
      setLaboratorios(data);
    } catch (err) {
      setError("No se pudieron cargar los laboratorios.");
    }
  };

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createMedicamento(formData);
      alert("Medicamento creado correctamente.");
      navigate("/medicamentos");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Error al crear el medicamento. Revisa los campos.";
      setError(msg);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "600px" }}>
      <Card className="p-4 shadow">
        <h3 className="mb-3">Nuevo Medicamento</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Código de barras (13 dígitos)</Form.Label>
            <Form.Control
              name="codigoBarras"
              type="text"
              value={formData.codigoBarras}
              onChange={handleChange}
              maxLength="13"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Lote</Form.Label>
            <Form.Control
              name="lote"
              type="text"
              value={formData.lote}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha de vencimiento</Form.Label>
            <Form.Control
              name="fechaVencimiento"
              type="date"
              value={formData.fechaVencimiento}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock inicial</Form.Label>
            <Form.Control
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock mínimo</Form.Label>
            <Form.Control
              name="stockMinimo"
              type="number"
              value={formData.stockMinimo}
              onChange={handleChange}
              min="0"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Laboratorio</Form.Label>
            <Form.Select
              name="laboratorio"
              value={formData.laboratorio}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona...</option>
              {laboratorios.map((lab) => (
                <option key={lab._id} value={lab._id}>
                  {lab.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button type="submit" className="w-100">
            Guardar Medicamento
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default NuevoMedicamentoPage;
