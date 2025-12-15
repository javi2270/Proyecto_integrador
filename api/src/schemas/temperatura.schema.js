const Joi = require("joi");

const registrarTemperaturaSchema = Joi.object({
  valor: Joi.number().min(2).max(8).required()
});

module.exports = { registrarTemperaturaSchema };
