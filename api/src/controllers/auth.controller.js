require("dotenv").config();
const { Usuario, Rol } = require("../models/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authController = {};

// -------------------- REGISTRO --------------------
authController.register = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({
        message: "El correo electrónico ya está en uso.",
      });
    }

    const passwordHasheada = await bcrypt.hash(password, 10);

    const rolEmpleado = await Rol.findOne({ nombre: "Empleado" });
    if (!rolEmpleado) {
      return res.status(500).json({
        message: "Rol base 'Empleado' no encontrado.",
      });
    }

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: passwordHasheada,
      rol: rolEmpleado._id,
    });

    const token = jwt.sign(
      { id: nuevoUsuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const usuarioConRol = await Usuario.findById(nuevoUsuario._id)
      .populate("rol", "nombre");

    return res.status(201).json({
      token,
      usuario: usuarioConRol,
    });

  } catch (error) {
    next(error);
  }
};

// -------------------- LOGIN --------------------
authController.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        message: "Credenciales inválidas.",
      });
    }

    const passwordOK = await bcrypt.compare(password, usuario.password);
    if (!passwordOK) {
      return res.status(400).json({
        message: "Credenciales inválidas.",
      });
    }

    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const usuarioConRol = await Usuario.findById(usuario._id)
      .populate("rol", "nombre");

    return res.status(200).json({
      token,
      usuario: usuarioConRol,
    });

  } catch (error) {
    next(error);
  }
};

// -------------------- PROFILE --------------------
authController.profile = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id)
      .populate("rol", "nombre");

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado.",
      });
    }

    return res.json(usuario);

  } catch (error) {
    next(error);
  }
};

module.exports = authController;
