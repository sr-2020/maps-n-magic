import { Pool } from "pg";

export const pool = new Pool();

export async function shutdownPgPool() {
  console.log("Shutting down PG pool");
  await pool.end();
}

