const { Router } = require('express')
const laboratorioController = require('../controllers/laboratorio.controller')
const route = Router()


route.get("/", laboratorioController.getAllLaboratorios)
route.post("/", laboratorioController.addLaboratorio)
route.get("/:nombre", laboratorioController.getLaboratorioByName)
route.put("/:nombre", laboratorioController.updateLaboratorio)
route.delete("/:nombre", laboratorioController.deleteLaboratorio)

module.exports = route 