const usuarioService = require('../services/usuario.service');

const usuarioController = {};

usuarioController.obtenerTodos = async (req, res, next) => {
  try {
    const usuarios = await usuarioService.getAll();
    res.status(200).json(usuarios);
  } catch (error) {
    next(error);
  }
};

usuarioController.actualizarRol = async (req, res, next) => {
  try {
    const { usuarioId } = req.params;
    const { rolId } = req.body;

    if (!rolId) {
      return res.status(400).json({
        message: 'Debe indicar un rol'
      });
    }

    // Admin no puede bajarse su propio rol
    if (req.usuario._id.toString() === usuarioId) {
      return res.status(403).json({
        message: 'No puede modificar su propio rol de administrador'
      });
    }

    const usuarioActualizado =
      await usuarioService.cambiarRol(usuarioId, rolId);

    res.status(200).json(usuarioActualizado);
  } catch (error) {
    next(error);
  }
};

module.exports = usuarioController;
