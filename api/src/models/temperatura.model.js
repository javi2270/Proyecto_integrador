const mongoose = require('mongoose')

const temperaturaSchema = new mongoose.Schema({
    valor: { type: Number, required: true },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
}, {timestamps: true})



module.exports = mongoose.model('Temperatura', temperaturaSchema)

