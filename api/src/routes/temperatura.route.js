const { Router } = require('express');
const temperaturaController = require('../controllers/temperatura.controller');
const { validarToken, esAdministrador } = require('../middlewares/auth.validator');
const validate = require('../middlewares/validate');
const { registrarTemperaturaSchema } = require('../schemas/temperatura.schema');

const router = Router();

// Registrar temperatura mensual
router.post(
  '/',
  validarToken,
  esAdministrador,
  validate(registrarTemperaturaSchema),
  temperaturaController.addTemperatura
);

// Ver temperatura del mes
router.get(
  '/mes',
  validarToken,
  esAdministrador,
  temperaturaController.getTemperaturaMes
);

module.exports = router;
