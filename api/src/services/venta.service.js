const { Venta } = require("../models");
const medicamentoService = require("./medicamento.service");
const alertaService = require("./alerta.service");

const registrarVenta = async ({ identificador, cantidad, motivo, usuarioId }) => {
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
  const venta = new Venta({
    medicamento: medicamento._id,
    cantidad,
    motivo,
    usuario: usuarioId
  });

  await venta.save();

  // Crear alerta si stock bajo
  if (medicamento.stock < medicamento.stockMinimo) {
    await alertaService.crearAlertaSiNoExiste({
      medicamento: medicamento._id,
      tipo: "Bajo Stock",
      mensaje: `Stock bajo para ${medicamento.nombre}.`
    });
  }

  return venta;
};

module.exports = {
  registrarVenta
};
