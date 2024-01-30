import swaggerJsDoc from "swagger-jsdoc";

import {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  userSchema,
} from "./schemas/auth.js";
import jokeSchema from "./schemas/joke.js";

export const definition = {
  openapi: "3.0.0",
  info: {
    title: "Daily Jokes",
    version: "0.0.1",
    description: "A REST+JSON API service",
  },
  servers: [
    {
      url: "/api/v1",
      description: "API v1",
    },
  ],
  components: {
    schemas: {
      Joke: jokeSchema,
      loginSchema,
      registerSchema,
      changePasswordSchema,
      User: userSchema,
    },
  },
};

const options = {
  definition,
  apis: ["./src/api/routes/*.js"],
};

const spec = swaggerJsDoc(options);

export default spec;
