const { Router } = require('express');
const router = Router();
const { getTemperaturaMes } = require('../controllers/temperaturaMes.controller');
const { validarToken } = require('../middlewares/auth.validator');

router.get('/', validarToken, getTemperaturaMes);

module.exports = router;
