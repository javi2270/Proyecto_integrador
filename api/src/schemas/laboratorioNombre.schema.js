const Joi = require("joi");

const laboratorioNombreSchema = Joi.object({
  nombre: Joi.string().min(1).required()
});

module.exports = { laboratorioNombreSchema };
