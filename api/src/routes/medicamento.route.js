const { Router } = require("express");
const medicamentoController = require("../controllers/medicamento.controller");
const validate = require("../middlewares/validate");
const { crearMedicamentoSchema, actualizarMedicamentoSchema } = require("../schemas/medicamento.schema");


const router = Router();

// Obtener todos
router.get("/all", medicamentoController.getAllMedicamentos);

// Buscar por código o nombre (identificador)
router.get("/buscar/:identificador", medicamentoController.getByIdentificador);

// Buscar uno (query)
router.get("/", medicamentoController.getMedicamento);

// Crear
router.post("/",validate(crearMedicamentoSchema), medicamentoController.addMedicamento);

// Actualizar
router.put("/:codigoBarras", validate(actualizarMedicamentoSchema), medicamentoController.updateMedicamento);

// Eliminar 
router.delete("/:codigoBarras", medicamentoController.deleteMedicamento);

// Ingreso de stock
router.post("/:codigoBarras/ingreso-stock", medicamentoController.registrarIngresoStock);

module.exports = router;
