const Alerta = require("../models/alerta.model");

const alertaService = {};

const crearAlertaSiNoExiste = async (datosAlerta) => {
  try {
    // Busco si ya existe una alerta no leída con mismo tipo y medicamento
    const alertaExistente = await Alerta.findOne({
      medicamento: datosAlerta.medicamento,
      tipo: datosAlerta.tipo,
      leida: false,
    });

    // Si no existe la creo
    if (!alertaExistente) {
      const nuevaAlerta = new Alerta(datosAlerta);
      await nuevaAlerta.save();
      console.log(`ALERTA CREADA: ${datosAlerta.mensaje}`);
      return nuevaAlerta;
    }

    // Si ya existe, no se crea otra duplicada
    console.log(
      `Ya existe una alerta activa de '${datosAlerta.tipo}' para este medicamento.`
    );
    return null;
  } catch (error) {
    console.error("Error al crear la alerta:", error.message);
    throw error;
  }
};
// Obtener todas las alertas activas
const getAlertasActivas = async () => {
  return await Alerta.find({ leida: false })
    .populate("medicamento", "nombre codigoBarras stock stockMinimo")
    .sort({ createdAt: -1 });
};

// Marcar una alerta como leída
const marcarComoLeida = async (id) => {
  return await Alerta.findByIdAndUpdate(id, { leida: true }, { new: true });
};

// Marcar todas las de un tipo como leídas (para HU-10 temperatura)
const marcarComoLeidaPorTipo = async (tipo) => {
  return await Alerta.updateMany({ tipo, leida: false }, { leida: true });
};

alertaService.crearAlertaSiNoExiste = crearAlertaSiNoExiste;
alertaService.getAlertasActivas = getAlertasActivas;
alertaService.marcarComoLeida = marcarComoLeida;
alertaService.marcarComoLeidaPorTipo = marcarComoLeidaPorTipo;

module.exports = alertaService;
