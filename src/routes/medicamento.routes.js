const { Router } = require('express')
const medicamentoController = require('../controllers/medicamento.controller')
const route = Router()


route.get('/', medicamentoController.getAllMedicamentos)
route.post('/', medicamentoController.addMedicamento)
route.get("/:codigoBarras", medicamentoController.getMedicamentoByCodigoBarras)
route.put("/:codigoBarras", medicamentoController.updateMedicamento)
route.delete("/:codigoBarras", medicamentoController.deleteMedicamento)

module.exports = route 


