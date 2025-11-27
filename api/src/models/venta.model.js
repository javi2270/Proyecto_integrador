const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  medicamento: { type: mongoose.Schema.Types.ObjectId, ref: "Medicamento", required: true },
  cantidad: { type: Number, required: true, min: 1 },
  motivo: { type: String, default: "Venta" },
  fecha: { type: Date, default: Date.now },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true }
});

module.exports = mongoose.model('Venta', ventaSchema);
