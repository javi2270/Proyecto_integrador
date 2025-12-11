const { Router } = require('express');
const alertaController = require('../controllers/alerta.controller');
const router = Router();

// Obtener alertas activas
router.get('/', alertaController.getAlertasActivas);

// Marcar una alerta
router.patch('/:id/leida', alertaController.marcarComoLeida);


module.exports = router;
