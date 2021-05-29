import { 
  Spirit,
  SpiritFraction,
  SpiritRoute
} from 'sr2020-mm-event-engine';
import * as R from 'ramda';

import { pool } from "../pgPool";
import { 
  validateGenericRow, 
  validateNewSpiritRoute,
  validateSpiritRoute
} from "./validation";

export const getSpiritRoutes = async function(): Promise<SpiritRoute[]> {
  const { rows } = await pool.query('SELECT * FROM "spiritRoute"');
  // console.log('raw spirits', rows);
  return rows.reduce((acc: SpiritRoute[], row) => {
    const res = rowToSpiritRoute(row);
    if(res !== null) {
      acc.push(res);
    }
    return acc;
  }, []);
}

function rowToSpiritRoute(row): SpiritRoute | null {
  if (validateGenericRow(row)) {
    const raw = {
      ...row.data,
      id: row.id,
    };
    // TODO remove when all spirits will use fraction id
    // if (typeof (raw as any).fraction === 'string') {
    //   (raw as any).fraction = 1;
    // }
    if (validateSpiritRoute(raw)) {
      return raw;
    } else {
      console.error("Skip spirit route because it is not valid.", 
        raw, 
        validateSpiritRoute.errors
      );
    }
  } else {
    console.error("Skip spirit route row because row is not valid.", 
      row, 
      validateGenericRow.errors
    );
  }
  return null;
}

export const postSpiritRoute = async function(entity: Partial<Omit<SpiritRoute, "id">>): Promise<SpiritRoute> {
  if (validateNewSpiritRoute(entity)) {
    const { rows } = await pool.query('INSERT INTO "spiritRoute"(data) VALUES($1) RETURNING id', [entity]);
    return {
      ...entity,
      id: rows[0].id
    };
  } else {
    throw new Error("Post spirit route entity is not valid " + 
      JSON.stringify(entity) + ", " + 
      JSON.stringify(validateNewSpiritRoute.errors)
    );
  }
}

export const putSpiritRoute = async function(entity: SpiritRoute): Promise<SpiritRoute> {
  console.log("put", entity.id);
  if (validateSpiritRoute(entity)) {
    await pool.query('UPDATE "spiritRoute" SET data = $1 WHERE id = $2', [R.omit(['id'], entity), entity.id]);
    return entity;
  } else {
    throw new Error("Put spirit route entity is not valid " + 
      JSON.stringify(entity) + ", " + 
      JSON.stringify(validateSpiritRoute.errors)
    );
  }
}

export const deleteSpiritRoute = async function(id: number): Promise<SpiritRoute | null> {
  console.log("delete", id);
  const { rows } = await pool.query('DELETE FROM "spiritRoute" WHERE id = $1 RETURNING id, data', [id]);
  return rows.length > 0 ? rowToSpiritRoute(rows[0]) : null;
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
