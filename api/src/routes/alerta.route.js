const { Router } = require('express');
const alertaController = require('../controllers/alerta.controller');
const router = Router();

// Obtener alertas activas
router.get('/', alertaController.getAlertasActivas);

// Marcar una alerta
router.patch('/:id/leida', alertaController.marcarComoLeida);

// Marcar todas las alertas de un tipo
//router.patch('/tipo/:tipo/leidas', alertaController.marcarPorTipo);

module.exports = router;
