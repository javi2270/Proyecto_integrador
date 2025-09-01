const mongoose = require('mongoose')

const alertaSchema = new mongoose.Schema({
    medicamento: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Medicamento", 
        required: true 
    },
    tipo: { 
        type: String, 
        enum: ['Bajo Stock', 'Vencimiento Próximo'], // Podremos reusar este modelo para futuras alertas
        required: true 
    },
    mensaje: { 
        type: String, 
        required: true 
    },
    leida: { 
        type: Boolean, 
        default: false // Para saber si la alerta ya fue gestionada
    }
}, { timestamps: true });

module.exports = mongoose.model("Alerta", alertaSchema);
