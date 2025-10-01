const jsonwebtoken = require('jsonwebtoken')
const { Rol, Usuario} = require('../models/index')
const { required } = require('joi')
const { registroSchema } = require('../schemas/auth.schemas')

const ADMINISTRADOR = 'Administrador'

const validarRegistro = (req, res, next) => {
    const { error } = registroSchema.validate(req.body)
    if (error){
        return res.status(400).json({message: error.details[0].message})
    }
    next()
}

const validarToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization']
        if (!token) {
            return res.status(403).json({message: 'No se proporciono un token.'})
        }
        const tokenPuro = token.replace('Bearer ', '')
        const decoded = jsonwebtoken.verify(tokenPuro, process.env.JWT_SECRET)
        const usuario = await Usuario.findById(decoded.id, {password: 0}).populate('rol')
        if (!usuario) {
            return res.status(404).json({message: 'Usuario no encontrado.'})
        }
        req.usuario = usuario
        next()
    } 
    catch (error) {
        console.error('Token invalido:', error)
        res.status(401).json({message: 'EL token es invalido.'})
    }
}

const esAdministrador = async (req, res, next) => {
    try {
        if (req.usuario && req.usuario.rol.nombre === ADMINISTRADOR ) {
            next()
        }
        else {
            return res.status(403).json({message: 'Acceso denegado, se requierre el rol de administrador.'})
        }
    } catch (error) {
        console.error('Acceso denegado', error)
    }
}

module.exports = { validarToken, esAdministrador, validarRegistro }

