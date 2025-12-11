const Temperatura = require('../models/temperatura.model');

exports.getTemperaturaMes = async (req, res, next) => {
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
