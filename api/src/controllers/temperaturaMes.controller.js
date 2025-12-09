const Temperatura = require('../models/temperatura.model');

exports.getTemperaturaMes = async (req, res) => {
  try {
    const ahora = new Date();
    const primerDia = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const ultimoDia = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);

    const registro = await Temperatura.findOne({
      createdAt: { $gte: primerDia, $lte: ultimoDia }
    }).populate('usuario', 'nombre email');

    res.status(200).json({
      temperaturaRegistrada: Boolean(registro),
      registro
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

