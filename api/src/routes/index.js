const { Router } = require('express')
const medicamentoRoute = require('./medicamento.routes')
const laboratorioRoute = require('./laboratorio.routes')
const ventaRoute = require('./venta.routes')
const alertaRoute = require('./alerta.routes')
const authRoute = require('./auth.routes')

const router = Router()

router.use('/medicamentos', medicamentoRoute)
router.use('/laboratorios', laboratorioRoute)
router.use('/ventas', ventaRoute)
router.use('/alerta', alertaRoute) 
router.use('/auth', authRoute)



module.exports = router    