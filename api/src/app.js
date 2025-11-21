const express = require('express');
const path = require('path')

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
            new Rol({ nombre: 'Empleado' }).save(), // Corregido para que coincida con las pruebas
            new Rol({ nombre: 'Administrador' }).save()
        ]);
        console.log('Valores iniciales creados:', values.map(rol => rol.nombre));
    } catch (error) {
        console.error('Error al crear los valores iniciales.', error);
        throw error; // Lanzamos el error para que las pruebas puedan detectarlo si falla
    }
};

const app = express();
app.use(express.json());
app.use(routes);

// Exportamos todo para que sea reutilizable
module.exports = { app, connectionMongo, crearRolesIniciales, iniciarRevisionVencimientos, iniciarAlertaTemperaturaMensual };
