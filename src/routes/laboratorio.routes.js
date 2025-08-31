const { Router } = require('express')
const laboratorioController = require('../controllers/laboratorio.controller')
const router = Router()


router.get("/", laboratorioController.getAllLaboratorios)
router.post("/", laboratorioController.addLaboratorio)
router.get("/:nombre", laboratorioController.getLaboratorioByName)
router.put("/:nombre", laboratorioController.updateLaboratorio)
router.delete("/:nombre", laboratorioController.deleteLaboratorio)

module.exports = router 