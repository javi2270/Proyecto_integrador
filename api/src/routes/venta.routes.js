const express = require('express')
const ventaController = require('../controllers/venta.controller')

const router = express.Router()

// Registrar una venta
router.post('/', ventaController.addVenta)

// Obtener todas las ventas
router.get('/', ventaController.getAllVentas)

// Obtener ventas por medicamento (buscar por código o nombre)
router.get('/:identificador', ventaController.getVentasByMedicamento)

module.exports = router
