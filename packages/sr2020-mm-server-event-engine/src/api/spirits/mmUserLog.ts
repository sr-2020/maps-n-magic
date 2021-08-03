import { HistoryItem } from "sr2020-mm-event-engine";
import { createLogger } from "../../utils";
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

export const mmGetUserLog = async function(characterId: number): Promise<HistoryItem[]> {
  const { rows } = await pool.query('SELECT timestamp, "characterId", data FROM "mmUserLog" WHERE "characterId" = $1 ORDER BY timestamp DESC LIMIT 100', [characterId]);
  return rows;
}
