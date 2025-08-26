const express = require('express')
require('dotenv').config()
const route = require('./routes/medicamento.routes')

const connecMongo = require('./db/mongo.db').connecToDataBase

const app = express()

app.use('/medicamentos' ,route)

const PORT = process.env.PORT ?? 3000


 
// Middleware por default para formato json en el body de los POST
app.use(express.json())


app.listen(PORT, async () => {
    console.log(`Aplicacion iniciada en el puerto ${PORT}`)
    await connecMongo()
})

