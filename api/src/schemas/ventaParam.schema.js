const Joi = require("joi");

const identificadorParamSchema = Joi.object({
  identificador: Joi.string().min(1).required()
});

module.exports = { identificadorParamSchema };
