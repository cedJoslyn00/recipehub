const request = require("supertest");
const { app, server } = require("../index");

describe("Health Check", () => {
  afterAll((done) => {
    server.close(done);
  });

  it("GET /api/health - Debe retornar status ok", async () => {
    const res = await request(app).get("/api/health");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(res.body).toHaveProperty("timestamp");
    expect(res.body).toHaveProperty("uptime");
  });
});
