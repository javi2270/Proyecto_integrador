const { Medicamento, Venta } = require('../models/index');
const medicamentoService = require('../services/medicamento.service');
const alertaService = require('../services/alerta.service');

const ventaController = {};

ventaController.addVenta = async (req, res) => {
  try {
    const { identificador, cantidad, motivo } = req.body;

    if (!identificador || typeof identificador !== "string") {
      return res.status(400).json({ message: "El identificador es obligatorio." });
    }
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ message: "La cantidad debe ser mayor a 0." });
    }
    if (!motivo || motivo.trim().length < 3) {
      return res.status(400).json({ message: "El motivo es obligatorio." });
    }

    const medicamento = await medicamentoService.getByIdentificador(identificador);

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
      motivo,
      usuario: req.usuario._id
    });

    await nuevaVenta.save();

    if (medicamento.stock < medicamento.stockMinimo) {
      await alertaService.crearAlertaSiNoExiste({
        medicamento: medicamento._id,
        tipo: 'Bajo Stock',
        mensaje: `Stock bajo para ${medicamento.nombre}.`
      });
    }

    res.status(201).json({
      message: "Venta registrada correctamente.",
      venta: nuevaVenta
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

ventaController.getAllVentas = async (req, res) => {
  try {
    const ventas = await Venta.find()
      .populate("medicamento", "nombre codigoBarras")
      .populate("usuario", "email nombre rol");
    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

ventaController.getVentasByMedicamento = async (req, res) => {
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

module.exports = ventaController;
