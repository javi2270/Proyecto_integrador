const { Router } = require('express')
const medicamentoRoute = require('./medicamento.routes')
const laboratorioRoute = require('./laboratorio.routes')
const ventaRoute = require('./venta.routes')

const router = Router()

router.use('/medicamentos', medicamentoRoute)
router.use('/laboratorios', laboratorioRoute)
router.use('/ventas', ventaRoute)



module.exports = router    