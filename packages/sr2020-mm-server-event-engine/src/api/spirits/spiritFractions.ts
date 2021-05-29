import { 
  Spirit,
  SpiritFraction,
  SpiritRoute
} from 'sr2020-mm-event-engine';
import * as R from 'ramda';

import { pool } from "../pgPool";

import { 
  validateGenericRow, 
  validateSpiritFraction,
} from "./validation";

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
      console.error("Skip spirit fraction because it is not valid.", 
        rawFraction, 
        validateSpiritFraction.errors
      );
    }
  } else {
    console.error("Skip spirit fraction row because row is not valid.", 
      row, 
      validateGenericRow.errors
    );
  }
  return null;
}

export const putSpiritFraction = async function(entity: SpiritFraction): Promise<SpiritFraction> {
  console.log("put", entity.id);
  if (validateSpiritFraction(entity)) {
    await pool.query('UPDATE "spiritFraction" SET data = $1 WHERE id = $2', 
      [R.omit(['id'], entity), entity.id]
    );
    return entity;
  } else {
    throw new Error("Put spirit fraction entity is not valid " + 
      JSON.stringify(entity) + ", " + 
      JSON.stringify(validateSpiritFraction.errors));
  }
}