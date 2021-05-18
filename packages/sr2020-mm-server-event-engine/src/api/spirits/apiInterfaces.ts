import { 
  Spirit
} from 'sr2020-mm-event-engine';
import * as R from 'ramda';

import { pool } from "../pgPool";
import { validateGenericRow, validateSpirit, validateNewSpirit } from "./validateSpirit";


export const getSpirits = async function(): Promise<Spirit[]> {
  const { rows } = await pool.query('SELECT * FROM spirit');
  console.log('raw spirits', rows);
  return rows.reduce((acc: Spirit[], row) => {
    if (validateGenericRow(row)) {
      const rawSpirit = {
        ...row.data,
        id: row.id,
      };
      if (validateSpirit(rawSpirit)) {
        acc.push(rawSpirit);
      } else {
        console.error("Skip spirit because it is not valid.", rawSpirit, validateSpirit.errors);
      }
    } else {
      console.error("Skip spirit row because row is not valid.", row, validateGenericRow.errors);
    }
    return acc;
  }, []);
}

export const postSpirit = async function(entity: Partial<Omit<Spirit, "id">>): Promise<Spirit> {
  if (validateNewSpirit(entity)) {
    const { rows } = await pool.query('INSERT INTO spirit(data) VALUES($1) RETURNING *', [entity]);
    return {
      ...entity,
      id: rows[0].id
    };
  } else {
    throw new Error("Post spirit entity is not valid " + JSON.stringify(entity) + JSON.stringify(validateSpirit.errors));
  }
}

// export const gettable = (state: {url: string}) => ({
//   async get() {
//     // console.log('gettable url', `${state.url}?limit=200`);
//     const response = await fetch(`${state.url}?limit=200`);
//     if (!response.ok) {
//       const text = await response.text();
//       throw new Error(`Network response was not ok ${text}`);
//     }

//     return response.json();
//   },
// });

// export const postable = <T>(state: {url: string, defaultObject: T}) => ({
//   async post({ props }: {props: T}) {
//     const response = await fetch(state.url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8',
//         'X-User-Id': '1',
//       },
//       body: JSON.stringify({
//         ...state.defaultObject,
//         ...props,
//       }),
//     });

//     if (!response.ok) {
//       const text = await response.text();
//       throw new Error(`Network response was not ok ${text}`);
//     }

//     return response.json();
//   },
// });

// export const puttable = <T>(state: {url: string}) => ({
//   async put({ id, props }: {id: number, props: T}) {
//     const response = await fetch(`${state.url}/${id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8',
//         'X-User-Id': '1',
//       },
//       body: JSON.stringify({
//         ...props,
//       }),
//     });

//     if (!response.ok) {
//       const text = await response.text();
//       throw new Error(`Network response was not ok ${text}`);
//     }

//     return response.json();
//   },
// });

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

// export const deletable = (state: {url: string}) => ({
//   async delete({ id }: {id: number}) {
//     const response = await fetch(`${state.url}/${id}`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json;charset=utf-8',
//         'X-User-Id': '1',
//       },
//     });

//     if (!response.ok) {
//       const text = await response.text();
//       throw new Error(`Network response was not ok ${text}`);
//     }

//     return response;
//   },
// });
