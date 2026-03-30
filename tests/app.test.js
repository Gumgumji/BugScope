const request = require("supertest");
const app = require("../index");

const API_KEY = process.env.API_KEY || "test-key";

describe("BugScope API", () => {

  describe("GET /", () => {
    it("should return 200", async () => {
      const res = await request(app).get("/");
      expect(res.statusCode).toBe(200);
    });
  });

  describe("GET /logs - no API key", () => {
    it("should return 401", async () => {
      const res = await request(app).get("/logs");
      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /metrics - no API key", () => {
    it("should return 401", async () => {
      const res = await request(app).get("/metrics");
      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST /logs - no API key", () => {
    it("should return 401", async () => {
      const res = await request(app)
        .post("/logs")
        .send({ message: "test error", level: "error" });
      expect(res.statusCode).toBe(401);
    });
  });

  describe("POST /logs - missing body", () => {
    it("should return 400", async () => {
      const res = await request(app)
        .post("/logs")
        .set("x-api-key", API_KEY)
        .send({});
      expect(res.statusCode).toBe(400);
    });
  });

});