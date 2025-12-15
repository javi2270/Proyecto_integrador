const Joi = require("joi");

const usuarioParamSchema = Joi.object({
  usuarioId: Joi.string().hex().length(24).required()
});

module.exports = { usuarioParamSchema };
