const Alerta = require('../models/alerta.model');

const alertaController = {};

// Obtener todas las alertas no leídas
const getAlertasActivas = async (req, res) => {
    try {
        const alertas = await Alerta.find({ leida: false })
            .populate('medicamento', 'nombre codigoBarras stock stockMinimo')
            .sort({ createdAt: -1 }); // Las más nuevas primero
        res.status(200).json(alertas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las alertas.", error: error.message });
    }
};
alertaController.getAlertasActivas = getAlertasActivas

// Marcar una alerta como leída
const marcarComoLeida = async (req, res) => {
    try {
        const { id } = req.params;
        const alerta = await Alerta.findByIdAndUpdate(id, { leida: true }, { new: true });

        if (!alerta) {
            return res.status(404).json({ message: "Alerta no encontrada." });
        }

        res.status(200).json({ message: "Alerta marcada como leída.", alerta });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la alerta.", error: error.message });
    }
};
alertaController.marcarComoLeida = marcarComoLeida


module.exports = alertaController
