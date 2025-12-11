const Laboratorio = require('../models/laboratorio.model');

const laboratorioController = {};

// Obtener todos los laboratorios
laboratorioController.getAllLaboratorios = async (req, res, next) => {
    try {
        const laboratorios = await Laboratorio.find();
        res.json(laboratorios);
    } catch (error) {
        next(error);
    }
};

// Crear laboratorio
laboratorioController.addLaboratorio = async (req, res, next) => {
    try {
        const { nombre, direccion, telefono } = req.body;

        if (!nombre) {
            throw { status: 400, message: "El nombre es obligatorio." };
        }

        const laboratorio = new Laboratorio({ nombre, direccion, telefono });
        const nuevoLaboratorio = await laboratorio.save();

        res.status(201).json(nuevoLaboratorio);
    } catch (error) {
        next(error);
    }
};

// Obtener laboratorio por nombre
laboratorioController.getLaboratorioByName = async (req, res, next) => {
    try {
        const { nombre } = req.params;

        const laboratorio = await Laboratorio.findOne({ nombre });

        if (!laboratorio) {
            throw { status: 404, message: "Laboratorio no encontrado." };
        }

        res.json(laboratorio);
    } catch (error) {
        next(error);
    }
};

// Eliminar laboratorio por nombre
laboratorioController.deleteLaboratorio = async (req, res, next) => {
    try {
        const { nombre } = req.params;

        const laboratorio = await Laboratorio.findOneAndDelete({ nombre });

        if (!laboratorio) {
            throw { status: 404, message: "Laboratorio no encontrado." };
        }

        res.json({ message: "Laboratorio eliminado correctamente." });
    } catch (error) {
        next(error);
    }
};

module.exports = laboratorioController;
