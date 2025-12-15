const Temperatura = require('../models/temperatura.model');

const temperaturaService = {};

// Validar si ya existe un registro en el mes y crear uno nuevo si no existe
temperaturaService.registrarTemperatura = async ({ valor, usuarioId }) => {
  const ahora = new Date();
  const primerDia = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
  const ultimoDia = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);

  // 1️ Verificar si ya hay registro este mes
  const existente = await Temperatura.findOne({
    createdAt: { $gte: primerDia, $lte: ultimoDia }
  });

  if (existente) {
    throw { 
      status: 400, 
      message: 'Ya existe un registro de temperatura para este mes.' 
    };
  }

  // Crear nuevo registro
  const nuevoRegistro = new Temperatura({
    valor,
    usuario: usuarioId
  });

  return await nuevoRegistro.save();
};

module.exports = temperaturaService;
