const Usuario = require('../models/usuario.model');
const Rol = require('../models/rol.model');

const usuarioService = {};

usuarioService.getAll = async () => {
  return await Usuario
    .find({}, { password: 0 })
    .populate('rol');
};

usuarioService.cambiarRol = async (usuarioId, nuevoRolId) => {
  // Validar que el rol exista
  const rol = await Rol.findById(nuevoRolId);
  if (!rol) {
    throw {
      status: 404,
      message: 'Rol no encontrado'
    };
  }

  const usuario = await Usuario.findById(usuarioId);
  if (!usuario) {
    throw {
      status: 404,
      message: 'Usuario no encontrado'
    };
  }

  usuario.rol = rol._id;
  await usuario.save();

  return await usuario.populate('rol');
};

module.exports = usuarioService;
