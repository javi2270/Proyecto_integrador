import React, { useEffect, useState } from "react";
import { Container, Table, Form, Alert } from "react-bootstrap";
import { getUsuarios, cambiarRol } from "../services/usuario.service";
import { getRoles } from "../services/auth.service";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarDatos = async () => {
    try {
      const u = await getUsuarios();
      const r = await getRoles();
      setUsuarios(u);
      setRoles(r);
    } catch (err) {
      setError("Error al cargar los datos.");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleRol = async (usuarioId, nuevoRol) => {
    setError("");
    setMensaje("");

    try {
      await cambiarRol(usuarioId, nuevoRol);
      setMensaje("Rol actualizado correctamente.");
      cargarDatos();
    } catch (err) {
      // MUESTRA EL MENSAJE DEL BACKEND
      const msg =
        err.response?.data?.message ||
        "No se pudo cambiar el rol.";

      setError(msg);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Usuarios</h2>

      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Table bordered>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol actual</th>
            <th>Cambiar rol</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((u) => (
            <tr key={u._id}>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>{u.rol?.nombre}</td>
              <td>
                <Form.Select
                  value={u.rol?._id}
                  onChange={(e) =>
                    handleRol(u._id, e.target.value)
                  }
                >
                  {roles.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.nombre}
                    </option>
                  ))}
                </Form.Select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default UsuariosPage;
