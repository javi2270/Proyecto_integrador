import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

const IngresoStockModal = ({ show, handleClose, medicamento, onGuardar }) => {
  const [cantidad, setCantidad] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!cantidad || cantidad <= 0) {
      setError("Por favor ingresa una cantidad válida.");
      return;
    }

    onGuardar(medicamento.codigoBarras, Number(cantidad));

    setCantidad("");
    setError("");
    handleClose();
  };

  if (!medicamento) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Ingreso de Mercadería</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          Estás agregando stock para: <strong>{medicamento.nombre}</strong>
        </p>
        <p className="text-muted small">Stock actual: {medicamento.stock}</p>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group>
          <Form.Label>Cantidad a ingresar:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ej: 10"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            autoFocus
            min="1"
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Confirmar Ingreso
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default IngresoStockModal;
