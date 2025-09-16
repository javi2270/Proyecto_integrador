const { crearMedicamentoSchema, actualizarMedicamentoSchema } = require('../schemas/medicamento.schemas')

const validarMedicamento = (req, res, next) => {
    const { error } = crearMedicamentoSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ 
            error: 'Error de validacion', 
            mensaje: error.details[0].message
        })
    }
    next()
}

const validarActualizacionMedicamento = (req, res, next) => {
    const { error } = actualizarMedicamentoSchema.validate(req.body)
    if (error) {
        return res.status(400).json({
            error: 'Error al actualizar',
            mensaje: error.details[0].message
        })
    }
    next()
}


module.exports = { 
    validarMedicamento, 
    validarActualizacionMedicamento 
}