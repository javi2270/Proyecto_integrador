const { Router } = require('express');
const Rol = require('../models/rol.model');
const { validarToken, esAdministrador } = require('../middlewares/auth.validator');

const router = Router();

// Obtener todos los roles (solo admin)
router.get(
  '/',
  validarToken,
  esAdministrador,
  async (req, res, next) => {
    try {
      const roles = await Rol.find();
      res.json(roles);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
