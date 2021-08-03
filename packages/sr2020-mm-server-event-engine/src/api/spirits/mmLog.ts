import { HistoryItem, OrgHistoryItem } from "sr2020-mm-event-engine";
import { createLogger } from "../../utils";
import { pool } from "../pgPool";

const logger = createLogger('mmLog.ts');

export const mmLog = async function(
  type: string,
  message: string
): Promise<void> {
  try{
    await pool.query('INSERT INTO "mmLog"(timestamp, type, message) VALUES($1,$2,$3)', [new Date(), type, message]);
  } catch(err) {
    logger.info(`Error on posting message ${type} ${message}`, err);
  }
}

export const mmGetLog = async function(characterId: number): Promise<OrgHistoryItem[]> {
  const { rows } = await pool.query('SELECT * FROM "mmLog" WHERE message like \'%' + characterId + '%\' ORDER BY timestamp DESC');
  return rows;
}
