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
    try {
        const nuevoMedicamento = await medicamentoService.create(req.body)
        res.status(201).json(nuevoMedicamento)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Buscar 
const getMedicamento = async (req, res) => {
    const { codigoBarras, nombre } = req.query;

    // Si no se proporciona ningún parámetro de búsqueda, devuelve un error.
    if (!codigoBarras && !nombre) {
        return res.status(400).json({ message: "Debe proporcionar un 'codigoBarras' o 'nombre' para la búsqueda." });
    }
    try {
        let medicamento;
        // Prioriza la búsqueda por código de barras si ambos son proporcionados
        if (codigoBarras) {
            medicamento = await medicamentoService.getByCodigoBarras(codigoBarras);
        } else {
            medicamento = await medicamentoService.getByNombre(nombre);
        }

        if (!medicamento) {
            return res.status(404).json({ message: "Medicamento no encontrado" });
        }

        res.status(200).json(medicamento);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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
    getMedicamento,
    updateMedicamento,
    deleteMedicamento
}
