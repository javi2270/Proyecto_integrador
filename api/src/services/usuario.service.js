const Usuario = require('../models/usuario.model')

const usuarioService = {}

const getAll = async () => {
    return await Usuario.find({}, {password: 0}).populate('rol') //oculta la password
}
usuarioService.getAll = getAll

const cambiarRol = async (usuarioId, nuevoRolId) => {
    return await Usuario.findByIdAndUpdate(usuarioId,{rol: nuevoRolId}, {new: true})
}
usuarioService.cambiarRol = cambiarRol


module.exports = usuarioService 
