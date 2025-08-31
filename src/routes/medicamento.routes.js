const { Router } = require('express')
const medicamentoController = require('../controllers/medicamento.controller')
const router = Router()


router.get('/', medicamentoController.getAllMedicamentos)
router.post('/', medicamentoController.addMedicamento)
router.get("/:codigoBarras", medicamentoController.getMedicamentoByCodigoBarras)
router.get("/:nombre", medicamentoController.getMedicamentoByNombre)
router.put("/:codigoBarras", medicamentoController.updateMedicamento)
router.delete("/:codigoBarras", medicamentoController.deleteMedicamento)

module.exports = router


