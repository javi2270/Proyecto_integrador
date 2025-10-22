const mongoose = require('mongoose')


const connectionMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME})
        console.log('Conexion a MongoDB establecida con exito....')
    } catch (error) {
        console.error('Error al conectar a MongoDB', error.message)
    }
}

module.exports = { connectionMongo }