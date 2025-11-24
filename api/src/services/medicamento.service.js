const Medicamento = require("../models/medicamento.model");

// Obtener todos los medicamentos activos
const getAll = async () => {
  return await Medicamento.find({ activo: true }).populate(
    "laboratorio",
    "nombre"
  );
};

// Crear o Reactivar un medicamento
const createMedicamento = async (data) => {
  const { codigoBarras } = data;

  // 1. Buscar si ya existe (incluso si está inactivo)
  const medicamentoExistente = await Medicamento.findOne({ codigoBarras });

  if (medicamentoExistente) {
    // Si existe y está activo -> Error
    if (medicamentoExistente.activo) {
      throw new Error("DUPLICADO_ACTIVO"); 
    }

    // Si existe y NO está activo -> Reactivar
    const reactivado = await Medicamento.findOneAndUpdate(
      { codigoBarras },
      { ...data, activo: true },
      { new: true, runValidators: true }
    );
    return { tipo: "REACTIVADO", medicamento: reactivado };
  }

  // 2. Si no existe -> Crear nuevo
  const nuevo = await Medicamento.create(data);
  return { tipo: "CREADO", medicamento: nuevo };
};

// Buscar por código (CORREGIDO: activo va dentro del filtro)
const getByCodigoBarras = async (codigoBarras) => {
  // Antes tenías: findOne({codigo}, {activo:true}) <- Eso es proyección incorrecta
  // Correcto: Buscar donde codigo coincida Y activo sea true
  return await Medicamento.findOne({ codigoBarras, activo: true }).populate("laboratorio", "nombre");
};

// Buscar por nombre (CORREGIDO)
const getByNombre = async (nombre) => {
  return await Medicamento.find(
    { 
      nombre: { $regex: nombre, $options: "i" }, 
      activo: true // Filtramos solo activos
    }
  ).populate("laboratorio", "nombre");
};

// Helper para buscar por cualquiera de los dos
const getByIdentificador = async (identificador) => {
  let medicamento = await getByCodigoBarras(identificador);
  // Si no es un código de barras (o no se encontró), probamos por nombre
  if (!medicamento) {
    // Ojo: getByNombre devuelve un array (find), aquí tomamos el primero si existe
    const resultados = await getByNombre(identificador);
    medicamento = resultados[0]; 
  }
  return medicamento;
};

// Actualizar (CORREGIDO: Estructura de argumentos)
const update = async (codigoBarras, data) => {
  return await Medicamento.findOneAndUpdate(
    { codigoBarras, activo: true }, // 1. Query (filtro)
    data,                           // 2. Update (datos nuevos)
    { new: true, runValidators: true } // 3. Options
  );
};

// Eliminar (Soft Delete)
const remove = async (codigoBarras) => {
  return await Medicamento.findOneAndUpdate(
    { codigoBarras, activo: true },
    { activo: false },
    { new: true }
  );
};

// Añadir stock (CORREGIDO: Estructura de argumentos)
const addStock = async (codigoBarras, cantidad) => {
  return await Medicamento.findOneAndUpdate(
    { codigoBarras, activo: true }, // 1. Query: Combinamos codigo y activo
    { $inc: { stock: cantidad } },  // 2. Update
    { new: true, runValidators: true } // 3. Options
  );
};

// EXPORTACIÓN CORREGIDA
module.exports = {
  getAll,
  create: createMedicamento, // <--- AQUÍ ESTABA EL ERROR DE REFERENCIA
  getByCodigoBarras,
  getByNombre,
  getByIdentificador,
  update,
  remove,
  addStock,
};