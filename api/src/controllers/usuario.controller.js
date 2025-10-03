const usuarioService = require('../services/usuario.service')

const usuarioController = {}

const obtenerTodos = async (req, res) => {
    const usuarios = await usuarioService.getAll()
    res.status(200).json(usuarios)
}
usuarioController.obtenerTodos = obtenerTodos

const actualizarRol = async (req,res) => {
    const { usuarioId } = req.params
    const { rolId } = req.body
    if (!rolId){
        return res.status(400).json('Debe haber un rol')
    }
    const usuarioActualizado = await usuarioService.cambiarRol(usuarioId, rolId)
    res.status(200).json(usuarioActualizado)
}
usuarioController.actualizarRol = actualizarRol

module.exports = usuarioController