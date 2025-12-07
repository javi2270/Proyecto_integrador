const { Router } = require('express');
const router = Router();
const { reporteVentas } = require('../controllers/reporte.controller');
const { validarToken } = require('../middlewares/auth.validator');

router.get('/ventas', validarToken, reporteVentas);

module.exports = router;
