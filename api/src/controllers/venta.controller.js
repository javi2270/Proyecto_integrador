const { Medicamento, Venta } = require('../models/index')
const medicamentoService = require('../services/medicamento.service') 
const alertaService = require('../services/alerta.service'); // Importamos el nuevo servicio

const ventaController = {}

// Registrar una venta
const addVenta = async (req, res) => {
    try {
        const { identificador, cantidad, motivo } = req.body
        if (!identificador || !cantidad || cantidad <= 0) {
            return res.status(400).json({ message: "El identificador y una cantidad valida (mayor que 0) son obligatorios." })
        }

        // --- Lógica de Venta Existente ---
        const medicamento = await medicamentoService.getByCodigoBarras(identificador) || await medicamentoService.getByNombre(identificador);


        if (!medicamento) {
            return res.status(404).json({ message: "Medicamento no encontrado." })
        }

        if (medicamento.stock < cantidad) {
            return res.status(400).json({ message: "Stock insuficiente." })
        }

        medicamento.stock -= cantidad
        await medicamento.save()

        const nuevaVenta = new Venta({
            medicamento: medicamento._id,
            cantidad,
            motivo: motivo || "Venta"
        })
        await nuevaVenta.save()

        // --- NUEVA LÓGICA DE ALERTA ---
        // Después de guardar, verificamos si el stock cayó por debajo del mínimo
        if (medicamento.stock < medicamento.stockMinimo) {
            await alertaService.crearAlertaSiNoExiste({
                medicamento: medicamento._id,
                tipo: 'Bajo Stock',
                mensaje: `El stock de ${medicamento.nombre} (${medicamento.codigoBarras}) ha caído por debajo del mínimo. Stock actual: ${medicamento.stock}.`
            });
        }
        // --- FIN DE LA NUEVA LÓGICA ---

        res.status(201).json({ message: "Venta registrada con éxito", venta: nuevaVenta })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
ventaController.addVenta = addVenta

// Obtener todas las ventas (con info de medicamento)
const getAllVentas = async (req, res) => {
    try {
        const ventas = await Venta.find().populate("medicamento", "nombre codigoBarras")
        res.status(200).json(ventas)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
ventaController.getAllVentas = getAllVentas

// Obtener ventas por medicamento (buscar por código o nombre)
const getVentasByMedicamento = async (req, res) => {
    try {
        const { identificador } = req.params

        const medicamento = await medicamentoService.getByIdentificador(identificador)

        if (!medicamento) {
            return res.status(404).json({ message: "Medicamento no encontrado." })
        }

        const ventas = await Venta.find({ medicamento: medicamento._id })
            .populate("medicamento", "nombre codigoBarras")

        res.status(200).json(ventas)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
ventaController.getVentasByMedicamento = getVentasByMedicamento

module.exports = ventaController
