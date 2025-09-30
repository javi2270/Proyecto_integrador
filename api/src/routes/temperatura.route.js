const { Router } = require('express')
const temperaturaController = require('../controllers/temperatura.controller')
const { validarToken, esAdministrador } = require('../middlewares/auth.validator')
const router = Router()


router.post('/', [ validarToken, esAdministrador], temperaturaController)

module.exports = router