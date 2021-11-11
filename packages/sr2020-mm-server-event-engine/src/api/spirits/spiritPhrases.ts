import { 
  GenericRow,
  SpiritPhrase, validateGenericRow, validateGenericRows
} from 'sr2020-mm-event-engine';
import * as R from 'ramda';

import { pool } from "../pgPool";
import { createLogger } from '../../utils';

const logger = createLogger('spiritPhrases.ts');

export const getSpiritPhrase = async function(id: number): Promise<unknown> {
  const { rows } = await pool.query('SELECT * FROM "spiritPhrase" WHERE id = $1', [id]);
  if (rows.length !== 1) {
    throw new Error(`Single select return non 1 row. id ${id} rows ${JSON.stringify(rows)}`);
  }
  const row = rows[0];
  if(!validateGenericRow(row)) {
    throw new Error(`Generic row check got validation error. ${JSON.stringify(validateGenericRow.errors)}`);
  }
  return {
    ...row.data,
    id: row.id,
  }
}

export const getSpiritPhrases = async function(): Promise<unknown[]> {
  const { rows } = await pool.query('SELECT * FROM "spiritPhrase"');
  // logger.info('raw spiritPhrase', rows);
  if(!validateGenericRows(rows)) {
    throw new Error(`Generic row check got validation error. ${JSON.stringify(validateGenericRows.errors)}`);
  }
  rows.forEach(migrateRow);
  return rows.map(row => ({
    ...row.data,
    id: row.id,
  }));
}

function migrateRow(row: GenericRow) {
  const data = row.data as any;
  if (data.characterId === undefined) {
    data.characterId = null;
  }
  if (data.spiritFractionId === undefined) {
    data.spiritFractionId = null;
  }
  if (data.delivered === undefined) {
    data.delivered = false;
  }
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
