const alertaService = require('../services/alerta.service');
const temperaturaService = require('../services/temperatura.service');

const temperaturaController = {};

// Registrar nueva temperatura
temperaturaController.addTemperatura = async (req, res, next) => {
    try {
        const { valor } = req.body;

        // Validación: campo obligatorio
        if (valor === undefined || valor === null) {
            throw { status: 400, message: 'El campo "valor" es obligatorio.' };
        }

        // Validación: rango permitido (2°C a 8°C)
        if (valor < 2 || valor > 8) {
            throw { status: 400, message: 'El valor de temperatura debe estar entre 2°C y 8°C.' };
        }

        // Obtener el usuario autenticado
        const usuarioId = req.usuario?._id;
        if (!usuarioId) {
            throw { status: 401, message: 'Usuario no autenticado.' };
        }

        // Registrar temperatura
        const registro = await temperaturaService.registrarTemperatura({
            valor,
            usuarioId
        });

        // Marcar alerta mensual como leída (si existe)
        await alertaService.marcarComoLeidaPorTipo("Registro Temperatura");

        // Respuesta exitosa
        res.status(201).json({
            message: "Temperatura registrada con éxito.",
            temperatura: registro
        });

    } catch (error) {
        next(error);
    }
};

module.exports = temperaturaController;
