import { 
  SpiritFraction,
} from 'sr2020-mm-event-engine';
import * as R from 'ramda';

import { pool } from "../pgPool";

import {
  validateGenericRow,
  validateGenericRows,
} from "./genericRowValidation";
import { createLogger } from '../../utils';

const logger = createLogger('spiritFractions.ts');

export const getSpiritFraction = async function(id: number): Promise<unknown> {
  const { rows } = await pool.query('SELECT * FROM "spiritFraction" WHERE id = $1', [id]);
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

// very similar to getSpirits
export const getSpiritFractions = async function(): Promise<unknown[]> {
  const { rows } = await pool.query('SELECT * FROM "spiritFraction"');
  // logger.info('raw spiritFractions', rows);
  if(!validateGenericRows(rows)) {
    throw new Error(`Generic row check got validation error. ${JSON.stringify(validateGenericRows.errors)}`);
  }

  rows.forEach((row) => {
    const data = row.data as any;
    if (data.abilities === undefined) {
      data.abilities = [];
    }
  });
  return rows.map(row => ({
    ...row.data,
    id: row.id,
  }));
}

export const putSpiritFraction = async function(entity: SpiritFraction): Promise<SpiritFraction> {
  logger.info("put", entity.id);
  await pool.query('UPDATE "spiritFraction" SET data = $1 WHERE id = $2', 
    [R.omit(['id'], entity), entity.id]
  );
  return entity;
}