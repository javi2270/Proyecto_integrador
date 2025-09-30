const Alerta = require('../models');

const alertaService = {};

// Crear una alerta si no existe una activa del mismo tipo para el mismo medicamento
const crearAlertaSiNoExiste = async (datosAlerta) => {
    try {
        const alertaExistente = await Alerta.findOne({
            medicamento: datosAlerta.medicamento,
            tipo: datosAlerta.tipo,
            leida: false
        });

        if (!alertaExistente) {
            const nuevaAlerta = new Alerta(datosAlerta);
            await nuevaAlerta.save();
            console.log(`ALERTA CREADA: ${datosAlerta.mensaje}`);
            return nuevaAlerta;
        }
        
        console.log(`INFO: Ya existe una alerta activa de '${datosAlerta.tipo}' para este medicamento.`);
        return null; // No se crea una nueva alerta

    } catch (error) {
        console.error("Error al crear la alerta:", error.message);
        throw error;
    }
};

alertaService.crearAlertaSiNoExiste = crearAlertaSiNoExiste

module.exports = alertaService
