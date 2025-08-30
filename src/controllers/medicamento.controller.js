const Medicamento = require('../models/medicamento.model')

const medicamentoControllers = {}

// Obtener todos los medicamentos
const getAllMedicamentos = async (req, res) => {
    try {
        const medicamentos = await Medicamento.find()
        res.status(200).json(medicamentos)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
medicamentoControllers.getAllMedicamentos = getAllMedicamentos

// Crear un medicamento
const addMedicamento = async (req, res) => {
    const { nombre, codigoBarras, lote, fechaVencimiento, stock } = req.body 
    if (!nombre || !codigoBarras || !lote || !fechaVencimiento || !stock) {
        return res.status(400).json({ message: 'Los campos son obligatorios.' })
    }
    try {
        const medicamento = new Medicamento({
            nombre,
            codigoBarras,
            lote,
            fechaVencimiento,
            stock
        })
        const nuevoMedicamento = await medicamento.save()
        res.status(201).json(nuevoMedicamento)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
medicamentoControllers.addMedicamento = addMedicamento

// Obtener medicamento por código de barras
const getMedicamentoByCodigoBarras = async (req, res) => {
    try {
        const medicamento = await Medicamento.findOne({ codigoBarras: req.params.codigoBarras })
        if (!medicamento) {
            return res.status(404).json({ message: "Medicamento no encontrado" })
        }
        res.status(200).json(medicamento)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
medicamentoControllers.getMedicamentoByCodigoBarras = getMedicamentoByCodigoBarras

// Actualizar medicamento por código de barras
const updateMedicamento = async (req, res) => {
    const { nombre, lote, fechaVencimiento, stock } = req.body
    try {
        const medicamento = await Medicamento.findOneAndUpdate(
            { codigoBarras: req.params.codigoBarras },
            { nombre, lote, fechaVencimiento, stock },
            { new: true, runValidators: true }
        )
        if (!medicamento) {
            return res.status(404).json({ message: "Medicamento no encontrado" })
        }
        res.status(200).json(medicamento)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
medicamentoControllers.updateMedicamento = updateMedicamento

// Eliminar medicamento por código de barras
const deleteMedicamento = async (req, res) => {
    try {
        const medicamento = await Medicamento.findOneAndDelete({ codigoBarras: req.params.codigoBarras })
        if (!medicamento) {
            return res.status(404).json({ message: "Medicamento no encontrado" })
        }
        res.status(200).json({ message: "Medicamento eliminado correctamente" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
medicamentoControllers.deleteMedicamento = deleteMedicamento

module.exports = medicamentoControllers



