const Alerta = require("../models/alerta.model");

const alertaService = {};

// Crear alerta si no existe
alertaService.crearAlertaSiNoExiste = async (datosAlerta) => {
  try {
    const alertaExistente = await Alerta.findOne({
      medicamento: datosAlerta.medicamento,
      tipo: datosAlerta.tipo,
      leida: false,
    });

    if (!alertaExistente) {
      const nuevaAlerta = new Alerta(datosAlerta);
      await nuevaAlerta.save();
      console.log(`ALERTA CREADA: ${datosAlerta.mensaje}`);
      return nuevaAlerta;
    }

    return null;
  } catch (error) {
    console.error("Error al crear la alerta:", error.message);
    throw error;
  }
};

// Obtener todas las alertas activas
alertaService.getAlertasActivas = async () => {
  return await Alerta.find({ leida: false })
    .populate("medicamento", "nombre codigoBarras stock stockMinimo")
    .sort({ createdAt: -1 });
};

// Marcar alerta como leída por ID
alertaService.marcarComoLeida = async (id) => {
  return await Alerta.findByIdAndUpdate(id, { leida: true }, { new: true });
};

// Marcar todas las alertas de un tipo como leídas
alertaService.marcarComoLeidaPorTipo = async (tipo) => {
  return await Alerta.updateMany(
    { tipo, leida: false },
    { leida: true }
  );
};

module.exports = alertaService;
