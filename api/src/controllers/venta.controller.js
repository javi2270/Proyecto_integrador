const { Venta } = require('../models/index');
const medicamentoService = require('../services/medicamento.service');
const alertaService = require('../services/alerta.service');

const ventaController = {};

// Registrar una venta
ventaController.addVenta = async (req, res, next) => {
  try {
    const { identificador, cantidad, motivo } = req.body;

    // Validaciones de entrada
    if (!identificador || typeof identificador !== "string") {
      throw { status: 400, message: "El identificador es obligatorio." };
    }
    if (!cantidad || cantidad <= 0) {
      throw { status: 400, message: "La cantidad debe ser mayor a 0." };
    }
    if (!motivo || motivo.trim().length < 3) {
      throw { status: 400, message: "El motivo es obligatorio." };
    }

    // Buscar medicamento
    const medicamento = await medicamentoService.getByIdentificador(identificador);
    if (!medicamento) {
      throw { status: 404, message: "Medicamento no encontrado." };
    }

    // Validar stock
    if (medicamento.stock < cantidad) {
      throw { status: 400, message: "Stock insuficiente." };
    }

    // Actualizar stock
    medicamento.stock -= cantidad;
    await medicamento.save();

    // Crear venta
    const nuevaVenta = new Venta({
      medicamento: medicamento._id,
      cantidad,
      motivo,
      usuario: req.usuario._id
    });

    await nuevaVenta.save();

    // Crear alerta si stock bajo
    if (medicamento.stock < medicamento.stockMinimo) {
      await alertaService.crearAlertaSiNoExiste({
        medicamento: medicamento._id,
        tipo: "Bajo Stock",
        mensaje: `Stock bajo para ${medicamento.nombre}.`
      });
    }

    res.status(201).json({
      message: "Venta registrada correctamente.",
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
      .populate("medicamento", "nombre codigoBarras")
      .populate("usuario", "email nombre rol");

    res.json(ventas);
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
      throw { status: 404, message: "Medicamento no encontrado." };
    }

    const ventas = await Venta.find({ medicamento: medicamento._id })
      .populate("medicamento", "nombre codigoBarras")
      .populate("usuario", "email nombre rol");

    res.json(ventas);

  } catch (error) {
    next(error);
  }
};

module.exports = ventaController;
