const Joi = require("joi");

const crearVentaSchema = Joi.object({
  identificador: Joi.string().min(1).required(),
  cantidad: Joi.number().integer().min(1).required(),
  motivo: Joi.string().min(3).required()
});

module.exports = { crearVentaSchema };
