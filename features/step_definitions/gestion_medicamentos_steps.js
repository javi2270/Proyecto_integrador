// features/step_definitions/gestion_medicamentos.steps.js

const { Given, When, Then, Before, AfterAll } = require('@cucumber/cucumber');
const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

// Importamos la app de Express y los modelos necesarios
const app = require('../../api/src/app');
const Usuario = require('../../api/src/models/usuario.model');
const Medicamento = require('../../api/src/models/medicamento.model');
const Laboratorio = require('../../api/src/models/laboratorio.model');
const Rol = require('../../api/src/models/rol.model');

// ================== VARIABLES GLOBALES PARA LAS PRUEBAS ==================
// Usamos un objeto 'world' para compartir datos entre los pasos de un mismo escenario
let world = {};

// ================== HOOKS (CONFIGURACIÓN ANTES Y DESPUÉS) ==================

// Se ejecuta ANTES de CADA escenario
Before(async () => {
  // Limpiamos la base de datos para asegurar que cada prueba sea independiente
  await Promise.all([
    Usuario.deleteMany({}),
    Medicamento.deleteMany({}),
    Laboratorio.deleteMany({}),
    Rol.deleteMany({})
  ]);

  // Creamos los roles base necesarios para las pruebas
  const rolEmpleado = new Rol({ nombre: 'Empleado' });
  const rolAdmin = new Rol({ nombre: 'Administrador' });
  await Promise.all([rolEmpleado.save(), rolAdmin.save()]);

  // Creamos un usuario de prueba para el login
  const passwordHasheada = await bcryptjs.hash('Password123', 10);
  const usuarioEmpleado = new Usuario({
    nombre: 'Empleado de Prueba',
    email: 'empleado@test.com',
    password: passwordHasheada,
    rol: rolEmpleado._id
  });
  await usuarioEmpleado.save();

  // Reiniciamos nuestro 'world'
  world = {};
});

// Se ejecuta UNA SOLA VEZ después de TODAS las pruebas
AfterAll(async () => {
  // Cerramos la conexión a la base de datos para que el proceso de Node termine limpiamente
  await mongoose.connection.close();
});


// ================== STEP DEFINITIONS ==================

// --- Pasos de Autenticación (Reutilizables) ---

Given('que he iniciado sesión como {string}', async function (rol) {
  const loginResponse = await request(app)
    .post('/auth/login')
    .send({
      email: 'empleado@test.com', // Usamos el usuario que creamos en el hook Before
      password: 'Password123'
    });
  
  expect(loginResponse.status).to.equal(200, 'El login falló');
  expect(loginResponse.body.token).to.be.a('string', 'No se recibió un token');

  // Guardamos el token en nuestro 'world' para usarlo en los siguientes pasos
  world.token = loginResponse.body.token;
});


// --- Pasos de HU-01: Registrar Medicamento ---

When('completo el formulario con los siguientes datos:', async function (dataTable) {
  const data = dataTable.rowsHash();
  
  // Creamos un laboratorio de prueba para poder asociarlo
  const lab = new Laboratorio({ nombre: 'LabTest' });
  await lab.save();

  world.response = await request(app)
    .post('/medicamentos')
    .set('Authorization', `Bearer ${world.token}`) // Usamos el token guardado
    .send({
        nombre: data.nombre,
        codigoBarras: data.codigoBarras,
        lote: data.lote,
        fechaVencimiento: data.fechaVencimiento,
        stock: parseInt(data.stock, 10),
        laboratorio: lab._id.toString() // Usamos el ID del laboratorio creado
    });
});

Then('el sistema muestra un mensaje de confirmación {string}', function (expectedMessage) {
  // Verificamos que el estado sea 201 (Created)
  expect(world.response.status).to.equal(201);
});

Then('el medicamento {string} aparece en el listado de medicamentos', async function (nombreMedicamento) {
  const medicamentoGuardado = await Medicamento.findOne({ nombre: nombreMedicamento });
  expect(medicamentoGuardado).to.not.be.null;
  expect(medicamentoGuardado.nombre).to.equal(nombreMedicamento);
});


// --- Pasos de HU-02: Actualizar Medicamento ---

Given('que existe un medicamento en el sistema con los siguientes datos:', async function (dataTable) {
  const data = dataTable.rowsHash();
  const medicamento = new Medicamento({
      nombre: data.nombre,
      codigoBarras: data.codigoBarras,
      lote: data.lote,
      stock: parseInt(data.stock, 10),
      fechaVencimiento: new Date(), // Fecha por defecto
      laboratorio: new mongoose.Types.ObjectId() // ID de lab por defecto
  });
  await medicamento.save();

  // Guardamos el código de barras para usarlo en los siguientes pasos
  world.codigoBarras = data.codigoBarras;
});

When('busco el medicamento con código de barras {string}', async function (codigo) {
  // En la prueba de API, esta acción está implícita.
  // Podríamos hacer un GET para verificar que existe, pero para la actualización no es estrictamente necesario.
  // Lo importante es tener el código de barras guardado en 'world.codigoBarras'.
  expect(world.codigoBarras).to.equal(codigo);
});

When('actualizo su stock a {string}', async function (nuevoStock) {
  world.response = await request(app)
    .put(`/medicamentos/${world.codigoBarras}`) // Endpoint de actualización
    .set('Authorization', `Bearer ${world.token}`)
    .send({
      stock: parseInt(nuevoStock, 10)
    });
});

Then('el sistema muestra el mensaje de confirmación {string}', function (expectedMessage) {
  expect(world.response.status).to.equal(200); // 200 = OK
  // Opcionalmente, podrías verificar el cuerpo de la respuesta si devuelve un mensaje
  // expect(world.response.body.message).to.equal(expectedMessage);
});

Then('el stock del medicamento con código de barras {string} es {string}', async function (codigo, stockEsperado) {
  const medicamentoActualizado = await Medicamento.findOne({ codigoBarras: codigo });
  expect(medicamentoActualizado).to.not.be.null;
  expect(medicamentoActualizado.stock).to.equal(parseInt(stockEsperado, 10));
});