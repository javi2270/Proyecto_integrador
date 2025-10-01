const Medicamento = require("../models/medicamento.model")

// Obtener todos los medicamentos
const getAll = async () => {
    return await Medicamento.find({ activo: true })
}

// Crear un medicamento
const create = async (data) => {
    const medicamento = new Medicamento(data)
    return await medicamento.save()
}


// Buscar medicamento por código de barras
const getByCodigoBarras = async (codigoBarras) => {
    return await Medicamento.findOne(
        { codigoBarras },
        { activo: true }
    )
}

// Buscar medicamento por nombre
const getByNombre = async (nombre) => {
    return await Medicamento.findOne(
        { nombre: { $regex: nombre, $options: 'i'} },
        { activo: true}
    )
}

const getByIdentificador = async (identificador) => {
    let medicamento = await getByCodigoBarras(identificador)
    if (!medicamento){
        medicamento = await getByNombre(identificador)
    }
    return medicamento
}

// Actualizar medicamento por código de barras
const update = async (codigoBarras, data) => {
    return await Medicamento.findOneAndUpdate(
        { codigoBarras },
        data,
        { new: true, runValidators: true },
        { activo: true }
    )
}

// Eliminar medicamento
const remove = async (codigoBarras) => {
    return await Medicamento.findOneAndUpdate(
        { codigoBarras: codigoBarras},
        { activo: false },
        { new: true }
    )
}

// Añadir stock a un medicamento existente
const addStock = async (codigoBarras, cantidad) => {
    // Usamos findOneAndUpdate para hacer la operación más atómica
    // $inc incrementa un campo por un valor específico
    return await Medicamento.findOneAndUpdate(
        { codigoBarras },
        { $inc: { stock: cantidad } },
        { activo: true },
        { new: true, runValidators: true } // new: true devuelve el documento actualizado
    );
};

module.exports = { getAll, create, getByCodigoBarras, getByNombre, getByIdentificador, update, remove, addStock }

