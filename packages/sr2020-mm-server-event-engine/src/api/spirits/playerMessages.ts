import { createLogger } from "../../logger";
import { pool } from "../pgPool";

const logger = createLogger('playerMessages.ts');

export const playerMessages = async function(
  message: string
): Promise<void> {
  try{
    await pool.query('INSERT INTO "playerMessages"(message) VALUES($1)', [message]);
  } catch(err) {
    logger.info(`Error on posting player message ${message}`, err);
  }
}