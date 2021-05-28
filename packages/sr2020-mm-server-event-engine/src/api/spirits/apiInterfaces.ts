import { 
  Spirit,
  SpiritFraction
} from 'sr2020-mm-event-engine';
import * as R from 'ramda';

import { pool } from "../pgPool";
import { 
  validateGenericRow, 
  validateSpirit, 
  validateNewSpirit,
  validateSpiritFraction 
} from "./validateSpirit";


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
    if (validateSpirit(rawSpirit)) {
      return rawSpirit;
    } else {
      console.error("Skip spirit because it is not valid.", rawSpirit, validateSpirit.errors);
    }
  } else {
    console.error("Skip spirit row because row is not valid.", row, validateGenericRow.errors);
  }
  return null;
}

// very similar to getSpirits
export const getSpiritFractions = async function(): Promise<SpiritFraction[]> {
  const { rows } = await pool.query('SELECT * FROM "spiritFraction"');
  console.log('raw spiritFractions', rows);
  return rows.reduce((acc: SpiritFraction[], row) => {
    const res = rowToSpiritFraction(row);
    if(res !== null) {
      acc.push(res);
    }
    return acc;
  }, []);
}

// very similar to rowToSpirit
function rowToSpiritFraction(row): SpiritFraction | null {
  if (validateGenericRow(row)) {
    const rawFraction = {
      ...row.data,
      id: row.id,
    };
    if (validateSpiritFraction(rawFraction)) {
      return rawFraction;
    } else {
      console.error("Skip spirit fraction because it is not valid.", rawFraction, validateSpirit.errors);
    }
  } else {
    console.error("Skip spirit fraction row because row is not valid.", row, validateGenericRow.errors);
  }
  return null;
}

export const postSpirit = async function(entity: Partial<Omit<Spirit, "id">>): Promise<Spirit> {
  if (validateNewSpirit(entity)) {
    const { rows } = await pool.query('INSERT INTO spirit(data) VALUES($1) RETURNING id', [entity]);
    return {
      ...entity,
      id: rows[0].id
    };
  } else {
    throw new Error("Post spirit entity is not valid " + JSON.stringify(entity) + ", " + JSON.stringify(validateSpirit.errors));
  }
}

export const putSpirit = async function(entity: Spirit): Promise<Spirit> {
  console.log("put", entity.id);
  if (validateSpirit(entity)) {
    await pool.query('UPDATE spirit SET data = $1 WHERE id = $2', [R.omit(['id'], entity), entity.id]);
    return entity;
  } else {
    throw new Error("Put spirit entity is not valid " + JSON.stringify(entity) + ", " + JSON.stringify(validateSpirit.errors));
  }
}

export const putSpiritFraction = async function(entity: SpiritFraction): Promise<SpiritFraction> {
  console.log("put", entity.id);
  if (validateSpiritFraction(entity)) {
    await pool.query('UPDATE "spiritFraction" SET data = $1 WHERE id = $2', [R.omit(['id'], entity), entity.id]);
    return entity;
  } else {
    throw new Error("Put spirit fraction entity is not valid " + JSON.stringify(entity) + ", " + JSON.stringify(validateSpirit.errors));
  }
}

export const deleteSpirit = async function(id: number): Promise<Spirit | null> {
  console.log("delete", id);
  const { rows } = await pool.query('DELETE FROM spirit WHERE id = $1 RETURNING id, data', [id]);
  return rows.length > 0 ? rowToSpirit(rows[0]) : null;
}

// // export const multiPuttable = <T>(state: {url: string}) => ({
// //   async putMultiple({ updates }: {updates: T}) {
// //     const response = await fetch(`${state.url}`, {
// //       method: 'PUT',
// //       headers: {
// //         'Content-Type': 'application/json;charset=utf-8',
// //         'X-User-Id': '1',
// //       },
// //       body: JSON.stringify(updates),
// //     });

// //     if (!response.ok) {
// //       const text = await response.text();
// //       throw new Error(`Network response was not ok ${text}`);
// //     }

// //     return response.json();
// //   },
// // });
