const { Router } = require('express');
const router = Router();

const authRoutes = require('./auth.route');
const usuarioRoutes = require('./usuario.route');
const medicamentoRoutes = require('./medicamento.route');
const laboratorioRoutes = require('./laboratorio.route');
const alertaRoutes = require('./alerta.route');
const temperaturaRoutes = require('./temperatura.route');
const rolRoutes = require('./rol.route');
const ventaRoutes = require('./venta.route');

// Auth
router.use('/auth', authRoutes);

// Protegidas
router.use('/usuario', usuarioRoutes);
router.use('/medicamento', medicamentoRoutes);
router.use('/laboratorio', laboratorioRoutes);
router.use('/alerta', alertaRoutes);
router.use('/temperatura', temperaturaRoutes);
router.use('/rol', rolRoutes);

// Ventas (singular y plural)
router.use('/venta', ventaRoutes);
router.use('/ventas', ventaRoutes);

module.exports = router;
