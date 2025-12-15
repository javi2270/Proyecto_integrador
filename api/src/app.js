const express = require('express');
const path = require('path');
const cors = require("cors");

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const routes = require('./routes');
const { connectionMongo } = require('./db/mongo.db');
const Rol = require('./models/rol.model');
const { 
    iniciarRevisionVencimientos, 
    iniciarAlertaTemperaturaMensual,
    verificarTemperaturaMensual 
} = require('./services/cron.service');

const crearRolesIniciales = async () => {
    try {
        const count = await Rol.estimatedDocumentCount();
        if (count > 0) return;

        await Promise.all([
            new Rol({ nombre: 'Empleado' }).save(),
            new Rol({ nombre: 'Administrador' }).save()
        ]);

        console.log('Roles iniciales creados');
    } catch (error) {
        console.error('Error al crear roles iniciales:', error);
        throw error;
    }
};

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders: "Content-Type, Authorization"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = {
    app,
    connectionMongo,
    crearRolesIniciales,
    iniciarRevisionVencimientos,
    iniciarAlertaTemperaturaMensual,
    verificarTemperaturaMensual
};
