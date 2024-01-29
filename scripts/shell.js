import repl from "repl";

import config from "../src/utils/config.js";
import app from "../src/app.js";
import { User, Contest, Joke } from "../src/models/init.js";
import UserService from "../src/services/user.js";
import ContestService from "../src/services/contest.js";
import JokeService from "../src/services/joke.js";

const main = async () => {
  process.stdout.write("Database and Express app initialized.\n");
  process.stdout.write("Autoimported modules: config, app, models, services\n");

  const r = repl.start("> ");
  r.context.config = config;
  r.context.app = app;
  r.context.models = {
    User,
    Contest,
    Joke,
  };
  r.context.services = {
    UserService,
    ContestService,
    JokeService,
  };

  r.on("exit", () => {
    process.exit();
  });

  r.setupHistory(".shell_history", () => {});
};

main();
