import { 
  Spirit,
} from 'sr2020-mm-event-engine';
import * as R from 'ramda';

import { pool } from "../pgPool";
import { 
  validateGenericRow, 
  validateGenericRows, 
} from "./validation";

export const getSpirits = async function(): Promise<unknown[]> {
  const { rows } = await pool.query('SELECT * FROM spirit');
  // console.log('raw spirits', rows);
  if(!validateGenericRows(rows)) {
    throw new Error(`Generic row check got validation error. ${JSON.stringify(validateGenericRows.errors)}`);
  }
  return rows.map(row => ({
    ...row.data,
    id: row.id,
  }));
}

export const postSpirit = async function(entity: Omit<Spirit, "id">): Promise<Spirit> {
  const { rows } = await pool.query('INSERT INTO spirit(data) VALUES($1) RETURNING id', [entity]);
  return {
    ...entity,
    id: rows[0].id
  };
}

export const putSpirit = async function(entity: Spirit): Promise<Spirit> {
  console.log("put", entity.id);
  await pool.query('UPDATE spirit SET data = $1 WHERE id = $2', [R.omit(['id'], entity), entity.id]);
  return entity;
}

export const deleteSpirit = async function(id: number): Promise<unknown | null> {
  console.log("delete", id);
  const { rows } = await pool.query('DELETE FROM spirit WHERE id = $1 RETURNING id, data', [id]);
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
