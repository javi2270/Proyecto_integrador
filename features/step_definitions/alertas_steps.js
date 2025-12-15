const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const request = require('supertest');

const { app } = require('../../api/src/app');
const Alerta = require('../../api/src/models/alerta.model');
const Medicamento = require('../../api/src/models/medicamento.model');
const Laboratorio = require('../../api/src/models/laboratorio.model');

Given('que existe una alerta activa en el sistema', async function () {
  const laboratorio = await Laboratorio.create({ nombre: 'Lab Alerta' });

  const medicamento = await Medicamento.create({
    nombre: 'Medicamento Alerta',
    codigoBarras: '999999',
    lote: 'LOTE-ALERTA',
    fechaVencimiento: new Date('2026-12-31'),
    stock: 2,
    stockMinimo: 5,
    laboratorio: laboratorio._id
  });

  const alerta = await Alerta.create({
    medicamento: medicamento._id,
    tipo: 'Bajo Stock',
    mensaje: 'Stock bajo para Medicamento Alerta',
    leida: false
  });

  this.alertaId = alerta._id.toString();
});

When('consulto las alertas', async function () {
  this.response = await request(app)
    .get('/api/alerta')
    .set('Authorization', `Bearer ${this.token}`);
});

Then('veo la alerta en el listado', function () {
  expect(this.response.status).to.equal(200);
  expect(this.response.body.length).to.be.greaterThan(0);
});

When('marco la alerta como leída', async function () {
  this.response = await request(app)
    .patch(`/api/alerta/${this.alertaId}/leida`)
    .set('Authorization', `Bearer ${this.token}`);
});

Then('la alerta deja de estar activa', async function () {
  expect(this.response.status).to.equal(200);

  const alerta = await Alerta.findById(this.alertaId);
  expect(alerta.leida).to.equal(true);
});