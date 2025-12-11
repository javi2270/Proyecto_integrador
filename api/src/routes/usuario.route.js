const { Router } = require('express')
const router = Router()
const usuarioController = require('../controllers/usuario.controller')
const { validarToken, esAdministrador } = require('../middlewares/auth.validator')
const validate = require("../middlewares/validate");
const { actualizarRolSchema } = require("../schemas/usuario.schema");


// todas estas rutas deben ser solo para administradores
router.use(validarToken, esAdministrador)

router.get('/', usuarioController.obtenerTodos)
router.put('/:usuarioId/rol', validate(actualizarRolSchema), usuarioController.actualizarRol)

module.exports = router

