const { 
  app, 
  connectionMongo, 
  crearRolesIniciales, 
  iniciarRevisionVencimientos, 
  iniciarAlertaTemperaturaMensual 
} = require('./app');

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, async () => {
    console.log(`Aplicación iniciada en el puerto ${PORT}`);
    await connectionMongo();
    await crearRolesIniciales();
    iniciarRevisionVencimientos();
    iniciarAlertaTemperaturaMensual();
});
