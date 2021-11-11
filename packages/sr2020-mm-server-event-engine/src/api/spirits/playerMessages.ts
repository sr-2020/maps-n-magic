import { PlayerMessage } from "sr2020-mm-event-engine";
import { createLogger } from "../../utils";
import { pool } from "../pgPool";

const logger = createLogger('playerMessages.ts');

export const getPlayerMessages = async function(): Promise<unknown[]> {
  const { rows } = await pool.query('SELECT * FROM "playerMessages"');
  return rows.map(row => {
    const { message } = row;
    if(message.id === undefined) {
      message.id = message.time;
    }
    return message;
  });
}

export const playerMessages = async function(
  playerMessage: PlayerMessage
): Promise<void> {
  try{
    await pool.query('INSERT INTO "playerMessages"(message) VALUES($1)', [JSON.stringify(playerMessage)]);
  } catch(err) {
    logger.info(`Error on posting player message ${JSON.stringify(playerMessage)}`, err);
  }
}
