import React, { useEffect, useState } from "react";
import {
  getAlertasActivas,
  marcarComoLeida
} from "../services/alerta.service";

const AlertasPage = () => {
  const [alertas, setAlertas] = useState([]);

  const cargarAlertas = async () => {
    try {
      const data = await getAlertasActivas();
      setAlertas(data);
    } catch (error) {
      console.error("Error al cargar alertas:", error);
    }
  };

  const marcarUna = async (id) => {
    try {
      await marcarComoLeida(id);
      cargarAlertas();
    } catch (error) {
      console.error("Error al marcar alerta:", error);
    }
  };

  useEffect(() => {
    cargarAlertas();
  }, []);

  return (
    <div>
      <h2>Alertas Activas</h2>

      {alertas.length === 0 ? (
        <p>No hay alertas activas.</p>
      ) : (
        alertas.map((alerta) => (
          <div key={alerta._id} className="alert alert-warning mt-2">
            <strong>{alerta.tipo}:</strong> {alerta.mensaje}
            <br />
            {alerta.medicamento && (
              <small>Medicamento: {alerta.medicamento.nombre}</small>
            )}
            <button
              className="btn btn-sm btn-success d-block mt-3"
              onClick={() => marcarUna(alerta._id)}
            >
              Marcar como leída
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AlertasPage;
