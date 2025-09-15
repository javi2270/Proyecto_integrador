const cron = require('node-cron')
const Medicamento = require('../models/medicamento.model')
const alertaService = require('./alerta.service')

// Terea que se ejecuta todos los dias a las 8:00 AM 
const iniciarRevisionVencimientos = () => {
    cron.schedule( '0 8 * * *', async () => {
        console.log('Ejecutando revision de vencimientos....')
        const hoy = new Date()
        const fechaLimite = new Date()
        fechaLimite.setDate(hoy.getDate() + 30) // Alerta para medicamentos que vencen en 30 días o menos

        const medicamentosPorVencer = await Medicamento.find({
            fechaVencimiento: { $lte: fechaLimite }
        })

        for ( const med of medicamentosPorVencer) {
            await alertaService.crearAlertaSiNoExiste({
                medicamento: med._id,
                tipo: 'Vencimiento Próximo',
                mensaje: `El medicamento ${med.nombre} está próximo a vencer.`
            })
        }
    })
}

// Tarea para la alerta de temperatura (RF10)
// ... (Implementación similar para la alerta mensual)

module.exports = { iniciarRevisionVencimientos }