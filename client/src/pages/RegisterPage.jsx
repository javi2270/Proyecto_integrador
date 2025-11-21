import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerService  } from "../services/auth.service";  

const RegisterPage = () => {
  // estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Hooks

  const navigate = useNavigate();
  const { login } = useAuth(); // usare login del context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // llamo al *servicio* de registro
      await registerService(nombre, email, password);
      // uso la funcion "login" de Context para setear manualmente la sesion
      await login(email, password); // Esto loguea al usuario con los datos acabo de crear

      // redirijo al dashboard
      navigate("/dashboard");
    } catch (error) {
      // error.response.data .message viene de la API
      setError(
        error.response?.data?.message || "Error al registrar, intente de nuevo"
      );
    }
  };
  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Crear cuenta</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Registrarse
        </button>
      </form>
      <p style={{ marginTop: "15px", textAlign: "center" }}>
        ¿ Ya tienes cuenta ?<Link to="/login">  Inicia sesion aqui</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
