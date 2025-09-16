const { Router } = require('express')
const medicamentoController = require('../controllers/medicamento.controller')
const { validarMedicamento, validarActualizacionMedicamento } = require('../middlewares/medicamento.validator')
const { validarToken, esAdministrador } = require('../middlewares/auth.validator')
const router = Router()


router.get('/', medicamentoController.getAllMedicamentos)
router.post('/', validarMedicamento, medicamentoController.addMedicamento)
router.get("/:buscar", medicamentoController.getMedicamento);

router.post("/:codigoBarras/ingreso-stock", medicamentoController.registrarIngresoStock);


router.put("/:codigoBarras", [validarToken, esAdministrador], validarActualizacionMedicamento, medicamentoController.updateMedicamento)
router.delete("/:codigoBarras", [validarToken, esAdministrador], medicamentoController.deleteMedicamento)

module.exports = router


