const express = require('express');
const path = require('path');
const cors = require("cors");

// Cargar variables de entorno (.env)
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const routes = require('./routes');
const { connectionMongo } = require('./db/mongo.db');
const Rol = require('./models/rol.model');
const { iniciarRevisionVencimientos, iniciarAlertaTemperaturaMensual } = require('./services/cron.service');

// Crear roles iniciales si no existen
const crearRolesIniciales = async () => {
    try {
        const count = await Rol.estimatedDocumentCount();
        if (count > 0) return;

        await Promise.all([
            new Rol({ nombre: 'Empleado' }).save(),
            new Rol({ nombre: 'Administrador' }).save()
        ]);

        console.log('Roles iniciales creados: Empleado, Administrador');
    } catch (error) {
        console.error('Error al crear roles iniciales:', error);
        throw error;
    }
};

const app = express();

// Permitir conexión desde frontend (localhost:5173)
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders: "Content-Type, Authorization"
}));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear formularios
app.use(express.urlencoded({ extended: true }));

// Montar todas las rutas bajo /api
app.use('/api', routes);

module.exports = {
    app,
    connectionMongo,
    crearRolesIniciales,
    iniciarRevisionVencimientos,
    iniciarAlertaTemperaturaMensual
};
