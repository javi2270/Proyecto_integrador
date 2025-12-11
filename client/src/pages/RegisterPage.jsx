import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerService } from "../services/auth.service";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerService(formData.nombre, formData.email, formData.password);

      alert("Cuenta creada correctamente.");
      navigate("/login");

    } catch (err) {
      const msg =
        err.response?.data?.message || "Error al registrar usuario.";
      setError(msg);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Registro de Usuario</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombre:</label>
          <input
            className="form-control"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Email:</label>
          <input
            className="form-control"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Contraseña:</label>
          <input
            className="form-control"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="text-danger">{error}</p>}

        <button className="btn btn-primary w-100" type="submit">
          Registrarse
        </button>
      </form>

      <p className="text-center mt-3">
        ¿Ya tenés cuenta?
        <Link to="/login"> Iniciar sesión</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
