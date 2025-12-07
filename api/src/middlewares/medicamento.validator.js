// api/src/middlewares/medicamento.validator.js
const Joi = require('joi');

// Esquema para creación
const crearSchema = Joi.object({
  nombre: Joi.string().min(1).max(200).required(),
  codigoBarras: Joi.string().min(8).max(50).required(),
  lote: Joi.string().min(1).max(100).required(),
  fechaVencimiento: Joi.date().required(),
  stock: Joi.number().integer().min(0).required(),
  stockMinimo: Joi.number().integer().min(0).allow(null),
  laboratorio: Joi.string().required(),
});

// Esquema para actualización (parcial)
const actualizarSchema = Joi.object({
  nombre: Joi.string().min(1).max(200).optional(),
  lote: Joi.string().min(1).max(100).optional(),
  fechaVencimiento: Joi.date().optional(),
  stock: Joi.number().integer().min(0).optional(),
  stockMinimo: Joi.number().integer().min(0).optional().allow(null),
  laboratorio: Joi.string().optional(),
  activo: Joi.boolean().optional(),
});

const validarMedicamento = (req, res, next) => {
  const { error } = crearSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Fecha de vencimiento futura
  const fecha = new Date(req.body.fechaVencimiento);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  if (fecha <= hoy) {
    return res.status(400).json({ message: "La fecha de vencimiento debe ser posterior a hoy." });
  }

  next();
};

const validarActualizacionMedicamento = (req, res, next) => {
  const { error } = actualizarSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (req.body.fechaVencimiento) {
    const fecha = new Date(req.body.fechaVencimiento);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fecha <= hoy) {
      return res.status(400).json({ message: "La fecha de vencimiento debe ser posterior a hoy." });
    }
  }

  next();
};

module.exports = { validarMedicamento, validarActualizacionMedicamento };
