// middleware centralizado de manejo de errores
const errorHandler = (err, req, res, next) => {
    // console.error('Error capturado por errorHandler', err) // Descomentar si necesitas depurar
    
    // CORRECCIÓN: Algunos errores usan 'status' y otros 'statusCode'. 
    // Miramos ambos antes de caer al 500.
    const statusCode = err.statusCode || err.status || 500;
    
    return res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Error interno del servidor'
    })
}

module.exports = errorHandler