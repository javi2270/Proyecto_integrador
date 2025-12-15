const express = require('express');
const router = express.Router();

const ventaController = require('../controllers/venta.controller');
const { validarToken } = require('../middlewares/auth.validator');
const validate = require('../middlewares/validate');

const { crearVentaSchema } = require('../schemas/venta.schema');
const { identificadorParamSchema } = require('../schemas/ventaParam.schema');

// Registrar una venta (HU07)
router.post(
  '/',
  validarToken,
  validate(crearVentaSchema),
  ventaController.addVenta
);

// Obtener todas las ventas
router.get(
  '/',
  validarToken,
  ventaController.getAllVentas
);

// Obtener ventas por medicamento
router.get(
  '/:identificador',
  validarToken,
  validate(identificadorParamSchema),
  ventaController.getVentasByMedicamento
);

module.exports = router;
