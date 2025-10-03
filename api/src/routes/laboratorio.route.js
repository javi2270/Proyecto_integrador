const { Router } = require('express')
const laboratorioController = require('../controllers/laboratorio.controller')
const { validarToken, esAdministrador } = require('../middlewares/auth.validator')
const router = Router()


router.get("/", laboratorioController.getAllLaboratorios)
router.post("/", [validarToken, esAdministrador], laboratorioController.addLaboratorio)
router.get("/:nombre", laboratorioController.getLaboratorioByName)
router.put("/:nombre", [validarToken, esAdministrador], laboratorioController.updateLaboratorio)
router.delete("/:nombre", [validarToken, esAdministrador], laboratorioController.deleteLaboratorio)

module.exports = router 