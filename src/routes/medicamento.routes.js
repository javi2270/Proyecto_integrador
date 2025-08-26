const { Router } = require('express')
const medicamentoControllers = require('../controllers/medicamento.controller')
const route = Router()


route.get('/', medicamentoControllers.getAllMedicamentos)
route.post('/', medicamentoControllers.addMedicamento)


module.exports = route 


