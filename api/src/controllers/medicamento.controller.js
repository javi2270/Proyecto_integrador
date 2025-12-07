const medicamentoService = require('../services/medicamento.service');

exports.getByIdentificador = async (req, res) => {
  try {
    const { identificador } = req.params;

    const medicamento = await medicamentoService.getByIdentificador(identificador);

    if (!medicamento) {
      return res.status(404).json({ message: "Medicamento no encontrado." });
    }

    return res.status(200).json(medicamento);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllMedicamentos = async (req, res) => {
  try {
    const medicamentos = await medicamentoService.getAll();
    return res.status(200).json(medicamentos);
  } catch (error) {
    console.error("Error getAllMedicamentos:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.addMedicamento = async (req, res) => {
  try {
    const resultado = await medicamentoService.create(req.body);

    return res.status(resultado.tipo === "REACTIVADO" ? 200 : 201).json({
      success: true,
      tipo: resultado.tipo,
      medicamento: resultado.medicamento,
    });

  } catch (error) {
    console.error("Error en addMedicamento:", error);

    if (error.message === "DUPLICADO_ACTIVO") {
      return res.status(409).json({
        success: false,
        message: "El medicamento ya existe con este código de barras.",
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false, 
        message: "Código de barras ya registrado."
      });
    }

    return res.status(500).json({ success: false, message: "Error interno del servidor." });
  }
};

exports.getMedicamento = async (req, res) => {
  try {
    const { codigoBarras, nombre } = req.query;

    if (!codigoBarras && !nombre) {
      return res.status(400).json({ message: "Debe proporcionar un código o nombre." });
    }

    const medicamento = codigoBarras
      ? await medicamentoService.getByCodigoBarras(codigoBarras)
      : await medicamentoService.getByNombre(nombre);

    if (!medicamento) {
      return res.status(404).json({ message: "Medicamento no encontrado." });
    }

    return res.status(200).json(medicamento);

  } catch (error) {
    console.error("Error getMedicamento:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

exports.updateMedicamento = async (req, res) => {
  try {
    const medic = await medicamentoService.update(req.params.codigoBarras, req.body);

    if (!medic) {
      return res.status(404).json({ message: "Medicamento no encontrado." });
    }

    return res.status(200).json(medic);

  } catch (error) {
    console.error("Error updateMedicamento:", error);
    return res.status(400).json({ message: error.message });
  }
};

exports.deleteMedicamento = async (req, res) => {
  try {
    const medic = await medicamentoService.remove(req.params.codigoBarras);

    if (!medic) {
      return res.status(404).json({ message: "Medicamento no encontrado." });
    }

    return res.status(200).json({ message: "Medicamento eliminado correctamente" });

  } catch (error) {
    console.error("Error deleteMedicamento:", error);
    return res.status(400).json({ message: error.message });
  }
};

exports.registrarIngresoStock = async (req, res) => {
  try {
    const { codigoBarras } = req.params;
    const { cantidad } = req.body;

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      return res.status(400).json({
        message: "La cantidad debe ser un número entero positivo.",
      });
    }

    const med = await medicamentoService.addStock(codigoBarras, cantidad);

    if (!med) {
      return res.status(404).json({ message: "Medicamento no encontrado." });
    }

    return res.status(200).json({
      message: "Stock actualizado correctamente.",
      medicamento: med
    });

  } catch (error) {
    console.error("Error registrarIngresoStock:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};
