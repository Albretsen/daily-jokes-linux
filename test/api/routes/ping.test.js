import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";

describe("/api/v1/joke/:id", () => {
  test("Ping route should return pong: 1", async () => {
    const req = supertest(app);

    const res = await req.get(`/api/v1/ping`);

    expect(res.body).toEqual({ pong: 1});
    expect(res.status).toBe(200);
  });
});
