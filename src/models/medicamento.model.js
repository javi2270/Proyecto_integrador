const mongoose = require('mongoose')

const medicamentoSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    codigoBarras: {type: Number, required: true, unique: true},
    lote: {type: String, required: true},
    fechaVencimiento: {type: Date, required: true},
    stock: {type: Number, required: true, min: 0}
}, {timestamps: true}) 

module.exports = mongoose.model('Medicamento', medicamentoSchema)

