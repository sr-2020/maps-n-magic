import { 
  Spirit,
} from 'sr2020-mm-event-engine';
import * as R from 'ramda';

import { pool } from "../pgPool";
import { 
  validateGenericRow, 
  validateGenericRows, 
} from "./genericRowValidation";
import { createLogger } from '../../utils';
import { GenericRow } from './types';

const logger = createLogger('spirits.ts');

export const getSpirit = async function(id: number): Promise<unknown> {
  const { rows } = await pool.query('SELECT * FROM spirit WHERE id = $1', [id]);
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

export const getSpirits = async function(): Promise<unknown[]> {
  const { rows } = await pool.query('SELECT * FROM spirit');
  // logger.info('raw spirits', JSON.stringify(rows));
  if(!validateGenericRows(rows)) {
    throw new Error(`Generic row check got validation error. ${JSON.stringify(validateGenericRows.errors)}`);
  }
  // migration for spirits:
  //  remove maxHitPoints
  //  add hitPoints, level
  rows.forEach(migrateRow);
  return rows.map(row => ({
    ...row.data,
    id: row.id,
  }));
}

function migrateRow(row: GenericRow) {
  const data = row.data as any;
  if (data.maxHitPoints !== undefined) {
    delete data.maxHitPoints;
  }
  if (data.hitPoints === undefined) {
    data.hitPoints = 1;
  }
  if (data.level === undefined) {
    data.level = 1;
  }
  if (data.state.status === 'Suited' && 
    data.state.emergencyDispirited !== undefined
  ) {
    delete data.state.emergencyDispirited;
  }
  if (data.state.status === 'Suited' && 
    data.state.suitStatus === undefined
  ) {
    data.state.suitStatus = 'normal';
  }
}

export const postSpirit = async function(entity: Omit<Spirit, "id">): Promise<Spirit> {
  const { rows } = await pool.query('INSERT INTO spirit(data) VALUES($1) RETURNING id', [entity]);
  return {
    ...entity,
    id: rows[0].id
  };
}

export const putSpirit = async function(entity: Spirit): Promise<Spirit> {
  // logger.info("put", entity.id);
  // await pool.query('UPDATE spirit SET data = $1 WHERE id = $2', [R.omit(['id'], entity), entity.id]);
  const { queryText, values } = generatePutQuery([entity]);
  await pool.query(queryText, values);
  return entity;
}

function generatePutQuery(spirits: Spirit[]): {
  queryText: string,
  values: unknown[]
} {

  const valueSubstitutions = spirits.map((spirit, index) => {
    return `($${index * 2 + 1}::integer, $${index * 2 + 2}::jsonb)`
  }).join(', ')

  const values = spirits.reduce((acc: unknown[], spirit: Spirit) => {
    acc.push(spirit.id, R.omit(['id'], spirit));
    return acc;
  }, []);
  
  // Query example
  // UPDATE spirit
  // SET data = putSpirit.data
  // FROM (values
  //   (120, '{"name": "sdfs-1","state": {"status": "NotInGame"},"story": "","fraction": 1,"abilities": [],"timetable": [],"maxHitPoints": 10}'::jsonb),
  //   (121, '{"name": "sdfs-2","state": {"status": "NotInGame"},"story": "","fraction": 1,"abilities": [],"timetable": [],"maxHitPoints": 10}'::jsonb)  
  // ) AS putSpirit(id, data)
  // WHERE spirit.id = putSpirit.id;

  const queryText = `
    UPDATE spirit
    SET data = putSpirit.data
    FROM (values
      ${valueSubstitutions}
    ) AS putSpirit(id, data)
    WHERE spirit.id = putSpirit.id;`.split('\n').join(' ');

  // logger.info(values);
  // logger.info(queryText);

  return {
    queryText,
    values
  };
}

export const putMultipleSpirits = async function(entities: Spirit[]): Promise<Spirit[]> {
  // logger.info("put multiple", R.pluck('id', entities));
  const { queryText, values } = generatePutQuery(entities);
  await pool.query(queryText, values);
  return entities;
}

export const deleteSpirit = async function(id: number): Promise<unknown | null> {
  // logger.info("delete", id);
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
