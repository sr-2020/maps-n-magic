import { shutdownPgPool } from "./api/pgPool";

// introduce abstraction of process and add handling of unhandled errors and exceptions and signals.

// https://thomashunter.name/posts/2021-03-08-the-death-of-a-nodejs-process


process.on('uncaughtException', async (error) => {
  // logger.send("An uncaught exception has occured", error, () => {
  console.error("An uncaught exception has occured", error);
  await shutdownPgPool();
  process.exit(1);
  // });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error("An unhandledRejection has occured", reason, promise);
});

process.on('SIGHUP', async () => {
  await shutdownPgPool();
  console.log('Received: SIGHUP');
});
process.on('SIGINT', async () => {
  await shutdownPgPool();
  console.log('Received: SIGINT');
});
process.on('SIGQUIT', async () => {
  await shutdownPgPool();
  console.log('Received: SIGQUIT');
});
process.on('SIGTERM', async () => {
  await shutdownPgPool();
  console.log('Received: SIGTERM');
});