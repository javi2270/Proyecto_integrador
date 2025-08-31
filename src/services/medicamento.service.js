const Medicamento = require("../models/medicamento.model")

// Obtener todos los medicamentos
const getAll = async () => {
    return await Medicamento.find()
}

// Crear un medicamento
const create = async (data) => {
    const medicamento = new Medicamento(data)
    return await medicamento.save()
}

// Buscar medicamento por código de barras
const getByCodigoBarras = async (codigoBarras) => {
    return await Medicamento.findOne({ codigoBarras })
}

// Buscar medicamento por nombre
const getByNombre = async (nombre) => {
    return await Medicamento.findOne({ nombre })
}

// Actualizar medicamento por código de barras
const update = async (codigoBarras, data) => {
    return await Medicamento.findOneAndUpdate(
        { codigoBarras },
        data,
        { new: true, runValidators: true }
    )
}

// Eliminar medicamento
const remove = async (codigoBarras) => {
    return await Medicamento.findOneAndDelete({ codigoBarras })
}

module.exports = { getAll, create, getByCodigoBarras, getByNombre, update, remove }

