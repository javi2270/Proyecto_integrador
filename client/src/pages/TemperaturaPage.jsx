import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import {
  registrarTemperatura,
  getTemperaturaMes
} from "../services/temperatura.service";

const TemperaturaPage = () => {
  const [valor, setValor] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [registroMes, setRegistroMes] = useState(null);

  const cargarTemperaturaMes = async () => {
    try {
      const data = await getTemperaturaMes();
      if (data.temperaturaRegistrada) {
        setRegistroMes(data.registro);
      } else {
        setRegistroMes(null);
      }
    } catch (err) {
      console.error("Error al obtener temperatura mensual", err);
    }
  };

  useEffect(() => {
    cargarTemperaturaMes();
  }, []);

  const handleSubmit = async () => {
    setMsg("");
    setError("");

    try {
      await registrarTemperatura(Number(valor));
      setMsg("Temperatura registrada correctamente.");
      setValor("");
      cargarTemperaturaMes();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Error al registrar la temperatura."
      );
    }
  };

  return (
    <Container className="mt-4">
      <h2>Registro de Temperatura Mensual</h2>

      {registroMes && (
        <Alert variant="info">
          Temperatura registrada el{" "}
          {new Date(registroMes.createdAt).toLocaleDateString()} —{" "}
          <strong>{registroMes.valor} °C</strong>
        </Alert>
      )}

      {msg && <Alert variant="success">{msg}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {!registroMes && (
        <Form.Group className="mb-3">
          <Form.Label>Valor en °C</Form.Label>
          <Form.Control
            type="number"
            min="2"
            max="8"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </Form.Group>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!!registroMes || !valor}
      >
        Registrar
      </Button>

      {registroMes && (
        <Alert className="mt-3" variant="secondary">
          Ya existe un registro de temperatura para este mes.
        </Alert>
      )}
    </Container>
  );
};

export default TemperaturaPage;
