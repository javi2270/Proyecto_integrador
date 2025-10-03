const joi = require('joi')

const registroSchema = joi.object({
    nombre: joi.string().min(3).max(100).required(),
    enmail: joi.string().email().required(),
    password: joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
    .required()
    .messages({
        'string.min': 'La contraseña debe tener al menos 8 caracteres.',
        'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número.'
    })
})

module.exports = { registroSchema } 