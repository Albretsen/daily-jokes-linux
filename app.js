import http from "http";

import app from "./src/app.js";
import config from "./src/utils/config.js";
import logger from "./src/utils/log.js";

import { schedule, unschedule } from "./src/scheduled_tasks/task_controller.js";

schedule();

const log = logger("server");
const server = http.createServer(app);

const gracefulShutdown = (signal) => {
  return (error) => {
    if (error) log.fatal({ err: error }, `Exiting due to unhandled exception or rejection: ${error}`);
    log.info(`Received ${signal}, shutting down gracefully.`);

    unschedule(); 

    server.close(() => {
      log.info('HTTP server closed.');
      process.exit(error ? 1 : 0);
    });
  };
};

process.on('uncaughtException', gracefulShutdown('uncaughtException'));

process.on('unhandledRejection', gracefulShutdown('unhandledRejection'));

process.on('SIGTERM', gracefulShutdown('SIGTERM'));
process.on('SIGINT', gracefulShutdown('SIGINT'));

const main = async () => {
  log.info(`Listening on 0.0.0.0:${config.PORT}`);
  await server.listen(config.PORT);
};

main().catch(gracefulShutdown('startupError'));
