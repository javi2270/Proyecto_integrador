const Medicamento = require('../models/medicamento.model')

const medicamentoControllers = {}

const getAllMedicamentos = async (req, res) => {
    try {
        const medicamentos = await Medicamento.find() 
        res.status(200).json(medicamentos)
    } catch (error) {
        res.sttaus(400).json({message: error.message})
    }
}
medicamentoControllers.getAllMedicamentos = getAllMedicamentos

const addMedicamento = async (req, res) => {
    const { nombre, codigoBarras, lote, fechaVencimiento, stock } = req.body 
    if ( !nombre || !codigoBarras || !lote || !fechaVencimiento || !stock){
        return res.json({ message: 'Los campos son obligatorios.'})
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
        res.status(400).json({message: error.message })
    }
}
medicamentoControllers.addMedicamento = addMedicamento

module.exports = medicamentoControllers


