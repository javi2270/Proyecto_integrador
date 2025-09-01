const joi = require('joi')

const crearMedicamentoSchema = joi.object({
    nombre: joi.string().trim().min(3).max(255).required().messages({
        'any.required': 'El campo "nombre" es obligatorio.',
        'string.empty': 'El campo "nombre" no puede estar vacío.',
        'string.min': 'El "nombre" debe tener un mínimo de {#limit} caracteres.',
        'string.max': 'El "nombre" no puede exceder los {#limit} caracteres.'
    }),

    codigoBarras: joi.string().pattern(/^\d{13}$/).required().messages({
        'any.required': 'El campo "codigoBarras" es obligatorio.',
        'string.empty': 'El campo "codigoBarras" no puede estar vacío.',
        'string.pattern.base': 'El "codigoBarras" debe consistir en exactamente 13 dígitos numéricos.'
    }),

    lote: joi.string().trim().required().messages({
        'any.required': 'El campo "lote" es obligatorio.',
        'string.empty': 'El campo "lote" no puede estar vacío.'
    }),

    fechaVencimiento: joi.date().iso().required().messages({
        'any.required': 'El campo "fechaVencimiento" es obligatorio.',
        'date.base': 'El campo "fechaVencimiento" debe ser una fecha válida.',
        'date.format': 'La "fechaVencimiento" debe tener el formato estándar ISO (YYYY-MM-DD).'
    }),

    stock: joi.number().integer().min(0).required().messages({
        'any.required': 'El campo "stock" es obligatorio.',
        'number.base': 'El "stock" debe ser un número.',
        'number.integer': 'El "stock" debe ser un número entero.',
        'number.min': 'El "stock" no puede ser un número negativo.'
    }),

    stockMinimo: joi.number().integer().min(0).default(0).messages({
        'number.base': 'El "stockMinimo" debe ser un número.',
        'number.integer': 'El "stockMinimo" debe ser un número entero.',
        'number.min': 'El "stockMinimo" no puede ser un número negativo.'
    }),

    laboratorio: joi.string().hex().length(24).required().messages({
        'any.required': 'El campo "laboratorio" (ID) es obligatorio.',
        'string.empty': 'El campo "laboratorio" no puede estar vacío.',
        'string.hex': 'El ID del "laboratorio" debe ser una cadena hexadecimal.',
        'string.length': 'El ID del "laboratorio" debe tener exactamente {#limit} caracteres.'
    })
});

const actualizarMedicamentoSchema = joi.object({
    nombre: joi.string().trim().min(3).max(255).messages({
        'string.empty': 'El campo "nombre" no puede estar vacío.',
        'string.min': 'El "nombre" debe tener un mínimo de {#limit} caracteres.',
        'string.max': 'El "nombre" no puede exceder los {#limit} caracteres.'
    }),

    codigoBarras: joi.string().pattern(/^\d{13}$/).messages({
        'string.empty': 'El campo "codigoBarras" no puede estar vacío.',
        'string.pattern.base': 'El "codigoBarras" debe consistir en exactamente 13 dígitos numéricos.'
    }),

    lote: joi.string().trim().messages({
        'string.empty': 'El campo "lote" no puede estar vacío.'
    }),

    fechaVencimiento: joi.date().iso().messages({
        'date.base': 'El campo "fechaVencimiento" debe ser una fecha válida.',
        'date.format': 'La "fechaVencimiento" debe tener el formato estándar ISO (YYYY-MM-DD).'
    }),

    stock: joi.number().integer().min(0).messages({
        'number.base': 'El "stock" debe ser un número.',
        'number.integer': 'El "stock" debe ser un número entero.',
        'number.min': 'El "stock" no puede ser un número negativo.'
    }),

    stockMinimo: joi.number().integer().min(0).messages({
        'number.base': 'El "stockMinimo" debe ser un número.',
        'number.integer': 'El "stockMinimo" debe ser un número entero.',
        'number.min': 'El "stockMinimo" no puede ser un número negativo.'
    }),

    laboratorio: joi.string().hex().length(24).messages({
        'string.empty': 'El campo "laboratorio" no puede estar vacío.',
        'string.hex': 'El ID del "laboratorio" debe ser una cadena hexadecimal.',
        'string.length': 'El ID del "laboratorio" debe tener exactamente {#limit} caracteres.'
    })
}).min(1).messages({
    'object.min': 'Debes proporcionar al menos un campo para actualizar.'
});


module.exports = {
    crearMedicamentoSchema,
    actualizarMedicamentoSchema
};
