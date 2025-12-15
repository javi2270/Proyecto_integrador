const { Router } = require('express');
const temperaturaController = require('../controllers/temperatura.controller');
const { validarToken, esAdministrador } = require('../middlewares/auth.validator');
const validate = require('../middlewares/validate');

const { registrarTemperaturaSchema } = require('../schemas/temperatura.schema');

const router = Router();

router.post(
  '/',
  [validarToken, esAdministrador, validate(registrarTemperaturaSchema)],
  temperaturaController.addTemperatura
);

module.exports = router;
