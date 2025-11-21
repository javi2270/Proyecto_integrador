import React, { useState, useEffect } from "react";
import { getAlertas, marcarAlertaLeida } from "../services/alerta.service";
import { Alert, Button, Container, Spinner } from "react-bootstrap";

const AlertasPage = () => {
  // memoria (estados)
  const [alertas, setAlertas] = useState([]); // lista de alertas
  const [loading, setLoading] = useState(true); // Esta cargando??
  const [error, setError] = useState(null); // hubo error??

  // Accion inicial (Effect), se ejecuta una sola vez al entrar a la pagina
  useEffect(() => {
    cargarAlertas();
  }, []);

  // Funcion para pedir los datos al service
  const cargarAlertas = async () => {
    try {
      setLoading(true); // enciendo Spinner
      const data = await getAlertas(); // pido datos
      setAlertas(data); // guardo datos
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las alertas.");
    } finally {
      setLoading(false); // apago Spinner (siempre)
    }
  };

  // Funcion para marcar como leida
  const handleMarcarLeida = async (id) => {
    try {
      await marcarAlertaLeida(id); // Aviso a la API
      cargarAlertas(); // Recargo la lista para ver los cambios
    } catch (err) {
      alert(`Error: ${err}.. Error al actualizar la alerta.`);
    }
  };

  // Si está cargando, mostramos un spinner girando
  if (loading)
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  // Si hubo error, mostramos un cartel rojo
  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  // Si todo está bien, mostramos la lista
  return (
    <Container className="mt-4">
      <h2 className="mb-4">Panel de Alertas</h2>

      {/* Si no hay alertas, mostramos cartel verde */}
      {alertas.length === 0 ? (
        <Alert variant="success">
          ¡Todo en orden! No hay alertas pendientes.
        </Alert>
      ) : (
        /* Si hay alertas, las recorremos con .map() */
        <div className="d-flex flex-column gap-3">
          {alertas.map((alerta) => (
            <Alert
              key={alerta._id}
              variant={obtenerVariante(alerta.tipo)} // Color según tipo
              className="d-flex justify-content-between align-items-center shadow-sm"
            >
              <div>
                <strong>{alerta.tipo}:</strong> {alerta.mensaje}
                {/* Si es sobre un medicamento, mostramos detalle */}
                {alerta.medicamento && (
                  <div className="text-muted small mt-1">
                    Medicamento: {alerta.medicamento.nombre}
                  </div>
                )}
                <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                  {new Date(alerta.createdAt).toLocaleString()}
                </div>
              </div>

              <Button
                variant="outline-dark"
                size="sm"
                onClick={() => handleMarcarLeida(alerta._id)}
              >
                Marcar Leída
              </Button>
            </Alert>
          ))}
        </div>
      )}
    </Container>
  );
};

// funcion auxiliar para los colores
const obtenerVariante = (tipo) => {
  if (tipo === "Bajo Stock") return "warning"; // Amarillo
  if (tipo === "Vencimiento Proximo") return "danger"; // Rojo
  if (tipo === "Registro Temperatura") return "info"; //Azul
  return "secondary"; // Gris
};

export default AlertasPage;
