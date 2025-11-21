import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  getMedicamentos,
  deleteMedicamento,
} from "../services/medicamento.service";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MedicamentosPage = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Hooks
  const { usuario } = useAuth();
  const navigate = useNavigate();

  // Verifico si es admin para mostrar las opciones extra
  const esAdmin = usuario?.rol?.nombre === "Administrador";

  // Cargo datos al inicias
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await getMedicamentos();
      setMedicamentos(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar el inventario.");
    } finally {
      setLoading(false);
    }
  };

  // Funcion para eliminar
  const handleDelete = async (codigoBarras) => {
    if (
      window.confirm(
        "¿Estas seguro que quieres eliminar el medicamento?. Esta accion no se puede deshacer."
      )
    ) {
      try {
        await deleteMedicamento(codigoBarras);
        cargarDatos(); // recargo la lista para ver que se desaparecio
      } catch (err) {
        alert(
          "Error al eliminar:  " +
            (err.response?.data?.message || "Intente nuevamente.")
        );
      }
    }
  };

  if (loading)
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Inventario de Medicamentos</h2>

        {/* Solo el Admin puede ver el botón de crear */}
        {esAdmin && (
          <Button
            variant="success"
            onClick={() => navigate("/medicamentos/nuevo")}
          >
            + Nuevo Medicamento
          </Button>
        )}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {medicamentos.length === 0 ? (
        <Alert variant="info">
          No hay medicamentos registrados en el sistema.
        </Alert>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm bg-white">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Código</th>
              <th>Laboratorio</th>
              <th>Stock</th>
              <th>Vencimiento</th>
              {esAdmin && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {medicamentos.map((med) => (
              <tr key={med._id}>
                <td className="fw-bold">{med.nombre}</td>
                <td>{med.codigoBarras}</td>
                {/* Si poblamos el laboratorio mostramos el nombre, sino 'N/A' */}
                <td>{med.laboratorio?.nombre || "N/A"}</td>
                <td>
                  {/* Badge rojo si está bajo de stock */}
                  <Badge
                    bg={med.stock <= med.stockMinimo ? "danger" : "success"}
                  >
                    {med.stock} u.
                  </Badge>
                </td>
                <td>{new Date(med.fechaVencimiento).toLocaleDateString()}</td>

                {esAdmin && (
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(med.codigoBarras)}
                    >
                      Eliminar
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default MedicamentosPage;
