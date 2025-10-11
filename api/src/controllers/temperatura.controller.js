const alertaService = require('../services/alerta.service');
const temperaturaService = require('../services/temperatura.service');

/**
 * Controlador de temperaturas
 * Responsable de registrar la temperatura mensual del refrigerador.
 * Cumple con HU-10 (registro de temperatura) del FRD.
 */
const temperaturaController = {};

/**
 * Registrar una nueva temperatura
 * - Valida que se reciba un valor numérico
 * - Guarda el registro asociado al usuario autenticado
 * - Marca como leída la alerta mensual "Registro Temperatura" si existía
 */
const addTemperatura = async (req, res) => {
    try {
        const { valor } = req.body;

        // Valido campo obligatorio
        if (valor === undefined || valor === null) {
            return res.status(400).json({
                message: 'El campo "valor" es obligatorio.'
            });
        }

        // Valido rango permitido (2°C a 8°C)
        if (valor < 2 || valor > 8) {
            return res.status(400).json({
                message: 'El valor de temperatura debe estar entre 2°C y 8°C.'
            });
        }

        // Obtener usuario autenticado (middleware de autenticación)
        const usuarioID = req.usuario?._id;
        if (!usuarioID) {
            return res.status(401).json({
                message: 'Usuario no autenticado.'
            });
        }

        // Registrar temperatura usando el servicio
        const datos = { valor, usuarioId: usuarioID };
        const nuevoRegistro = await temperaturaService.registrarTemperatura(datos);

        // Marcar como leída la alerta de tipo "Registro Temperatura"
        // Cumple con FRD HU-10 Escenario 2
        await alertaService.marcarComoLeidaPorTipo("Registro Temperatura");

        // Respuesta exitosa
        res.status(201).json({
            message: 'Temperatura registrada con éxito.',
            temperatura: nuevoRegistro
        });

    } catch (error) {
        console.error('Error al registrar la temperatura:', error);
        res.status(500).json({
            message: 'Error interno del servidor al registrar la temperatura.',
            error: error.message
        });
    }
};

temperaturaController.addTemperatura = addTemperatura;

module.exports = temperaturaController;
