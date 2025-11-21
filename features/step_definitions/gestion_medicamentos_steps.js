const { Given, When, Then, BeforeAll, AfterAll, Before, setDefaultTimeout } = require('@cucumber/cucumber');
const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

// Importamos la app y la lógica de conexión
const { app, connectionMongo } = require('../../api/src/app');
const Usuario = require('../../api/src/models/usuario.model');
const Medicamento = require('../../api/src/models/medicamento.model');
const Laboratorio = require('../../api/src/models/laboratorio.model');
const Rol = require('../../api/src/models/rol.model');

// Aumentamos el tiempo de espera por defecto a 15 segundos
setDefaultTimeout(15 * 1000);

let world = {};

// ================== HOOKS GLOBALES ==================

BeforeAll(async () => await connectionMongo())

AfterAll(async () => await mongoose.connection.close())

// ================== HOOKS DE ESCENARIO ==================

Before(async () => {
  await Promise.all([
    Usuario.deleteMany({}),
    Medicamento.deleteMany({}),
    Laboratorio.deleteMany({}),
    Rol.deleteMany({})
  ]);

  const rolEmpleado = new Rol({ nombre: 'Empleado' });
  const rolAdmin = new Rol({ nombre: 'Administrador' });
  await Promise.all([rolEmpleado.save(), rolAdmin.save()]);

  const passwordHasheada = await bcryptjs.hash('Password123', 10);
  const usuarioEmpleado = new Usuario({
    nombre: 'Empleado de Prueba',
    email: 'empleado@test.com',
    password: passwordHasheada,
    rol: rolEmpleado._id
  });
  await usuarioEmpleado.save();

  world = {};
});

// ================== STEP DEFINITIONS ==================

Given('que he iniciado sesión como {string}', async function (rol) {
  const loginResponse = await request(app)
    .post('/auth/login')
    .send({ email: 'empleado@test.com', password: 'Password123' });

  expect(loginResponse.status).to.equal(200, 'El login falló');
  world.token = loginResponse.body.token;
});

Given('estoy en la pantalla de {string}', function (screenName) {
  return true; // paso descriptivo
});

When('completo el formulario con los siguientes datos:', async function (dataTable) {
  const [datos] = dataTable.hashes();

  // 🔧 limpiar comillas si vienen desde el feature
  const limpiar = (valor) => {
    if (typeof valor === 'string') {
      return valor.replace(/^"|"$/g, '').trim();
    }
    return valor;
  };

  const datosLimpios = {
    nombre: limpiar(datos.nombre),
    codigoBarras: limpiar(datos.codigoBarras),
    lote: limpiar(datos.lote),
    fechaVencimiento: limpiar(datos.fechaVencimiento),
    stock: parseInt(limpiar(datos.stock), 10)
  };

  console.log('Datos procesados:', datosLimpios);

  const lab = new Laboratorio({ nombre: 'LabTest' });
  await lab.save();

  world.response = await request(app)
    .post('/medicamentos')
    .set('Authorization', `Bearer ${world.token}`)
    .send({
      ...datosLimpios,
      laboratorio: lab._id.toString()
    });

  if (world.response.status !== 201) {
    console.log('⚠️ Respuesta del servidor:', world.response.body);
  }
});

When('presiono el botón {string}', function (buttonName) {
  return true; // paso descriptivo
});

Then('el sistema muestra un mensaje de confirmación {string}', function (expectedMessage) {
  expect(world.response.status).to.equal(201);
});

Then('el medicamento {string} aparece en el listado de medicamentos', async function (nombreMedicamento) {
  const medicamentoGuardado = await Medicamento.findOne({ nombre: nombreMedicamento });
  expect(medicamentoGuardado).to.not.be.null;
});

// --- Pasos para escenarios de error ---

Then('el sistema muestra un mensaje de error {string}', function (expectedErrorMessage) {
  // Verificamos que la API respondió con un error 400 (Bad Request)
  expect(world.response.status).to.equal(400); 
  // Verificamos que el mensaje de error en la respuesta es el que esperábamos
  expect(world.response.body.mensaje).to.equal(expectedErrorMessage);
});

Then('el medicamento no aparece en el listado de medicamentos', async function () {
  // Verificamos que no se haya creado ningún medicamento en la base de datos
  const count = await Medicamento.countDocuments();
  expect(count).to.equal(0);
});