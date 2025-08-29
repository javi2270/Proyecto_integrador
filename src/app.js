const express = require('express')
require('dotenv').config()
const route = require('./routes/medicamento.routes')
const connectionMongo = require('./dbConnection/connection')

const app = express()

// Middleware por default para formato json en el body de los POST
app.use(express.json())

app.use('/medicamentos' ,route)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, async () => {
    console.log(`Aplicacion iniciada en el puerto ${PORT}`)
    await connectionMongo()
})

 