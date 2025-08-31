const { Router } = require('express')
const medicamentoController = require('../controllers/medicamento.controller')
const { validarMedicamento, validarActualizacionMedicamento } = require('../middlewares/medicamento.validator')
const router = Router()


router.get('/', medicamentoController.getAllMedicamentos)
router.post('/', validarMedicamento, medicamentoController.addMedicamento)
router.get("/:codigoBarras", medicamentoController.getMedicamentoByCodigoBarras)
router.get("/:nombre", medicamentoController.getMedicamentoByNombre)
router.put("/:codigoBarras", validarActualizacionMedicamento, medicamentoController.updateMedicamento)
router.delete("/:codigoBarras", medicamentoController.deleteMedicamento)

module.exports = router


