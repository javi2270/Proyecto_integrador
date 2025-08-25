const mongoose = require('mongoose')
const MONGO_URL = process.env.MONGO_URL ?? "mongodb://admin:admin1234@localhost:27017/medicamento?authSource=admin"

const connecToDataBase = async () => {
    try {
        await mongoose.connect(MONGO_URL)
        console.log('Conexion a mongo realizada con exito.')
    } catch (error) {
        console.error('Error al conectarse a mongo.', error.message)
    }
}

module.exports = {mongoose, connecToDataBase}
    
