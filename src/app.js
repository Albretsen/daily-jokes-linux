import cors from "cors";
import express from "express";

import routes from "./api/routes/index.js";

import { VerifyFutureContests } from "./utils/contest.js";

VerifyFutureContests();

const app = express();

app.enable("json spaces");
app.enable("strict routing");
app.use(cors());
app.use(express.json());
app.use(routes);

export default app;
