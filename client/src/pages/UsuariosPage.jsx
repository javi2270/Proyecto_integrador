import React, { useEffect, useState } from "react";
import { Container, Table, Form, Button, Alert } from "react-bootstrap";
import { getUsuarios, cambiarRol } from "../services/usuario.service";
import { getRoles } from "../services/auth.service";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");

  const cargarDatos = async () => {
    try {
      const u = await getUsuarios();
      const r = await getRoles();
      setUsuarios(u);
      setRoles(r);
    } catch {
      setError("Error al cargar datos.");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleRol = async (id, nuevoRol) => {
    await cambiarRol(id, nuevoRol);
    cargarDatos();
  };

  return (
    <Container className="mt-4">
      <h2>Usuarios</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table bordered>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Cambiar Rol</th>
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
                  onChange={(e) => handleRol(u._id, e.target.value)}
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
