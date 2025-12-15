const Joi = require("joi");

const ingresoStockSchema = Joi.object({
  cantidad: Joi.number().integer().min(1).required()
});

module.exports = { ingresoStockSchema };
