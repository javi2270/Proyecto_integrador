const { Given, When, Then, BeforeAll, AfterAll, Before, setDefaultTimeout } = require('@cucumber/cucumber');
const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

// Importamos app y conexión
const { app, connectionMongo } = require('../../api/src/app');

// Modelos
const Usuario = require('../../api/src/models/usuario.model');
const Medicamento = require('../../api/src/models/medicamento.model');
const Laboratorio = require('../../api/src/models/laboratorio.model');
const Rol = require('../../api/src/models/rol.model');

// Timeout general
setDefaultTimeout(15000);

let world = {};

// ================== HOOKS GLOBALES ==================

BeforeAll(async () => {
  await connectionMongo();
});

AfterAll(async () => {
  await mongoose.connection.close();
});

// ================== HOOKS POR ESCENARIO ==================

Before(async () => {
  await Promise.all([
    Usuario.deleteMany({}),
    Medicamento.deleteMany({}),
    Laboratorio.deleteMany({}),
    Rol.deleteMany({})
  ]);

  // Crear roles
  const rolEmpleado = new Rol({ nombre: 'Empleado' });
  const rolAdmin = new Rol({ nombre: 'Administrador' });
  await Promise.all([rolEmpleado.save(), rolAdmin.save()]);

  // Crear usuario empleado
  const passwordHasheada = await bcryptjs.hash('Password123', 10);
  const usuarioEmpleado = new Usuario({
    nombre: 'Empleado de Prueba',
    email: 'empleado@test.com',
    password: passwordHasheada,
    rol: rolEmpleado._id
  });
  await usuarioEmpleado.save();

  world = {}; // reset world
});

// ================== STEP DEFINITIONS ==================

// --- LOGIN ---
Given('que he iniciado sesión como {string}', async function (rol) {
  const loginResponse = await request(app)
    .post('/auth/login')
    .send({ email: 'empleado@test.com', password: 'Password123' });

  expect(loginResponse.status).to.equal(200);
  world.token = loginResponse.body.token;
});

// --- Paso descriptivo ---
Given('estoy en la pantalla de {string}', function (pantalla, done) {
  done();
});

// --- Completar formulario ---
When('completo el formulario con los siguientes datos:', async function (dataTable) {
  const [datos] = dataTable.hashes();

  // Limpieza de valores
  const limpiar = (v) =>
    typeof v === 'string' ? v.replace(/^"|"$/g, '').trim() : v;

  const datosLimpios = {
    nombre: limpiar(datos.nombre),
    codigoBarras: limpiar(datos.codigoBarras),
    lote: limpiar(datos.lote),
    fechaVencimiento: limpiar(datos.fechaVencimiento),
    stock: parseInt(limpiar(datos.stock), 10)
  };

  console.log("Datos procesados:", datosLimpios);

  // Crear laboratorio
  const lab = new Laboratorio({ nombre: 'LabTest' });
  await lab.save();

  // Enviar POST
  world.response = await request(app)
    .post('/medicamentos')
    .set('Authorization', `Bearer ${world.token}`)
    .send({
      ...datosLimpios,
      laboratorio: lab._id.toString()
    });

  if (world.response.status !== 201) {
    console.log("⚠️ Respuesta del servidor:", world.response.body);
  }
});

// --- Paso descriptivo ---
When('presiono el botón {string}', function (boton, done) {
  done();
});

// ================== RESULTADOS ESPERADOS ==================

// --- Mensaje éxito ---
Then('el sistema muestra un mensaje de confirmación {string}', function (expectedMsg) {
  expect(world.response.status).to.equal(201);
});

// --- Confirmar existencia ---
Then('el medicamento {string} aparece en el listado de medicamentos', async function (nombreMedicamento) {
  const medicamentoGuardado = await Medicamento.findOne({ nombre: nombreMedicamento });
  expect(medicamentoGuardado).to.not.be.null;
});

// --- Mensaje de error ---
Then('el sistema muestra un mensaje de error {string}', function (expectedErrorMessage) {
  expect(world.response.status).to.equal(400);

  const mensaje = world.response.body.mensaje || world.response.body.error || "";
  expect(mensaje).to.equal(expectedErrorMessage);
});

// --- No existe en BD ---
Then('el medicamento no aparece en el listado de medicamentos', async function () {
  const count = await Medicamento.countDocuments();
  expect(count).to.equal(0);
});
