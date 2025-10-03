const { Router } = require('express')
const router = Router()
const authController = require('../controllers/auth.controller')
const { validarRegistro } = require('../middlewares/auth.validator')

router.post('/login', authController.login)
router.post('/register', validarRegistro, authController.register)

module.exports = router