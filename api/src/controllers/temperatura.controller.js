const alertaService = require('../services/alerta.service');
const temperaturaService = require('../services/temperatura.service');
const Temperatura = require('../models/temperatura.model');

const temperaturaController = {};

temperaturaController.addTemperatura = async (req, res, next) => {
  try {
    const { valor } = req.body;
    const usuarioId = req.usuario?._id;

    const registro = await temperaturaService.registrarTemperatura({
      valor,
      usuarioId
    });

    await alertaService.marcarComoLeidaPorTipo("Registro Temperatura");

    res.status(201).json({
      message: "Temperatura registrada con éxito.",
      temperatura: registro
    });
  } catch (error) {
    next(error);
  }
};

temperaturaController.getTemperaturaMes = async (req, res, next) => {
  try {
    const ahora = new Date();
    const primerDia = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const ultimoDia = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);

    const registro = await Temperatura.findOne({
      createdAt: { $gte: primerDia, $lte: ultimoDia }
    }).populate('usuario', 'nombre email');

    res.json({
      temperaturaRegistrada: Boolean(registro),
      registro
    });
  } catch (error) {
    next(error);
  }
};

module.exports = temperaturaController;
