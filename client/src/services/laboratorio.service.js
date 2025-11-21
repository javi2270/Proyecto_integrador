import axios from '../api/axios'

// Pido la lista de laboratorios al backend
export const getLaboratorios = async () => {
  const response = await axios.get('/laboratorios')
  return response.data
}

