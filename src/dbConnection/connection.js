require('dotenv').config()
const mongoose = require('mongoose')


const connecMongo = mongoose.connect(process.env.MONGO_URL, {dbName: process.env.MONGO_DB_NAME})

module.exports = connecMongo