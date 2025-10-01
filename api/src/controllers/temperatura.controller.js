const temperaturaService  = require('../services/temperatura.service')

const temperaturaController = {}

const addTemperatura = async (req, res) => {
    try {
        const { valor } = req.body
        if (!valor){
            return res.status(400).json({message: 'El campo "valor" es obligatorio.'})
        }
        const usuarioID = req.usuario._id

        const datos = {
            valor,
            usuarioID
        }

        const nuevoRegistro = await temperaturaService.registrarTemperatura(datos)

        res.status(201).json({
            message: 'Temperatura registrada con exito.',
            temperatura: nuevoRegistro
        })
    } catch (error) {
        console.error('Error al registrar la temperatura', error)

        res.status(500).json({
            message: 'Error interno del servidor al registrar la temperatura'
        })
    }
}
temperaturaController.addTemperatura = addTemperatura

module.exports = temperaturaController

