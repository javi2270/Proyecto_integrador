const mongoose = require('mongoose');

const alertaSchema = new mongoose.Schema({
  medicamento: { type: mongoose.Schema.Types.ObjectId, ref: "Medicamento", required: false },
  tipo: {
    type: String,
    enum: ['Bajo Stock', 'Vencimiento Proximo', 'Registro Temperatura'],
    required: true
  },
  mensaje: { type: String, required: true },
  leida: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Alerta", alertaSchema);
