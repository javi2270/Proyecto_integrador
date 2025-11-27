const mongoose = require("mongoose");

const connectionMongo = async (isTest = false) => {
  try {
    const dbName = isTest
      ? process.env.MONGO_DB_NAME_TEST
      : process.env.MONGO_DB_NAME;

    await mongoose.connect(process.env.MONGO_URL, {
      dbName,
    });

    console.log(`Mongo conectado correctamente a la base: ${dbName}`);
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
  }
};

module.exports = { connectionMongo };
