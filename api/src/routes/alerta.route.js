const { Router } = require('express');
const alertaController = require('../controllers/alerta.controller');
const router = Router();

// Ruta para obtener todas las alertas activas (no leídas)
router.get('/', alertaController.getAlertasActivas);

// Ruta para marcar una alerta específica como leída
router.patch('/:id/leida', alertaController.marcarComoLeida);

module.exports = router