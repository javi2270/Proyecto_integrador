import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerService } from "../services/auth.service";

const RegisterPage = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerService(nombre, email, password);
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Error al registrar, intente de nuevo"
      );
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Crear cuenta</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3" style={{ position: "relative" }}>
          <label>Contraseña:</label>
          <input
            type={mostrarPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control"
          />

          <i
            className={`bi ${mostrarPassword ? "bi-eye-slash" : "bi-eye"}`}
            onClick={() => setMostrarPassword(!mostrarPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "60%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "1.2rem"
            }}
          ></i>
        </div>

        {error && <p className="text-danger">{error}</p>}

        <button type="submit" className="btn btn-success w-100 mt-2">
          Registrarse
        </button>
      </form>

      <p className="text-center mt-3">
        ¿Ya tienes cuenta?
        <Link to="/login"> Inicia sesión aquí</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
