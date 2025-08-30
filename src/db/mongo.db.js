require('dotenv').config()
const mongoose = require('mongoose')


const connecMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME})
        console.log('Conexion establecida con exito....')
    } catch (error) {
        console.error('Error al conectar a MongoDB', error.message)
    }
}

module.exports = connecMongo