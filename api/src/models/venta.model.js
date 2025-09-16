const mongoose = require('mongoose')

const ventaSchema = new mongoose.Schema({
  medicamento: { type: mongoose.Schema.Types.ObjectId, ref: "Medicamento", required: true },
  cantidad: { type: Number, required: true, min: 1 },
  fecha: { type: Date, default: Date.now },
  motivo: { type: String, default: "Venta" }
});


module.exports = mongoose.model('Venta', ventaSchema)