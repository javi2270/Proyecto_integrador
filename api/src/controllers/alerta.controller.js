const alertaService = require('../services/alerta.service');

const alertaController = {};

// Obtener todas las alertas no leídas
const getAlertasActivas = async (req, res) => {
    try {
        const alertas = await alertaService.getAlertasActivas();
        res.status(200).json(alertas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las alertas.", error: error.message });
    }
};
alertaController.getAlertasActivas = getAlertasActivas;

// Marcar una alerta como leída
const marcarComoLeida = async (req, res) => {
    try {
        const { id } = req.params;
        const alerta = await alertaService.marcarComoLeida(id);

        if (!alerta) {
            return res.status(404).json({ message: "Alerta no encontrada." });
        }

        res.status(200).json({ message: "Alerta marcada como leída.", alerta });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la alerta.", error: error.message });
    }
};
alertaController.marcarComoLeida = marcarComoLeida;

// Marcar TODAS las alertas de un tipo
//const marcarPorTipo = async (req, res) => {
//    try {
//        const { tipo } = req.params;
//
//        const result = await alertaService.marcarPorTipo(tipo);
//
//        res.status(200).json({
//            message: `Alertas de tipo "${tipo}" marcadas como leídas.`,
//            modificadas: result.modifiedCount
//        });
//
//    } catch (error) {
//        res.status(500).json({ message: 'Error al marcar alertas por tipo.', error: error.message });
//    }
//}
//alertaController.marcarPorTipo = marcarPorTipo;


module.exports = alertaController;
