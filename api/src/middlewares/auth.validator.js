const jsonwebtoken = require('jsonwebtoken');
const { Usuario } = require('../models/index');

const ADMINISTRADOR = 'Administrador';

const validarRegistro = (req, res, next) => {
  next();
};

const validarToken = async (req, res, next) => {
  try {
    const tokenHeader = req.headers['authorization'];
    if (!tokenHeader) {
      return res.status(403).json({ message: 'No se proporcionó un token.' });
    }

    const token = tokenHeader.replace('Bearer ', '');
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findById(decoded.id, { password: 0 }).populate('rol', 'nombre');
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.error('Token inválido:', error);
    return res.status(401).json({ message: 'Token inválido.' });
  }
};

const esAdministrador = (req, res, next) => {
  try {
    if (req.usuario?.rol?.nombre !== ADMINISTRADOR) {
      return res.status(403).json({ message: 'Se requiere el rol Administrador.' });
    }
    next();
  } catch (error) {
    console.error('Error en validador de administrador:', error);
    return res.status(500).json({ message: 'Error interno de permisos.' });
  }
};

module.exports = { validarRegistro, validarToken, esAdministrador };
