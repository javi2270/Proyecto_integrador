const { Medicamento } = require("../models/index");

const getAll = async () => {
  return await Medicamento.find({ activo: true })
    .populate("laboratorio", "nombre")
    .lean();
};

const getByCodigoBarras = async (codigo) => {
  return await Medicamento.findOne({ codigoBarras: codigo, activo: true })
    .populate("laboratorio", "nombre");
};

const getByNombre = async (nombre) => {
  return await Medicamento.findOne({ nombre, activo: true })
    .populate("laboratorio", "nombre");
};

// requerido por ventas
const getByIdentificador = async (identificador) => {
  return await Medicamento.findOne({
    activo: true,
    $or: [
      { codigoBarras: identificador },
      { nombre: identificador }
    ]
  }).populate("laboratorio", "nombre");
};

const create = async (data) => {
  const existente = await Medicamento.findOne({
    codigoBarras: data.codigoBarras,
  });

  if (existente && existente.activo) {
    const err = new Error("DUPLICADO_ACTIVO");
    throw err;
  }

  if (existente && !existente.activo) {
    existente.nombre = data.nombre;
    existente.lote = data.lote;
    existente.fechaVencimiento = data.fechaVencimiento;
    existente.stock = data.stock;
    existente.stockMinimo = data.stockMinimo;
    existente.laboratorio = data.laboratorio;
    existente.activo = true;

    await existente.save();

    return {
      tipo: "REACTIVADO",
      medicamento: existente,
    };
  }

  const nuevo = new Medicamento(data);
  await nuevo.save();

  return {
    tipo: "CREADO",
    medicamento: nuevo,
  };
};

const update = async (codigo, data) => {
  return await Medicamento.findOneAndUpdate(
    { codigoBarras: codigo, activo: true },
    data,
    { new: true }
  )
    .populate("laboratorio", "nombre")
    .lean();
};

const remove = async (codigo) => {
  return await Medicamento.findOneAndUpdate(
    { codigoBarras: codigo, activo: true },
    { activo: false },
    { new: true }
  );
};

const addStock = async (codigoBarras, cantidad) => {
  const med = await Medicamento.findOne({
    codigoBarras,
    activo: true,
  });

  if (!med) return null;

  med.stock += cantidad;
  await med.save();

  return med;
};

module.exports = {
  getAll,
  create,
  getByCodigoBarras,
  getByNombre,
  getByIdentificador, 
  update,
  remove,
  addStock,
};
