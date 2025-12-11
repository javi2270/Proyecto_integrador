const Temperatura = require('../models/temperatura.model')

const temperaturaService = {}

const registrarTemperatura = async (datos) => {

    const { valor, usuarioId } = datos

    const nuevoRegistro = new Temperatura({
        valor: valor,
        usuario: usuarioId
    })

    return await nuevoRegistro.save()
}
temperaturaService.registrarTemperatura = registrarTemperatura

module.exports = temperaturaService

