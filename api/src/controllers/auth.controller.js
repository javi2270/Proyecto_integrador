require("dotenv").config();
const { Usuario, Rol } = require("../models/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authController = {};

// -------------------- REGISTRO --------------------
authController.register = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    // Joi validó campos → solo verificamos duplicado
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      throw { status: 400, message: "El correo electrónico ya está en uso." };
    }

    // Hash de contraseña
    const passwordHasheada = await bcrypt.hash(password, 10);

    // Obtener rol base
    const rolEmpleado = await Rol.findOne({ nombre: "Empleado" });
    if (!rolEmpleado) {
      throw { status: 500, message: "Rol base 'Empleado' no encontrado." };
    }

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: passwordHasheada,
      rol: rolEmpleado._id,
    });

    // Generar token
    const token = jwt.sign(
      { id: nuevoUsuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Traer usuario con rol
    const usuarioConRol = await Usuario.findById(nuevoUsuario._id)
      .populate("rol", "nombre");

    res.status(201).json({
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

    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      throw { status: 400, message: "Credenciales inválidas." };
    }

    // Validar password
    const passwordOK = await bcrypt.compare(password, usuario.password);
    if (!passwordOK) {
      throw { status: 400, message: "Credenciales inválidas." };
    }

    // Generar token
    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Usuario con rol poblado
    const usuarioConRol = await Usuario.findById(usuario._id)
      .populate("rol", "nombre");

    res.status(200).json({
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
      throw { status: 404, message: "Usuario no encontrado." };
    }

    res.json(usuario);

  } catch (error) {
    next(error);
  }
};

module.exports = authController;
