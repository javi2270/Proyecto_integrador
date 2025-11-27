import api from '../api/axios'

// Registrar una venta
export const crearVenta = async ( { identificador, cantidad, motivo }) => {
	try {
		const res = await api.post('/ventas', {
			identificador,
			cantidad: Number(cantidad),
			motivo
		})
		return res.data
	} catch (err) {
		console.error('Error al crear la venta' , err)
		throw err
	}
}

// Obtener historial de ventas
export const getVentas = async () => {
	try {
		const res = await api.get('/ventas')
		return res.data
	} catch (err) {
		console.error('Error al obtener las ventas', err)
		throw err
	}
}