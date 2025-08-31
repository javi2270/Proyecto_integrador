const express = require('express')
require('dotenv').config()
const routes = require('./routes/index')
const connectionMongo = require('./db/mongo.db')

const app = express()

// Middleware por default para formato json en el body de los POST
app.use(express.json())

app.use(routes)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, async () => {
    console.log(`Aplicacion iniciada en el puerto ${PORT}`)
    await connectionMongo
})

 