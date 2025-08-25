const express = require('express')
const connecMongo = require('./db/mongo.db').connecToDataBase

const PORT = process.env.PORT ?? 3000

const app = express()
 
// Middleware por default para formato json en el body de los POST
app.use(express.json())


app.listen(PORT, async () => {
    console.log(`Aplicacion iniciada en el puerto ${PORT}`)
    await connecMongo()
})

