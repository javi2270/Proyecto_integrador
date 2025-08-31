const medicamentoService = require("../services/medicamento.service")

// Obtener todos
const getAllMedicamentos = async (req, res) => {
    try {
        const medicamentos = await medicamentoService.getAll()
        res.status(200).json(medicamentos)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Crear
const addMedicamento = async (req, res) => {
    const { nombre, codigoBarras, lote, fechaVencimiento, stock } = req.body 
    if (!nombre || !codigoBarras || !lote || !fechaVencimiento || !stock) {
        return res.status(400).json({ message: "Los campos son obligatorios." })
    }
    try {
        const nuevoMedicamento = await medicamentoService.create({ nombre, codigoBarras, lote, fechaVencimiento, stock })
        res.status(201).json(nuevoMedicamento)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Buscar por código
const getMedicamentoByCodigoBarras = async (req, res) => {
    try {
        const medicamento = await medicamentoService.getByCodigoBarras(req.params.codigoBarras)
        if (!medicamento) return res.status(404).json({ message: "Medicamento no encontrado" })
        res.status(200).json(medicamento)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Buscar por nombre
const getMedicamentoByNombre = async (req, res) => {
    try {
        const medicamento = await medicamentoService.getByNombre(req.params.nombre)
        if (!medicamento) return res.status(404).json({ message: "Medicamento no encontrado" })
        res.status(200).json(medicamento)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Actualizar
const updateMedicamento = async (req, res) => {
    try {
        const medicamento = await medicamentoService.update(req.params.codigoBarras, req.body)
        if (!medicamento) return res.status(404).json({ message: "Medicamento no encontrado" })
        res.status(200).json(medicamento)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Eliminar
const deleteMedicamento = async (req, res) => {
    try {
        const medicamento = await medicamentoService.remove(req.params.codigoBarras)
        if (!medicamento) return res.status(404).json({ message: "Medicamento no encontrado" })
        res.status(200).json({ message: "Medicamento eliminado correctamente" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

module.exports = {
    getAllMedicamentos,
    addMedicamento,
    getMedicamentoByCodigoBarras,
    getMedicamentoByNombre,
    updateMedicamento,
    deleteMedicamento
}
