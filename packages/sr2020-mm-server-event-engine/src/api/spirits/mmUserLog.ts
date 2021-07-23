import { createLogger } from "../../logger";
import { pool } from "../pgPool";

const logger = createLogger('mmUserLog.ts');

export const mmUserLog = async function(
  characterId: number,
  title: string,
  text: string
): Promise<void> {
  try{
    await pool.query('INSERT INTO "mmUserLog"(timestamp, "characterId", data) VALUES($1,$2,$3)', [new Date(), characterId, {
      title,
      text
    }]);
  } catch(err) {
    logger.info(`Error on posting user message ${characterId} ${title} ${text}`, err);
  }
}
