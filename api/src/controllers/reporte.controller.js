const { Venta } = require('../models/index');

exports.reporteVentas = async (req, res) => {
  try {
    const { desde, hasta, medicamento, usuario } = req.query;

    const filtro = {};

    if (desde || hasta) {
      filtro.fecha = {};
      if (desde) filtro.fecha.$gte = new Date(desde);
      if (hasta) filtro.fecha.$lte = new Date(hasta);
    }

    if (medicamento) filtro.medicamento = medicamento;
    if (usuario) filtro.usuario = usuario;

    const ventas = await Venta.find(filtro)
      .populate("medicamento", "nombre codigoBarras")
      .populate("usuario", "nombre email");

    res.status(200).json(ventas);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
