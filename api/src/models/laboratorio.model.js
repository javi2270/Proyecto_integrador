const mongoose = require("mongoose");

const laboratorioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true, trim: true },
  direccion: { type: String, trim: true },
  telefono: { type: String, trim: true },
  activo: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Laboratorio", laboratorioSchema);
