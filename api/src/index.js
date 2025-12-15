const {
  app,
  connectionMongo,
  crearRolesIniciales,
  iniciarRevisionVencimientos,
  iniciarAlertaTemperaturaMensual
} = require('./app');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectionMongo();
    await crearRolesIniciales();
    iniciarRevisionVencimientos();
    iniciarAlertaTemperaturaMensual();

    app.listen(PORT, () => {
      console.log(`Servidor iniciado en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
  }
};

startServer();
