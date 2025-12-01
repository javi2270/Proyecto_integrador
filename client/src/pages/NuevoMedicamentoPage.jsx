import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createMedicamento } from "../services/medicamento.service";
import { getLaboratorios } from "../services/laboratorio.service";

const NuevoMedicamentoPage = () => {
  const navigate = useNavigate();

  // Estados
  const [laboratorios, setLaboratorios] = useState([]); 
  const [error, setError] = useState("");

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    codigoBarras: "",
    lote: "",
    fechaVencimiento: "",
    stock: 0,
    stockMinimo: 0,
    laboratorio: "", 
  });

  // Cargar laboratorios al iniciar
  useEffect(() => {
    const cargarLabs = async () => {
      try {
        const data = await getLaboratorios();
        setLaboratorios(data);
        // Pre-seleccionar el primero si existe (ayuda visual)
        if(data.length > 0) {
            setFormData(prev => ({...prev, laboratorio: data[0]._id}));
        }
      } catch (err) {
        setError("Error al cargar los laboratorios",err);
      }
    };
    cargarLabs();
  }, []);

  // Manejador de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Enviar Formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.laboratorio) {
      setError("Debes seleccionar un laboratorio.");
      return;
    }

    // Validación rápida de longitud
    if (formData.codigoBarras.length !== 13) {
        setError("El código de barras debe tener 13 dígitos.");
        return;
    }

    try {
      // Aseguramos que stock sean números
      const datosAEnviar = {
          ...formData,
          stock: parseInt(formData.stock),
          stockMinimo: parseInt(formData.stockMinimo)
      };

      await createMedicamento(datosAEnviar);
      alert("¡Medicamento creado con éxito!");
      navigate("/medicamentos"); 
    } catch (err) {
      if (
        err.response?.data?.error?.includes("E11000") ||
        err.response?.data?.message?.includes("duplicate")
      ) {
        setError("Error: Ya existe un medicamento con ese Código de Barras.");
      } else {
        setError(err.response?.data?.message || "Error al crear el medicamento");
      }
    }
  }; 
  
  return (
    <Container className="mt-4 mb-5">
      <Card className="shadow-sm p-3" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h3 className="text-primary mb-3">Registrar Nuevo Medicamento</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Nombre */}
          <Form.Group className="mb-3">
            <Form.Label>Nombre Comercial</Form.Label>
            <Form.Control
              type="text" name="nombre" required
              value={formData.nombre} onChange={handleChange}
            />
          </Form.Group>

          {/* Código */}
          <Form.Group className="mb-3">
            <Form.Label>Código de Barras (13 dígitos)</Form.Label>
            <Form.Control
              type="text" name="codigoBarras" maxLength="13" required
              value={formData.codigoBarras} onChange={handleChange}
            />
          </Form.Group>

          {/* Laboratorio */}
          <Form.Group className="mb-3">
            <Form.Label>Laboratorio</Form.Label>
            <Form.Select
              name="laboratorio" required
              value={formData.laboratorio} onChange={handleChange}
            >
              <option value="">-- Selecciona un Laboratorio --</option>
              {laboratorios.map((lab) => (
                <option key={lab._id} value={lab._id}>
                  {lab.nombre}
                </option>
              ))}
            </Form.Select>
            {laboratorios.length === 0 && (
              <Form.Text className="text-danger">No hay laboratorios cargados.</Form.Text>
            )}
          </Form.Group>

          {/* Filas dobles */}
          <div className="row">
            <div className="col-6">
              <Form.Group className="mb-3">
                <Form.Label>Lote</Form.Label>
                <Form.Control type="text" name="lote" required value={formData.lote} onChange={handleChange} />
              </Form.Group>
            </div>
            <div className="col-6">
              <Form.Group className="mb-3">
                <Form.Label>Vencimiento</Form.Label>
                <Form.Control type="date" name="fechaVencimiento" required value={formData.fechaVencimiento} onChange={handleChange} />
              </Form.Group>
            </div>
          </div>

          <div className="row">
            <div className="col-6">
              <Form.Group className="mb-3">
                <Form.Label>Stock Inicial</Form.Label>
                <Form.Control type="number" name="stock" min="0" required value={formData.stock} onChange={handleChange} />
              </Form.Group>
            </div>
            <div className="col-6">
              <Form.Group className="mb-3">
                <Form.Label>Stock Mínimo</Form.Label>
                <Form.Control type="number" name="stockMinimo" min="0" required value={formData.stockMinimo} onChange={handleChange} />
              </Form.Group>
            </div>
          </div>

          <div className="d-grid gap-2 mt-3">
            <Button variant="primary" size="lg" type="submit">Guardar</Button>
            <Button variant="secondary" onClick={() => navigate("/medicamentos")}>Cancelar</Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default NuevoMedicamentoPage;