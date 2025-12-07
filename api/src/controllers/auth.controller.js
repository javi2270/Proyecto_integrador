require("dotenv").config();
const { Usuario, Rol } = require("../models/index");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const authController = {};

// -------------------- REGISTRO --------------------
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: "El correo electrónico ya está en uso." });
    }

    const passwordHasheada = await bcryptjs.hash(password, 10);

    const rolEmpleado = await Rol.findOne({ nombre: "Empleado" });

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordHasheada,
      rol: rolEmpleado._id,
    });

    await nuevoUsuario.save();

    const token = jsonwebtoken.sign(
      { id: nuevoUsuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const usuarioConRol = await Usuario.findById(nuevoUsuario._id)
      .populate("rol", "nombre");

    res.status(201).json({
      token,
      usuario: usuarioConRol,
    });

  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error en el servidor al intentar registrar el usuario." });
  }
};

authController.register = register;

// -------------------- LOGIN --------------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuarioEncontrado = await Usuario.findOne({ email });
    if (!usuarioEncontrado) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    const esPasswordCorrecta = await bcryptjs.compare(
      password,
      usuarioEncontrado.password
    );

    if (!esPasswordCorrecta) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    const token = jsonwebtoken.sign(
      { id: usuarioEncontrado._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // 👁️ AQUI ESTABA EL PROBLEMA: SOLO EL LOGIN SI POPULABA ROL
    const usuarioConRol = await Usuario.findById(usuarioEncontrado._id)
      .populate("rol", "nombre");

    res.status(200).json({
      token,
      usuario: usuarioConRol,
    });

  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error en el servidor al intentar iniciar sesión." });
  }
};

authController.login = login;

// -------------------- PROFILE --------------------
const profile = async (req, res) => {
  try {
    // 🚀 AGREGADO → Buscar SIEMPRE al usuario CON ROL POPULADO
    const usuarioConRol = await Usuario.findById(req.usuario._id)
      .populate("rol", "nombre");

    if (!usuarioConRol) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(usuarioConRol);

  } catch (error) {
    console.error("Error en profile:", error);
    res.status(500).json({ message: "Error al obtener el perfil" });
  }
};

authController.profile = profile;

module.exports = authController;
