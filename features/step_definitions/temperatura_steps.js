const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const request = require('supertest');

const { app, verificarTemperaturaMensual } = require('../../api/src/app');
const Temperatura = require('../../api/src/models/temperatura.model');
const Alerta = require('../../api/src/models/alerta.model');

// ---------- REGISTRAR TEMPERATURA ----------
When('registro una temperatura mensual de {int} grados', async function (valor) {
  this.response = await request(app)
    .post('/api/temperatura')
    .set('Authorization', `Bearer ${this.token}`)
    .send({ valor });

  expect(this.response.status).to.equal(201);
});

// ---------- VALIDAR REGISTRO ----------
Then('la temperatura queda registrada', async function () {
  const temp = await Temperatura.findOne();
  expect(temp).to.not.be.null;
});

// ---------- VALIDAR ALERTA RESUELTA ----------
Then('no existe una alerta mensual activa', async function () {
  const alerta = await Alerta.findOne({
    tipo: 'Registro Temperatura',
    leida: false
  });

  expect(alerta).to.be.null;
});

// ---------- SIMULAR FIN DE MES ----------
Given('que no se registró temperatura en el mes actual', async function () {
  await Temperatura.deleteMany({});
  await Alerta.deleteMany({});
});

// ---------- EJECUTAR VERIFICACIÓN ----------
When('el sistema ejecuta la verificación mensual', async function () {
  await verificarTemperaturaMensual();
});

// ---------- VALIDAR ALERTA ----------
Then('se genera una alerta de temperatura mensual', async function () {
  const alerta = await Alerta.findOne({
    tipo: 'Registro Temperatura',
    leida: false
  });

  expect(alerta).to.not.be.null;
});