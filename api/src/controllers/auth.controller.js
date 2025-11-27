require("dotenv").config(); // Para acceder a process.env.JWT_SECRET
const { Usuario, Rol } = require("../models/index");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const authController = {};

// --- REGISTRO DE USUARIO ---
const register = async (req, res) => {
  try {
    //  Obtengo datos del cuerpo de la petición
    const { nombre, email, password } = req.body;

    // Verifico si el email ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está en uso." });
    }

    // Encripto la contraseña
    const passwordHasheada = await bcryptjs.hash(password, 10);

    // Asigno el rol por defecto "Empleado"
    const rolEmpleado = await Rol.findOne({ nombre: "Empleado" });
    // (No es necesario validar si existe, porque app.js lo garantiza)

    // Creo el nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordHasheada,
      rol: rolEmpleado._id,
    });

    // Guardo el usuario en la BD
    await nuevoUsuario.save();

        // creo el token de autenticacion JWT
    const token = jsonwebtoken.sign(
      { id: nuevoUsuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    )
    // busco el usuario recien creado para poblar el rol
    const usuarioConRol = await Usuario.findById(nuevoUsuario._id).populate('rol', 'nombre')
    // respuesta exitosa
    res.status(201).json({
      token,
      usuario: usuarioConRol
    });

  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({
      message: "Error en el servidor al intentar registrar el usuario.",
    });
  }
};
authController.register = register;

// --- INICIO DE SESIÓN (LOGIN) ---

const login = async (req, res) => {
  try {
    // Obtengo credenciales
    const { email, password } = req.body;

    // Busco al usuario por email
    const usuarioEncontrado = await Usuario.findOne({ email });
    if (!usuarioEncontrado) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    // Comparo la contraseña enviada con la de la BD
    const esPasswordCorrecta = await bcryptjs.compare(
      password,
      usuarioEncontrado.password
    );
    if (!esPasswordCorrecta) {
      return res.status(400).json({ message: "Credenciales inválidas." });
    }

    // Si todo es correcto, creo un nuevo token
    const token = jsonwebtoken.sign(
      { id: usuarioEncontrado._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Envio el token Y LOS DATOS DEL USUARIO al cliente

    // Busco el usuario poblando el ROL
    const usuarioConRol = await Usuario.findById(
      usuarioEncontrado._id
    ).populate("rol", "nombre"); // Traemos solo el nombre del rol

    res.status(200).json({
      token,
      usuario: usuarioConRol,
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res
      .status(500)
      .json({ message: "Error en el servidor al intentar iniciar sesión." });
  }
};
authController.login = login;

const profile = async (req, res) => {
  if (!req.usuario) {
    return res.status(401).json({ message: "No autorizado" });
  }
  res.json(req.usuario);
};

authController.profile = profile;


module.exports = authController;
