const { Router } = require('express');
const router = Router();

router.use('/auth', require('./auth.route'));
router.use('/medicamentos', require('./medicamento.route'));
router.use('/laboratorios', require('./laboratorio.route'));
router.use('/ventas', require('./venta.route'));
router.use('/alerta', require('./alerta.route'));
router.use('/temperatura', require('./temperatura.route'));
router.use('/usuarios', require('./usuario.route'));
router.use('/reportes', require('./reporte.route'));
router.use('/temperatura-mes', require('./temperaturaMes.route'));


module.exports = router;
