import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
// Importamos los servicios
import {
  getMedicamentos,
  deleteMedicamento,
  addStock,
} from "../services/medicamento.service";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// IMPORTAMOS EL MODAL
import IngresoStockModal from "../components/IngresoStockModal";

const MedicamentosPage = () => {
  // Estados de datos
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- (Los Hooks) ---
  const [showModal, setShowModal] = useState(false);      // Controla si se ve la ventana
  const [selectedMed, setSelectedMed] = useState(null);   // Controla qué medicamento se edita
  // -----------------------------------------------

  // Hooks de router y auth
  const { usuario } = useAuth();
  const navigate = useNavigate();

  // Verifico si es admin
  const esAdmin = usuario?.rol?.nombre === "Administrador";

  // Cargar datos al iniciar
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
        cargarDatos();
      } catch (err) {
        alert(
          "Error al eliminar:  " +
            (err.response?.data?.message || "Intente nuevamente.")
        );
      }
    }
  };

  // --- FUNCIONES PARA ABRIR EL MODAL ---
  const handleOpenStock = (medicamento) => {
    setSelectedMed(medicamento); // Guardamos cual clickeó
    setShowModal(true);          // Mostramos la ventana
  };

  const handleSaveStock = async (codigoBarras, cantidad) => {
    try {
      await addStock(codigoBarras, cantidad);
      await cargarDatos(); // Recargamos la tabla
      alert("Stock actualizado correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar el stock");
    }
  };
  // -------------------------------------

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

        {esAdmin && (
          <Button
            variant="success"
            onClick={() => navigate("/medicamentos/nuevo")}
          >
            + Registrar medicamento
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
                
                {/* COLUMNA STOCK CON BOTÓN */}
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <Badge
                      bg={med.stock <= med.stockMinimo ? "danger" : "success"}
                    >
                      {med.stock} u.
                    </Badge>
                    
                    {/* Botón chiquito para sumar stock */}
                    <Button 
                        variant="outline-primary" 
                        size="sm" 
                        style={{padding: '0px 5px', fontSize:'0.8rem'}}
                        onClick={() => handleOpenStock(med)}
                    >
                        + Stock
                    </Button>
                  </div>
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

      <IngresoStockModal 
        show={showModal} 
        handleClose={() => setShowModal(false)}
        medicamento={selectedMed}
        onGuardar={handleSaveStock}
      />
      
    </Container>
  );
};

export default MedicamentosPage;