const mongoose = require('mongoose')

const alertaSchema = new mongoose.Schema({
    medicamento: { type: mongoose.Schema.Types.ObjectId, ref: "Medicamento", required: false },
    tipo: { 
        type: String, 
        enum: ['Bajo Stock', 'Vencimiento Proximo', 'Registro Temperatura'], // Podremos reusar este modelo para futuras alertas
        required: true 
    },
    mensaje: { type: String, required: true },
    leida: { 
        type: Boolean, 
        default: false // Para saber si la alerta ya fue gestionada
    }
}, { timestamps: true });

module.exports = mongoose.model("Alerta", alertaSchema);
 
