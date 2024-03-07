import { Router } from "express";
import swaggerUI from "swagger-ui-express";

import { authenticateWithToken } from "../middlewares/auth.js";
import { handle404, handleError } from "../middlewares/errors.js";
import authRouter from "./auth.js";
import jokeRouter from "./joke.js";
import pingRouter from "./ping.js"
import contestRouter from "./contest.js";
import coinRouter from "./coin.js";
import jokeSubmissionRouter from "./joke_submission.js";
import notificationRouter from "./notification.js";
import urls from "../urls.js";
import spec from "../openapi.js";

const router = Router();

// Swagger API docs
const swaggerSpecPath = `${urls.swagger.path}/${urls.swagger.spec}`;
const swaggerUIOptions = {
  swaggerOptions: {
    url: swaggerSpecPath,
  },
};
router.get(swaggerSpecPath, (req, res) => res.json(spec));
router.use(
  urls.swagger.path,
  swaggerUI.serve,
  swaggerUI.setup(null, swaggerUIOptions)
);

// Ping API
router.use(urls.apiPrefix + urls.contest.path, contestRouter);

// Authentication
router.use(authenticateWithToken);
router.use(urls.apiPrefix + urls.auth.path, authRouter);

// Contest API
router.use(urls.apiPrefix + urls.ping.path, pingRouter);

// CRUD API
router.use(urls.apiPrefix + urls.joke.path, jokeRouter);

// Coin API
router.use(urls.apiPrefix + urls.coin.path, coinRouter);

// JokeSubmission API
router.use(urls.apiPrefix + urls.jokeSubmission.path, jokeSubmissionRouter);

// JokeSubmission API
router.use(urls.apiPrefix + urls.notification.path, notificationRouter);

// Redirect browsers from index to API docs
router.get("/", (req, res, next) => {
  if (req.accepts("text/html")) {
    res.redirect(urls.swagger.path);
  } else {
    next();
  }
});

// Error handlers
router.use(handle404);
router.use(handleError);

export default router;
