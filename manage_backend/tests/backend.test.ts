import { describe, it, expect } from "vitest";
import { app } from "../index.mjs";
const request = require("supertest");

describe("Test root", async () => {
  it("should return 200 for root", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
  });
});
