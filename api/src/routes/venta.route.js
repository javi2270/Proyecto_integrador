const express = require('express');
const router = express.Router();

const ventaController = require('../controllers/venta.controller');
const { validarToken } = require('../middlewares/auth.validator');

// Registrar una venta 
router.post('/', validarToken, ventaController.addVenta);

// Obtener todas las ventas (
router.get('/', validarToken, ventaController.getAllVentas);

// Obtener ventas por medicamento
router.get('/:identificador', validarToken, ventaController.getVentasByMedicamento);

module.exports = router;
