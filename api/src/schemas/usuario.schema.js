const joi = require("joi");

const actualizarRolSchema = joi.object({
  rolId: joi.string().hex().length(24).required().messages({
    "any.required": "El rolId es obligatorio.",
    "string.length": "El rolId debe tener 24 caracteres.",
    "string.hex": "El rolId debe ser un ID hexadecimal válido."
  })
});

module.exports = { actualizarRolSchema };
