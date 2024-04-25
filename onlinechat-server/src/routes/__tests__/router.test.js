import request from "supertest";
import express from "express";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import auth from "../../authentication/auth.js";
import { User } from "../../db/schema.js";
import router from "../index.js";

jest.mock("../../db/schema.js");
jest.mock("../../authentication/auth.js");

const app = express();
app.use(bodyParser.json());
app.use(router);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Auth Routes", () => {
  describe("POST /api/user/register", () => {
    it("should require username and password", async () => {
      const res = await request(app).post("/api/user/register").send({});
      expect(res.statusCode).toBe(422);
      expect(res.text).toContain("username and password required");
    });

    it("should handle duplicate usernames", async () => {
      User.findOne.mockResolvedValue(true);
      const res = await request(app)
        .post("/api/user/register")
        .send({ username: "test", password: "123" });
      expect(res.statusCode).toBe(409);
      expect(res.text).toContain("username already exists");
    });

    it("should successfully register a user", async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        username: "newuser",
        pwd: "hashedpassword",
      });
      const res = await request(app)
        .post("/api/user/register")
        .send({ username: "newuser", password: "password" });
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual("registeration success");
    });
  });

  describe("POST /api/user/login", () => {
    it("should require username and password", async () => {
      const res = await request(app).post("/api/user/login").send({});
      expect(res.statusCode).toBe(422);
      expect(res.text).toContain("username and password required");
    });

    it("should handle invalid username", async () => {
      User.findOne.mockResolvedValue(null);
      const res = await request(app)
        .post("/api/user/login")
        .send({ username: "unknown", password: "123" });
      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual("invalid username");
    });

    it("should reject incorrect password", async () => {
      User.findOne.mockResolvedValue({
        username: "user",
        pwd: "hashed",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(false);
      const res = await request(app)
        .post("/api/user/login")
        .send({ username: "user", password: "wrong" });
      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual("wrong password");
    });

    it("should log in successfully", async () => {
      User.findOne.mockResolvedValue({
        _id: "123",
        username: "user",
        pwd: "hashed",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      const res = await request(app)
        .post("/api/user/login")
        .send({ username: "user", password: "correct" });
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual("123");
    });
  });
});
