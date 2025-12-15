const { Venta } = require('../models');
const medicamentoService = require('../services/medicamento.service');
const alertaService = require('../services/alerta.service');

const ventaController = {};

// Registrar una venta
ventaController.addVenta = async (req, res, next) => {
  try {
    const { identificador, cantidad, motivo } = req.body;

    if (!identificador || typeof identificador !== 'string') {
      return res.status(400).json({ message: 'El identificador es obligatorio.' });
    }

    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ message: 'La cantidad debe ser mayor a 0.' });
    }

    if (!motivo || motivo.trim().length < 3) {
      return res.status(400).json({ message: 'El motivo es obligatorio.' });
    }

    const medicamento = await medicamentoService.getByIdentificador(identificador);
    if (!medicamento) {
      return res.status(404).json({ message: 'Medicamento no encontrado.' });
    }

    if (medicamento.stock < cantidad) {
      return res.status(400).json({ message: 'Stock insuficiente.' });
    }

    medicamento.stock -= cantidad;
    await medicamento.save();

    const nuevaVenta = await Venta.create({
      medicamento: medicamento._id,
      cantidad,
      motivo,
      usuario: req.usuario._id
    });

    if (medicamento.stock < medicamento.stockMinimo) {
      await alertaService.crearAlertaSiNoExiste({
        medicamento: medicamento._id,
        tipo: 'Bajo Stock',
        mensaje: `Stock bajo para ${medicamento.nombre}.`
      });
    }

    return res.status(201).json({
      message: 'Venta registrada correctamente.',
      venta: nuevaVenta
    });

  } catch (error) {
    next(error);
  }
};

// Obtener todas las ventas
ventaController.getAllVentas = async (req, res, next) => {
  try {
    const ventas = await Venta.find()
      .populate('medicamento', 'nombre codigoBarras')
      .populate('usuario', 'nombre email');

    return res.json(ventas);
  } catch (error) {
    next(error);
  }
};

// Obtener ventas por medicamento
ventaController.getVentasByMedicamento = async (req, res, next) => {
  try {
    const { identificador } = req.params;

    const medicamento = await medicamentoService.getByIdentificador(identificador);
    if (!medicamento) {
      return res.status(404).json({ message: 'Medicamento no encontrado.' });
    }

    const ventas = await Venta.find({ medicamento: medicamento._id })
      .populate('medicamento', 'nombre codigoBarras')
      .populate('usuario', 'nombre email');

    return res.json(ventas);
  } catch (error) {
    next(error);
  }
};

module.exports = ventaController;
