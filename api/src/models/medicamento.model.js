const mongoose = require('mongoose')

const medicamentoSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  codigoBarras: { type: String, required: true, unique: true },
  lote: { type: String, required: true },
  fechaVencimiento: { type: Date, required: true },
  stock: { type: Number, required: true, min: 0 },
  stockMinimo: { type: Number, default: 0 }, // RF5 y RF11
  laboratorio: { type: mongoose.Schema.Types.ObjectId, ref: "Laboratorio" }
}, { timestamps: true });


module.exports = mongoose.model('Medicamento', medicamentoSchema)

