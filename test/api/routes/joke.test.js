import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import JokeService from "../../../src/services/joke.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/joke.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/joke/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/joke");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    JokeService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req.get("/api/v1/joke").set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(JokeService.list).toHaveBeenCalled();
  });

  test("POST creates a new Joke", async () => {
    const data = {
      userId: 42,
      textBody: "test",
      createTimeStamp: "2001-01-01T00:00:00Z",
      score: 3.141592,
    };

    JokeService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/joke")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(JokeService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new Joke without required attributes fails", async () => {
    const data = {};

    JokeService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/joke")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(JokeService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/joke/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    JokeService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/joke/1`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(JokeService.get).toHaveBeenCalledWith(1);
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/joke/1");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "1";
    JokeService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/joke/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(JokeService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    JokeService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/joke/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(JokeService.get).not.toHaveBeenCalled();
  });

  test("Joke update", async () => {
    const data = {
      userId: 42,
      textBody: "test",
      createTimeStamp: "2001-01-01T00:00:00Z",
      score: 3.141592,
    };
    JokeService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/joke/1`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(JokeService.update).toHaveBeenCalledWith(1, data);
  });

  test("Joke deletion", async () => {
    JokeService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/joke/1`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(JokeService.delete).toHaveBeenCalledWith(1);
  });
});
