require('dotenv').config(); // Para acceder a process.env.JWT_SECRET
const { Usuario, Rol } = require('../models/index');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

const authController = {};

// --- REGISTRO DE USUARIO ---
const register = async (req, res) => {
    try {
        // 1. Obtener datos del cuerpo de la petición
        const { nombre, email, password } = req.body;

        // 2. Verificar si el email ya existe
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
        }

        // 3. Encriptar la contraseña
        const passwordHasheada = await bcryptjs.hash(password, 10);

        // 4. Asignar el rol por defecto "Empleado"
        const rolEmpleado = await Rol.findOne({ nombre: 'Empleado' });
        // (No es necesario validar si existe, porque app.js lo garantiza)

        // 5. Crear el nuevo usuario
        const nuevoUsuario = new Usuario({
            nombre,
            email,
            password: passwordHasheada,
            rol: rolEmpleado._id
        });

        // 6. Guardar el usuario en la BD
        await nuevoUsuario.save();

        // 7. Crear el token de autenticación (JWT)
        const token = jsonwebtoken.sign(
            { id: nuevoUsuario._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 8. Enviar respuesta exitosa
        res.status(201).json({
            message: "Usuario registrado con éxito.",
            token
        });

    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ message: 'Error en el servidor al intentar registrar el usuario.' });
    }
};
authController.register = register

// --- INICIO DE SESIÓN (LOGIN) ---

const login = async (req, res) => {
try {
        // 1. Obtener credenciales
        const { email, password } = req.body;

        // 2. Buscar al usuario por email
        const usuarioEncontrado = await Usuario.findOne({ email });
        if (!usuarioEncontrado) {
            return res.status(400).json({ message: "Credenciales inválidas." });
        }

        // 3. Comparar la contraseña enviada con la de la BD
        const esPasswordCorrecta = await bcryptjs.compare(password, usuarioEncontrado.password);
        if (!esPasswordCorrecta) {
            return res.status(400).json({ message: "Credenciales inválidas." });
        }

        // 4. Si todo es correcto, crear un nuevo token
        const token = jsonwebtoken.sign(
            { id: usuarioEncontrado._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 5. Enviar el token al cliente
        res.status(200).json({ token });

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ message: 'Error en el servidor al intentar iniciar sesión.' });
    }
};
authController.login = login

module.exports = authController;
