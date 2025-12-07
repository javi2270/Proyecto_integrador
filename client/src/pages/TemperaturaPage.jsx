import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { registrarTemperatura } from "../services/temperatura.service";

const TemperaturaPage = () => {
  const [valor, setValor] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setMsg("");
    setError("");

    if (!valor) return setError("Ingrese un valor.");

    try {
      const res = await registrarTemperatura(Number(valor));
      setMsg("Temperatura registrada correctamente.");
      setValor("");
    } catch (err) {
      setError("No se pudo registrar.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Registro de Temperatura</h2>

      {msg && <Alert variant="success">{msg}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Valor en °C</Form.Label>
        <Form.Control
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
      </Form.Group>

      <Button onClick={handleSubmit}>Registrar</Button>
    </Container>
  );
};

export default TemperaturaPage;
