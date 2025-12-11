const { Router } = require('express')
const laboratorioController = require('../controllers/laboratorio.controller')
const { validarToken, esAdministrador } = require('../middlewares/auth.validator')
const validate = require('../middlewares/validate')
const { crearLaboratorioSchema } = require('../schemas/laboratorio.schema')

const router = Router()

router.get("/", laboratorioController.getAllLaboratorios)

router.post(
  "/", 
  [validarToken, esAdministrador, validate(crearLaboratorioSchema)],
  laboratorioController.addLaboratorio
)

router.get("/:nombre", laboratorioController.getLaboratorioByName)

router.delete("/:nombre", [validarToken, esAdministrador], laboratorioController.deleteLaboratorio)

module.exports = router
