import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Alert,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import {
  getAllMedicamentos,
  deleteMedicamento,
  addStock,
} from "../services/medicamento.service";
import { useNavigate } from "react-router-dom";

import IngresoStockModal from "../components/IngresoStockModal";
import { useAuth } from "../context/AuthContext";

const MedicamentosPage = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [medicamentos, setMedicamentos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [medSeleccionado, setMedSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const cargarMedicamentos = async () => {
    try {
      const data = await getAllMedicamentos();
      setMedicamentos(data);
    } catch (err) {
      setError("Error al cargar los medicamentos.", err);
    }
  };

  useEffect(() => {
    cargarMedicamentos();
  }, []);

  const filtrados = medicamentos.filter((m) => {
    const t = busqueda.toLowerCase();
    return (
      m.nombre.toLowerCase().includes(t) ||
      m.codigoBarras.toString().includes(t)
    );
  });

  return (
    <Container className="mt-4">
      <h2>Medicamentos</h2>

      {usuario?.rol?.nombre === "Administrador" && (
        <Row className="mb-3">
          <Col>
            <Button
              variant="primary"
              onClick={() => navigate("/medicamentos/nuevo")}
            >
              + Nuevo Medicamento
            </Button>
          </Col>
        </Row>
      )}

      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Stock</th>
            <th>Stock mínimo</th>
            <th>Laboratorio</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {filtrados.map((m) => (
            <tr key={m._id}>
              <td>{m.nombre}</td>
              <td>{m.codigoBarras}</td>
              <td>{m.stock}</td>
              <td>{m.stockMinimo}</td>
              <td>{m.laboratorio?.nombre}</td>

              <td>
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => {
                    setMedSeleccionado(m);
                    setShowModal(true);
                  }}
                >
                  Ingreso Stock
                </Button>{" "}
                {usuario?.rol?.nombre === "Administrador" && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() =>
                      deleteMedicamento(m.codigoBarras).then(cargarMedicamentos)
                    }
                  >
                    Eliminar
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {medSeleccionado && (
        <IngresoStockModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          medicamento={medSeleccionado}
          onGuardar={async (codigo, cantidad) => {
            await addStock(codigo, cantidad);
            cargarMedicamentos();
          }}
        />
      )}
    </Container>
  );
};

export default MedicamentosPage;
