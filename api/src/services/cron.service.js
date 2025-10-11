const cron = require('node-cron')
const Medicamento = require('../models/medicamento.model')
const alertaService = require('./alerta.service')
const Temperatura = require('../models/temperatura.model')

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

// Tarea para la alerta de temperatura mensual
const iniciarAlertaTemperaturaMensual = () => {
    cron.schedule('0 9 1 * *', async () => {
        console.log('Ejecutando revision mensual para alerta de temperatura...')

        try {
            const ahora = new Date()
            const primerDiaDelMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
            const ultimoDiaDelMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0)
            // 1. Buscamos si ya existe un registro de temperatura en el mes actual.
            const registroExistente = Temperatura.findOne({
                createdAt: {
                    $gte: primerDiaDelMes, // Mayor o igual que el primer día del mes
                    $lte: ultimoDiaDelMes  // Menor o igual que el último día del mes
                }
            });

            // 2. Si NO existe un registro, creamos la alerta.
            if (!registroExistente) {
                alertaService.crearAlertaSiNoExiste({
                    // No asociamos a un medicamento específico
                    tipo: 'Registro Temperatura',
                    mensaje: 'Recordatorio: Se debe registrar la temperatura del refrigerador este mes.'
                });
            } else {
                console.log('INFO: La temperatura para este mes ya fue registrada. No se crea la alerta.');
            }

        } catch (error) {
            console.error('Error en la tarea programada de alerta de temperatura:', error)  
        }
    })
}



module.exports = { iniciarRevisionVencimientos,iniciarAlertaTemperaturaMensual }