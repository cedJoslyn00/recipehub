const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Usuario = require('../models/Usuario');

let mongoServer;
let app;

beforeAll(async () => {
  // Crear MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Conectar manualmente
  await mongoose.connect(mongoUri);
  
  // Importar app DESPUÉS de conectar
  const { app: appInstance } = require('../index');
  app = appInstance;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Usuario.deleteMany();
});

describe('Autenticación', () => {
  it('POST /api/auth/register - Debe registrar un usuario', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.usuario).toHaveProperty('email', 'test@example.com');
  });

  it('POST /api/auth/register - Debe fallar con email duplicado', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Test User 2',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'El email ya está registrado');
  });

  it('POST /api/auth/login - Debe hacer login', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});