import { 
  Spirit,
  SpiritStatus
} from 'sr2020-mm-event-engine';
import * as R from 'ramda';

import { pool } from "../pgPool";
import { 
  validateGenericRow, 
  validateSpirit, 
  validateNewSpirit,
} from "./validation";

export const getSpirits = async function(): Promise<Spirit[]> {
  const { rows } = await pool.query('SELECT * FROM spirit');
  // console.log('raw spirits', rows);
  return rows.reduce((acc: Spirit[], row) => {
    const res = rowToSpirit(row);
    if(res !== null) {
      acc.push(res);
    }
    return acc;
  }, []);
}

function rowToSpirit(row): Spirit | null {
  if (validateGenericRow(row)) {
    const rawSpirit = {
      ...row.data,
      id: row.id,
    };
    // TODO remove when all spirits will use fraction id
    if (typeof (rawSpirit as any).fraction === 'string') {
      (rawSpirit as any).fraction = 1;
    }
    if (typeof (rawSpirit as any).timetable === undefined) {
      (rawSpirit as any).timetable = [];
    }
    if ((rawSpirit as any).state === undefined) {
      (rawSpirit as any).state = { status: SpiritStatus.NotInGame };
    }
    if (validateSpirit(rawSpirit)) {
      return rawSpirit;
    } else {
      console.error("Skip spirit because it is not valid.", 
        rawSpirit,
        validateSpirit.errors
      );
    }
  } else {
    console.error("Skip spirit row because row is not valid.", 
      row, 
      validateGenericRow.errors
    );
  }
  return null;
}

export const postSpirit = async function(entity: Partial<Omit<Spirit, "id">>): Promise<Spirit> {
  if(entity.state === undefined) {
    entity.state = { status: 'NotInGame' };
  }
  if (validateNewSpirit(entity)) {
    const { rows } = await pool.query('INSERT INTO spirit(data) VALUES($1) RETURNING id', [entity]);
    return {
      ...entity,
      id: rows[0].id
    };
  } else {
    throw new Error("Post spirit entity is not valid " + 
      JSON.stringify(entity) + ", " + 
      JSON.stringify(validateNewSpirit.errors)
    );
  }
}

export const putSpirit = async function(entity: Spirit): Promise<Spirit> {
  console.log("put", entity.id);
  if (validateSpirit(entity)) {
    await pool.query('UPDATE spirit SET data = $1 WHERE id = $2', [R.omit(['id'], entity), entity.id]);
    return entity;
  } else {
    throw new Error("Put spirit entity is not valid " + 
      JSON.stringify(entity) + ", " + 
      JSON.stringify(validateSpirit.errors)
    );
  }
}

export const deleteSpirit = async function(id: number): Promise<Spirit | null> {
  console.log("delete", id);
  const { rows } = await pool.query('DELETE FROM spirit WHERE id = $1 RETURNING id, data', [id]);
  return rows.length > 0 ? rowToSpirit(rows[0]) : null;
}
