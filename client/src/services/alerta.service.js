import axios from '../api/axios' // importo la instancia configurada

// importo todas las alertas activas
 export const getAlertas = async () => {
    const response = await axios.get('/alerta')
    return response.data
 }

 // marcar alerta como leida
 export const marcarAlertaLeida = async (id) => {
    const response = await axios.patch(`/alerta/${id}/leida`)
    return response.data
 }