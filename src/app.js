const express = require('express')
require('dotenv').config()
const routes = require('./routes/index')
const connectionMongo = require('./db/mongo.db')
const Rol = require('./models/rol.model')

const crearRolesIniciales = async () => {
    try {
// cuento cuantos documentos hay en la coleccion (roles)
    const count = Rol.estimatedDocumentCount()
// si hay roles no hago nada y salgo de la funcion
    if (count > 0) return
// si no hay roles los creo de forma simultanea
    const values = await Promise.all([
        new Rol({ nombre: 'Empleado de Farmacia'}).save(),
        new Rol({ nombre: 'Administrador'}).save()
    ])
    console.log('Valores iniciales creados', values.map(rol => rol.nombre)) 
    } catch (error) {
        console.error('Error al crear los valores iniciales.', error)
    }
}

const app = express()

// Middleware por default para formato json en el body de los POST
app.use(express.json())

app.use(routes)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, async () => {
    console.log(`Aplicacion iniciada en el puerto ${PORT}`)
    await connectionMongo
    await crearRolesIniciales()
})

 