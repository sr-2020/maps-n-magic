import { 
  Spirit,
  SpiritFraction,
  SpiritRoute
} from 'sr2020-mm-event-engine';
import * as R from 'ramda';

import { pool } from "../pgPool";
import { 
  validateGenericRow, 
  validateGenericRows
} from "./genericRowValidation";
import { createLogger } from '../../utils';

const logger = createLogger('spiritRoutes.ts');

export const getSpiritRoutes = async function(): Promise<unknown[]> {
  const { rows } = await pool.query('SELECT * FROM "spiritRoute"');
  // logger.info('raw spirits', rows);
  if(!validateGenericRows(rows)) {
    throw new Error(`Generic row check got validation error. ${JSON.stringify(validateGenericRows.errors)}`);
  }
  return rows.map(row => ({
    ...row.data,
    id: row.id,
  }));
}

export const postSpiritRoute = async function(entity: Omit<SpiritRoute, "id">): Promise<SpiritRoute> {
  const { rows } = await pool.query('INSERT INTO "spiritRoute"(data) VALUES($1) RETURNING id', [entity]);
  return {
    ...entity,
    id: rows[0].id
  };
}

export const putSpiritRoute = async function(entity: SpiritRoute): Promise<SpiritRoute> {
  logger.info("put", entity.id);
  await pool.query('UPDATE "spiritRoute" SET data = $1 WHERE id = $2', [R.omit(['id'], entity), entity.id]);
  return entity;
}

export const deleteSpiritRoute = async function(id: number): Promise<unknown | null> {
  logger.info("delete", id);
  const { rows } = await pool.query('DELETE FROM "spiritRoute" WHERE id = $1 RETURNING id, data', [id]);
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
