const express = require('express')
require('dotenv').config()
const route = require('./routes/medicamento.routes')
const mongoose = require('mongoose')

const app = express()

// Middleware por default para formato json en el body de los POST
app.use(express.json())

const connecMongo = mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME})

app.use('/medicamentos' ,route)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, async () => {
    console.log(`Aplicacion iniciada en el puerto ${PORT}`)
    await connecMongo
    
})

 