const { Given, When, Then, BeforeAll, AfterAll, Before, setDefaultTimeout } = require('@cucumber/cucumber');
const { expect } = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const { app, connectionMongo } = require('../../api/src/app');

const Usuario = require('../../api/src/models/usuario.model');
const Medicamento = require('../../api/src/models/medicamento.model');
const Laboratorio = require('../../api/src/models/laboratorio.model');
const Rol = require('../../api/src/models/rol.model');

setDefaultTimeout(15000);

// ================== HOOKS GLOBALES ==================

BeforeAll(async () => {
  await connectionMongo();
});

AfterAll(async () => {
  await mongoose.connection.close();
});

// ================== HOOK POR ESCENARIO ==================

Before(async function () { // Nota: function normal para poder usar 'this' si fuera necesario
  await Promise.all([
    Usuario.deleteMany({}),
    Medicamento.deleteMany({}),
    Laboratorio.deleteMany({}),
    Rol.deleteMany({})
  ]);

  const rolEmpleado = await new Rol({ nombre: 'Empleado' }).save();
  const rolAdmin = await new Rol({ nombre: 'Administrador' }).save();

  const passwordHasheada = await bcryptjs.hash('Password123', 10);

  await new Usuario({
    nombre: 'Empleado Test',
    email: 'empleado@test.com',
    password: passwordHasheada,
    rol: rolEmpleado._id
  }).save();

  await new Usuario({
    nombre: 'Admin Test',
    email: 'admin@test.com',
    password: passwordHasheada,
    rol: rolAdmin._id
  }).save();
  
  // Limpiamos el contexto para el nuevo escenario
  this.token = null;
  this.response = null;
});

// ================== STEPS ==================

// ---------- LOGIN ----------
Given('que he iniciado sesión como {string}', async function (rol) {
  const email = rol === 'Administrador'
    ? 'admin@test.com'
    : 'empleado@test.com';

  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email, password: 'Password123' });

  expect(loginResponse.status).to.equal(200);
  
  // Guardamos el token en 'this' para compartirlo con otros steps
  this.token = loginResponse.body.token;
});

// ---------- NAVEGACIÓN ----------
Given('estoy en la pantalla de {string}', function (_, done) {
  // Como es un test de API, la navegación es simbólica
  done();
});

// ---------- FORMULARIO ----------
When('completo el formulario con los siguientes datos:', async function (dataTable) {
  const datos = dataTable.hashes()[0];

  const lab = await new Laboratorio({ nombre: 'LabTest' }).save();

  // Usamos this.token que guardamos en el paso de login
  this.response = await request(app)
    .post('/api/medicamento') 
    .set('Authorization', `Bearer ${this.token}`)
    .send({
      nombre: datos.nombre,
      codigoBarras: datos.codigoBarras,
      lote: datos.lote,
      fechaVencimiento: datos.fechaVencimiento,
      stock: Number(datos.stock),
      laboratorio: lab._id
    });
});

// ---------- BOTÓN (AQUÍ ESTABA EL ERROR PRINCIPAL) ----------
When('presiono el botón {string}', function (nombreBoton) {
  // Recibimos 'nombreBoton' aunque no lo usemos, para satisfacer a Cucumber.
  // La petición ya se hizo en el paso anterior.
  // Podrías agregar un log si quieres:
  // console.log(`Simulando click en ${nombreBoton}`);
});

// ---------- RESULTADOS ----------
Then('el sistema muestra un mensaje de confirmación {string}', function (mensaje) {
  // Verificamos estado 201
  expect(this.response.status).to.equal(201);
  // Opcional: Verificar que el body tenga el mensaje si tu API lo devuelve
  // if (this.response.body.message) {
  //   expect(this.response.body.message).to.contain(mensaje);
  // }
});

Then('el medicamento {string} aparece en el listado de medicamentos', async function (nombre) {
  const med = await Medicamento.findOne({ nombre });
  expect(med).to.not.be.null;
});

Then('el sistema muestra un mensaje de error {string}', function (mensajeError) {
  expect(this.response.status).to.equal(400);
  // Verificamos que el error coincida
  if(this.response.body.message) {
      expect(this.response.body.message).to.equal(mensajeError);
  }
});

Then('el medicamento no aparece en el listado de medicamentos', async function () {
  const count = await Medicamento.countDocuments();
  // Ajuste: Debería haber 0 medicamentos, o al menos no el que intentamos crear.
  // Si limpias la DB en Before, debería ser 0.
  expect(count).to.equal(0);
});