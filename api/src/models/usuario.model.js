const mongoose = require('mongoose')

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true},
    password: { type: String, required: true, trim: true},
    rol: { type: mongoose.Schema.Types.ObjectId, ref: 'Rol'  }
})

module.exports = mongoose.model('Usuario', usuarioSchema)

