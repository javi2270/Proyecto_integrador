const { Router } = require('express');
const laboratorioController = require('../controllers/laboratorio.controller');
const { validarToken, esAdministrador } = require('../middlewares/auth.validator');
const validate = require('../middlewares/validate');
const { crearLaboratorioSchema } = require('../schemas/laboratorio.schema');

const router = Router();

// Obtener todos los laboratorios
router.get("/", laboratorioController.getAllLaboratorios);

// Crear un laboratorio
router.post(
  "/",
  [validarToken, esAdministrador, validate(crearLaboratorioSchema)],
  laboratorioController.addLaboratorio
);

// Obtener laboratorio por nombre
router.get("/:nombre", laboratorioController.getLaboratorioByName);

// Eliminar laboratorio por nombre
router.delete(
  "/:nombre",
  [validarToken, esAdministrador],
  laboratorioController.deleteLaboratorio
);

module.exports = router;
