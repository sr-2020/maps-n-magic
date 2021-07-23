import { 
  Spirit,
  SpiritFraction,
  SpiritPhrase
} from 'sr2020-mm-event-engine';
import * as R from 'ramda';

import { pool } from "../pgPool";
import { 
  validateGenericRow, 
  validateGenericRows
} from "./genericRowValidation";
import { createLogger } from '../../utils';

const logger = createLogger('spiritPhrases.ts');

export const getSpiritPhrases = async function(): Promise<unknown[]> {
  const { rows } = await pool.query('SELECT * FROM "spiritPhrase"');
  // logger.info('raw spiritPhrase', rows);
  if(!validateGenericRows(rows)) {
    throw new Error(`Generic row check got validation error. ${JSON.stringify(validateGenericRows.errors)}`);
  }
  return rows.map(row => ({
    ...row.data,
    id: row.id,
  }));
}

export const postSpiritPhrase = async function(entity: Omit<SpiritPhrase, "id">): Promise<SpiritPhrase> {
  const { rows } = await pool.query('INSERT INTO "spiritPhrase"(data) VALUES($1) RETURNING id', [entity]);
  return {
    ...entity,
    id: rows[0].id
  };
}

export const putSpiritPhrase = async function(entity: SpiritPhrase): Promise<SpiritPhrase> {
  logger.info("put", entity.id);
  await pool.query('UPDATE "spiritPhrase" SET data = $1 WHERE id = $2', [R.omit(['id'], entity), entity.id]);
  return entity;
}

export const deleteSpiritPhrase = async function(id: number): Promise<unknown | null> {
  logger.info("delete", id);
  const { rows } = await pool.query('DELETE FROM "spiritPhrase" WHERE id = $1 RETURNING id, data', [id]);
  const row: unknown | null = rows[0] ? rows[0] : null;
  if(row === null) {
    return row;
  }
  if (!validateGenericRow(row)) {
    throw new Error(`Generic row check got validation error. ${JSON.stringify(validateGenericRow.errors)}`);
  }
  return {
    ...row.data,
    id: row.id,
  };
}
