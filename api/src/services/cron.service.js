const cron = require('node-cron');
const Medicamento = require('../models/medicamento.model');
const alertaService = require('./alerta.service');
const Temperatura = require('../models/temperatura.model');

const iniciarRevisionVencimientos = () => {
  cron.schedule('* * * * *', async () => {
    console.log('Ejecutando revisión de vencimientos...');
    const hoy = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(hoy.getDate() + 30);

    const medicamentosPorVencer = await Medicamento.find({
      fechaVencimiento: { $lte: fechaLimite },
      activo: true
    });

    for (const med of medicamentosPorVencer) {
      await alertaService.crearAlertaSiNoExiste({
        medicamento: med._id,
        tipo: 'Vencimiento Proximo',
        mensaje: `El medicamento ${med.nombre} está próximo a vencer.`
      });
    }
  });
};

const iniciarAlertaTemperaturaMensual = () => {
  cron.schedule('* * * * *', async () => {
    console.log('Revisión mensual de temperatura...');

    try {
      const ahora = new Date();
      const primerDia = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      const ultimoDia = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);

      const registro = await Temperatura.findOne({
        createdAt: { $gte: primerDia, $lte: ultimoDia }
      });

      if (!registro) {
        await alertaService.crearAlertaSiNoExiste({
          tipo: 'Registro Temperatura',
          mensaje: 'Recordatorio: registrar la temperatura mensual del refrigerador.'
        });
      }
    } catch (error) {
      console.error('Error en alerta mensual:', error);
    }
  });
};

module.exports = { iniciarRevisionVencimientos, iniciarAlertaTemperaturaMensual };
