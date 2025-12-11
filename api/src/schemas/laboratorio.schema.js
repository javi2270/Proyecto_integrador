const joi = require("joi");

const crearLaboratorioSchema = joi.object({
  nombre: joi.string().min(2).max(255).required().messages({
    "string.empty": "El nombre del laboratorio es obligatorio.",
    "any.required": "El nombre del laboratorio es obligatorio."
  }),
  direccion: joi.string().allow("", null),
  telefono: joi.string().allow("", null)
});

module.exports = { crearLaboratorioSchema };
