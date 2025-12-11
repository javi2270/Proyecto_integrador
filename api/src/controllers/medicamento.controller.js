const medicamentoService = require('../services/medicamento.service');

exports.getByIdentificador = async (req, res, next) => {
  try {
    const { identificador } = req.params;

    const medicamento = await medicamentoService.getByIdentificador(identificador);

    if (!medicamento) {
      throw { status:404, message: 'Medicamento no encontrado.' }
    }

    res.json(medicamento);

  } catch (error) {
    next(error)
  }
};

exports.getAllMedicamentos = async (req, res, next) => {
  try {
    const medicamentos = await medicamentoService.getAll();
    res.json(medicamentos);
  } catch (error) {
    next(error)
  }
};

exports.addMedicamento = async (req, res, next) => {
  try {
    const resultado = await medicamentoService.create(req.body);

    res.status(resultado.tipo === "REACTIVADO" ? 200 : 201).json({
      success: true,
      tipo: resultado.tipo,
      medicamento: resultado.medicamento,
    });

  } catch (error) {
    if (error.message === "DUPLICADO_ACTIVO") {
      return next({ status:409, message: "El medicamento ya existe con este codigo de barras."})
    }
 
    if (error.code === 11000) {
      return next({ status:409, message: "Codigo de barras ya registrado."})
    }

    next(error)
  }
}

exports.getMedicamento = async (req, res, next) => {
  try {
    const { codigoBarras, nombre } = req.query;

    if (!codigoBarras && !nombre) {
      throw { status:400, message: "Debe proporcionar un codigo o nombre." }
    }

    const medicamento = codigoBarras
      ? await medicamentoService.getByCodigoBarras(codigoBarras)
      : await medicamentoService.getByNombre(nombre);

    if (!medicamento) {
      throw { status:404, message: "Medicamento no encontrado." }
    }

    res.json(medicamento)

  } catch (error) {
    next(error)
  }
};

exports.updateMedicamento = async (req, res, next) => {
  try {
    const medic = await medicamentoService.update(req.params.codigoBarras, req.body);

    if (!medic) {
      throw { status:404, message: "Medicamento no encontrado." }
    }

    res.json(medic);

  } catch (error) {
    next(error)
  }
};

exports.deleteMedicamento = async (req, res, next) => {
  try {
    const medic = await medicamentoService.remove(req.params.codigoBarras);

    if (!medic) {
      throw { status:404, message: "Medicamento no encontrado." }
    }

    res.json({ message: "Medicamento eliminado correctamente" })

  } catch (error) {
    next(error)
  }
}

exports.registrarIngresoStock = async (req, res) => {
  try {
    const { codigoBarras } = req.params;
    const { cantidad } = req.body;

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw { status:400, message: "La cantidad debe ser un numero entero positivo." }
    }
    const med = await medicamentoService.addStock(codigoBarras, cantidad);

    if (!med) {
      throw { status:404, message: "medicamento no encontrado." }
    }

    res.json({
      message: "Stock actualizado correctamente.",
      medicamento: med
    });

  } catch (error) {
    next(error)
  }
}
