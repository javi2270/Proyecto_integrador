const Temperatura = require('../models/temperatura.model')

const temperaturaService = {}

const registrarTemperatura = async (datos) => {
    // extraigo los datos necesarios con desestructuracion
    const { valor, usuarioId } = datos

    // creo una nueva instancia del modelo temperatura
    const nuevoRegistro = new Temperatura({
        valor: valor,
        usuario: usuarioId
    })

    // guardo la instancia en la base de datos y la retorno
    return await nuevoRegistro.save()
}
temperaturaService.registrarTemperatura = registrarTemperatura

module.exports = temperaturaService
