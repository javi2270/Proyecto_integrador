const { Router } = require('express')
const medicamentoRoute = require('./medicamento.route')
const laboratorioRoute = require('./laboratorio.route')
const ventaRoute = require('./venta.route')
const alertaRoute = require('./alerta.route')
const authRoute = require('./auth.route')
const temperaturaRoute = require('./temperatura.route')
const usuarioRoute = require('./usuario.route')

const router = Router()

router.use('/medicamentos', medicamentoRoute)
router.use('/laboratorios', laboratorioRoute)
router.use('/ventas', ventaRoute)
router.use('/alerta', alertaRoute) 
router.use('/auth', authRoute)
router.use('/temperatura', temperaturaRoute)
router.use('/usuarios', usuarioRoute)



module.exports = router    