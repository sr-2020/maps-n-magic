import { createLogger } from "./logger";
import { shutdownPgPool } from "./api/pgPool";

// introduce abstraction of process and add handling of unhandled errors and exceptions and signals.

// https://thomashunter.name/posts/2021-03-08-the-death-of-a-nodejs-process

const logger = createLogger('pgPool');

process.on('uncaughtException', async (error) => {
  // logger.send("An uncaught exception has occured", error, () => {
  logger.error("An uncaught exception has occured", error);
  await shutdownPgPool();
  process.exit(1);
  // });
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error("An unhandledRejection has occured", reason, promise);
});

process.on('SIGHUP', async () => {
  await shutdownPgPool();
  logger.info('Received: SIGHUP');
});
process.on('SIGINT', async () => {
  await shutdownPgPool();
  logger.info('Received: SIGINT');
});
process.on('SIGQUIT', async () => {
  await shutdownPgPool();
  logger.info('Received: SIGQUIT');
});
process.on('SIGTERM', async () => {
  await shutdownPgPool();
  logger.info('Received: SIGTERM');
});