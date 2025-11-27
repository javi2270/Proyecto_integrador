const { Medicamento, Venta } = require('../models/index');
const medicamentoService = require('../services/medicamento.service');
const alertaService = require('../services/alerta.service');

const ventaController = {};

// Registrar una venta
const addVenta = async (req, res) => {
  try {
    const { identificador, cantidad, motivo } = req.body;

    if (!identificador || !cantidad || cantidad <= 0) {
      return res.status(400).json({
        message: "El identificador y una cantidad válida son obligatorios."
      });
    }

    const medicamento =
      await medicamentoService.getByCodigoBarras(identificador) ||
      await medicamentoService.getByNombre(identificador);

    if (!medicamento) {
      return res.status(404).json({ message: "Medicamento no encontrado." });
    }

    if (medicamento.stock < cantidad) {
      return res.status(400).json({ message: "Stock insuficiente." });
    }

    medicamento.stock -= cantidad;
    await medicamento.save();

    const nuevaVenta = new Venta({
      medicamento: medicamento._id,
      cantidad,
      motivo: motivo || "Venta",

      // ⭐⭐ NUEVO: SE GUARDA EL USUARIO AUTENTICADO ⭐⭐
      usuario: req.usuario._id
    });

    await nuevaVenta.save();

    // Si bajó del stock mínimo → crear alerta
    if (medicamento.stock < medicamento.stockMinimo) {
      await alertaService.crearAlertaSiNoExiste({
        medicamento: medicamento._id,
        tipo: "Bajo Stock",
        mensaje: `El stock de ${medicamento.nombre} ha caído por debajo del mínimo.`
      });
    }

    res.status(201).json({
      message: "Venta registrada con éxito",
      venta: nuevaVenta
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
ventaController.addVenta = addVenta;

// Obtener todas las ventas
const getAllVentas = async (req, res) => {
  try {
    const ventas = await Venta.find()
      .populate("medicamento", "nombre codigoBarras")
      .populate("usuario", "email nombre rol");

    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
ventaController.getAllVentas = getAllVentas;

// Ventas por medicamento
const getVentasByMedicamento = async (req, res) => {
  try {
    const { identificador } = req.params;

    const medicamento = await medicamentoService.getByIdentificador(identificador);

    if (!medicamento) {
      return res.status(404).json({ message: "Medicamento no encontrado." });
    }

    const ventas = await Venta.find({ medicamento: medicamento._id })
      .populate("medicamento", "nombre codigoBarras")
      .populate("usuario", "email nombre rol");

    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
ventaController.getVentasByMedicamento = getVentasByMedicamento;

module.exports = ventaController;
