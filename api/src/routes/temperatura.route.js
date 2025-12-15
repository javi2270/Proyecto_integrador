const { Router } = require('express');
const temperaturaController = require('../controllers/temperatura.controller');
const { validarToken, esAdministrador } = require('../middlewares/auth.validator');
const validate = require('../middlewares/validate');

// 👉 Schema Joi para validar temperatura
const { registrarTemperaturaSchema } = require('../schemas/temperatura.schema');

const router = Router();

// Registrar temperatura mensual
router.post(
  '/',
  [validarToken, esAdministrador, validate(registrarTemperaturaSchema)],
  temperaturaController.addTemperatura
);

module.exports = router;
