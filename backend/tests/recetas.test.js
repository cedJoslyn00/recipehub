const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { app, server } = require("../index");
const Usuario = require("../models/Usuario");
const Receta = require("../models/Receta");

let mongoServer;
let token;
let usuarioId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  const res = await request(app).post("/api/auth/register").send({
    nombre: "Test User",
    email: "test@example.com",
    password: "password123",
  });

  token = res.body.token;
  usuarioId = res.body.usuario.id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
  server.close();
});

afterEach(async () => {
  await Receta.deleteMany();
});

describe("Recetas", () => {
  it("POST /api/recetas - Debe crear una receta", async () => {
    const res = await request(app)
      .post("/api/recetas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        titulo: "Receta de Prueba",
        descripcion: "Descripción de prueba",
        categoria: "Desayuno",
        tiempoMin: 30,
        porciones: 4,
        dificultad: "Fácil",
        ingredientes: [{ nombre: "Harina", cantidad: 2, unidad: "tazas" }],
        pasos: ["Paso 1", "Paso 2"],
        tags: ["rápido", "fácil"],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.receta).toHaveProperty("titulo", "Receta de Prueba");
  });

  it("GET /api/recetas - Debe listar recetas", async () => {
    await Receta.create({
      titulo: "Receta 1",
      descripcion: "Desc 1",
      categoria: "Desayuno",
      tiempoMin: 30,
      porciones: 4,
      dificultad: "Fácil",
      ingredientes: [{ nombre: "Ing", cantidad: 1, unidad: "unidad" }],
      pasos: ["Paso 1"],
      autorId: usuarioId,
    });

    const res = await request(app).get("/api/recetas");

    expect(res.statusCode).toBe(200);
    expect(res.body.recetas).toHaveLength(1);
  });

  it("PUT /api/recetas/:id - No debe permitir editar receta de otro usuario", async () => {
    const otraReceta = await Receta.create({
      titulo: "Receta de Otro",
      descripcion: "Desc",
      categoria: "Cena",
      tiempoMin: 30,
      porciones: 4,
      dificultad: "Media",
      ingredientes: [{ nombre: "Ing", cantidad: 1, unidad: "unidad" }],
      pasos: ["Paso 1"],
      autorId: new mongoose.Types.ObjectId(),
    });

    const res = await request(app)
      .put(`/api/recetas/${otraReceta._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ titulo: "Título Modificado" });

    expect(res.statusCode).toBe(403);
  });
});
