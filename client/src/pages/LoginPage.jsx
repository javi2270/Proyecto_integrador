import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


const LoginPage = () => {
  // Es tados para el formulario
  // usamos useState para "conectar" React con los campos <input>
  const [email, setEmail] = useState('')
  const [password, setPassword ] = useState('')
  const [error, setError] = useState('') // un estado para mensajes error
  // Uso los hooks
  const navigate = useNavigate()
  const { login } = useAuth()

  // funcion de envio (por ahora vacia)
  const handleSubmit = async (e) => {
    e.preventDefault() // evita que la pagina se recargue
    setError('') // limpio errores previos
    try {
      // llamo al login del context
      await login(email, password)
      // si 'login' tiene exito redirijo a dashboard
      navigate('/dashboard')

    } catch (error) {
      // si login lanza un error (ej: la API dice credenciales invalidas)
      // lo atrapo aca y le muestro un msje al usuario
      console.error(error)
      setError('Credenciales invalidas, por favor intente de nuevo.')
    }
  }
  // el formulario HTML/JSX
  return (
    <div style={{padding:'20px', maxWidth:'400px', margin:'auto'}}>
      <h2>Iniciar sesion (SGMR)</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:'10px'}}>
          <label>Email:</label>
          <input 
          type='email'
          value={email} // el valor del input esta "atado" al estado
          onChange={(e) => setEmail(e.target.value) } // cuando escribo se actualiza el estado
          required
          style={{width:'100%'}}
          />
        </div>

        <div style={ {marginBottom:'10px'}}>
          <label>Contraseña</label>
          <input 
          type="password"
          value={password}
          onChange={ e => setPassword(e.target.value)}
          required
          style={{width:'100%'}}
          />
        </div>

        {/*muestro el error si existe */}
        {error && <p style={{color:'red'}}>{error}</p>}

        <button type='submit' style={{width:'100%', padding:'10px'}}>
          Ingresar
        </button>
      </form>

      <p style={ { marginTop: '15px', textAlign: 'center'} }>
      ¿ No tienes cuenta ?
      <Link to='/register'>  Registrate aqui</Link>
      </p>
    </div>
  )
} 

export default LoginPage  