const joi = require("joi");

const registerSchema = joi.object({
  nombre: joi.string().min(3).max(100).required().messages({
    "any.required": "El nombre es obligatorio.",
    "string.empty": "El nombre no puede estar vacío.",
    "string.min": "El nombre debe tener al menos 3 caracteres."
  }),

  email: joi.string().email().required().messages({
    "any.required": "El email es obligatorio.",
    "string.email": "Formato de email inválido."
  }),

  password: joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/)
    .required()
    .messages({
      "any.required": "La contraseña es obligatoria.",
      "string.min": "La contraseña debe tener mínimo 8 caracteres.",
      "string.pattern.base": "La contraseña debe incluir mayúscula, minúscula y número."
    })
});

const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    "any.required": "El email es obligatorio."
  }),
  password: joi.string().required().messages({
    "any.required": "La contraseña es obligatoria."
  })
});

module.exports = { registerSchema, loginSchema };
