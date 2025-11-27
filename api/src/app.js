const express = require('express');
const path = require('path');

// Le decimos a dotenv que busque el archivo .env en la carpeta padre de /src
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const routes = require('./routes');
const { connectionMongo } = require('./db/mongo.db');
const Rol = require('./models/rol.model');
const { iniciarRevisionVencimientos, iniciarAlertaTemperaturaMensual } = require('./services/cron.service');

const crearRolesIniciales = async () => {
    try {
        const count = await Rol.estimatedDocumentCount();
        if (count > 0) return;
        const values = await Promise.all([
            new Rol({ nombre: 'Empleado' }).save(),
            new Rol({ nombre: 'Administrador' }).save()
        ]);
        console.log('Valores iniciales creados:', values.map(r => r.nombre));
    } catch (error) {
        console.error('Error al crear roles iniciales.', error);
        throw error;
    }
};

const app = express();
app.use(express.json());

// ✅ Rutas montadas correctamente en /api
app.use('/api', routes);

// ❌ YA NO USAR ESTO — lo hacía duplicado y mal
// app.use('/api/ventas', require('./routes/venta.route'));

module.exports = { app, connectionMongo, crearRolesIniciales, iniciarRevisionVencimientos, iniciarAlertaTemperaturaMensual };
