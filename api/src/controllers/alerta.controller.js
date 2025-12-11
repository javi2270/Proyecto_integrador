const alertaService = require('../services/alerta.service');

const alertaController = {};

// Obtener todas las alertas no leídas
const getAlertasActivas = async (req, res, next) => {
    try {
        const alertas = await alertaService.getAlertasActivas();
        res.json(alertas);
    } catch (error) {
        next(error);
    }
};
alertaController.getAlertasActivas = getAlertasActivas;

// Marcar una alerta como leída
const marcarComoLeida = async (req, res, next) => {
    try {
        const { id } = req.params;

        const alerta = await alertaService.marcarComoLeida(id);

        if (!alerta) {
            throw { status: 404, message: "Alerta no encontrada." };
        }

        res.json({
            message: "Alerta marcada como leída.",
            alerta
        });

    } catch (error) {
        next(error);
    }
};
alertaController.marcarComoLeida = marcarComoLeida;


module.exports = alertaController;
