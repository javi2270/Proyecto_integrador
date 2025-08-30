const Laboratorio = require('../models/laboratorio.model')

const laboratorioControllers = {}

// Obtener todos los laboratorios
const getAllLaboratorios = async (req, res) => {
    try {
        const laboratorios = await Laboratorio.find()
        res.status(200).json(laboratorios)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
laboratorioControllers.getAllLaboratorios = getAllLaboratorios

// Crear un laboratorio
const addLaboratorio = async (req, res) => {
    const { nombre, direccion, telefono } = req.body

    if (!nombre) {
        return res.status(400).json({ message: "El nombre es obligatorio." })
    }

    try {
        const laboratorio = new Laboratorio({ nombre, direccion, telefono })
        const nuevoLaboratorio = await laboratorio.save()
        res.status(201).json(nuevoLaboratorio)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
laboratorioControllers.addLaboratorio = addLaboratorio

// Obtener laboratorio por NOMBRE
const getLaboratorioByName = async (req, res) => {
    try {
        const laboratorio = await Laboratorio.findOne({ nombre: req.params.nombre })
        if (!laboratorio) {
            return res.status(404).json({ message: "Laboratorio no encontrado" })
        }
        res.status(200).json(laboratorio)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
laboratorioControllers.getLaboratorioByName = getLaboratorioByName

// Actualizar laboratorio por NOMBRE
const updateLaboratorio = async (req, res) => {
    const { direccion, telefono } = req.body
    try {
        const laboratorio = await Laboratorio.findOneAndUpdate(
            { nombre: req.params.nombre },
            { direccion, telefono },
            { new: true, runValidators: true }
        )
        if (!laboratorio) {
            return res.status(404).json({ message: "Laboratorio no encontrado" })
        }
        res.status(200).json(laboratorio)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
laboratorioControllers.updateLaboratorio = updateLaboratorio

// Eliminar laboratorio por NOMBRE
const deleteLaboratorio = async (req, res) => {
    try {
        const laboratorio = await Laboratorio.findOneAndDelete({ nombre: req.params.nombre })
        if (!laboratorio) {
            return res.status(404).json({ message: "Laboratorio no encontrado" })
        }
        res.status(200).json({ message: "Laboratorio eliminado correctamente" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
laboratorioControllers.deleteLaboratorio = deleteLaboratorio

module.exports = laboratorioControllers
