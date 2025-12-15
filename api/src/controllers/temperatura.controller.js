const alertaService = require('../services/alerta.service');
const temperaturaService = require('../services/temperatura.service');

const temperaturaController = {};

temperaturaController.addTemperatura = async (req, res, next) => {
  try {
    const { valor } = req.body;

    // Validación interna (igual protegida por Joi)
    if (valor === undefined || valor === null) {
      throw { status: 400, message: 'El campo "valor" es obligatorio.' };
    }
    if (valor < 2 || valor > 8) {
      throw { status: 400, message: 'El valor debe estar entre 2°C y 8°C.' };
    }

    const usuarioId = req.usuario?._id;
    if (!usuarioId) {
      throw { status: 401, message: 'Usuario no autenticado.' };
    }

    // registrar solo una vez por mes
    const registro = await temperaturaService.registrarTemperatura({
      valor,
      usuarioId
    });

    // Marcar alerta mensual como resuelta
    await alertaService.marcarComoLeidaPorTipo('Registro Temperatura');

    res.status(201).json({
      message: 'Temperatura registrada con éxito.',
      temperatura: registro
    });

  } catch (error) {
    next(error);
  }
};

module.exports = temperaturaController;
