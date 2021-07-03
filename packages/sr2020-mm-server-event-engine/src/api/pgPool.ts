import { Pool } from "pg";
import { createLogger } from "../logger";

const logger = createLogger('pgPool.ts');

export const pool = new Pool();

export async function shutdownPgPool() {
  logger.info("Shutting down PG pool");
  await pool.end();
}

