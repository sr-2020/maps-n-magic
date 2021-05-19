
import { Client, Pool } from "pg";
import { getSpirits, postSpirit, putSpirit, deleteSpirit } from "./api/spirits/apiInterfaces";

async function simpleClientExample() {
    // clients will also use environment variables
  // for connection information
  const client = new Client();
  await client.connect()
  const res = await client.query('SELECT $1::text as message', ['Hello world!'])
  console.log(res.rows[0].message) // Hello world!
  await client.end()
}
async function poolSimpleSpiritCheck() {
  const pool = new Pool();

  const newSpirit = { name: 'spiritName', health: 10 };
  // create a new spirit
  // const { rows: rows4 } = await pool.query('INSERT INTO spirit(data) VALUES($1) RETURNING *', [newSpirit])
  // console.log('insert rows', rows4);
  console.log('insert rows', await postSpirit(newSpirit));

  

  const rows = await getSpirits();
  console.log("after post", rows);

  // update spirit
  // UPDATE films SET kind = 'Dramatic' WHERE kind = 'Drama';
  // await pool.query('UPDATE spirit SET data = $1 WHERE id = $2', [{ name: 'spiritName2', health: 20 }, rows[0].id]);

  await putSpirit({ ...rows[0], name: 'spiritName2' });
  const rows3 = await getSpirits();
  console.log("after put", rows3);

  // const rows = await getSpirits();
  await deleteSpirit(rows[0].id);
  // await pool.query('DELETE FROM spirit WHERE id = $1', [rows[0].id+25]);
  const rows2 = await getSpirits();
  console.log("after delete", rows2);
  await pool.end();

}
async function poolExample() {
  // pools will use environment variables
  // for connection information
  // const pool = new Pool()
  const pool = new Pool()
  // pool.query('SELECT NOW()', (err, res) => {
  //   console.log(err, res)
  //   pool.end()
  // })
  // you can also use async/await
  const res = await pool.query('SELECT NOW()')
  console.log(res);

  // client
  // .query('SELECT NOW() as now')
  // .then(res => console.log(res.rows[0]))
  // .catch(e => console.error(e.stack))

  // query params
  // const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
  // const values = ['brianc', 'brian.m.carlson@gmail.com']
  // client
  // .query(text, values)

  // async/await
  // try {
  //   const res = await client.query(text, values)
  //   console.log(res.rows[0])
  //   // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
  // } catch (err) {
  //   console.log(err.stack)
  // }


  // prepared statement needs name
  // const query = {
  //   // give the query a unique name
  //   name: 'fetch-user',
  //   text: 'SELECT * FROM user WHERE id = $1',
  //   values: [1],
  // }
  // // callback
  // client.query(query,

  // pool usage
  //   const pool = new Pool()
  //   // async/await - check out a client
  // ;(async () => {
  //   const client = await pool.connect()
  //   try {
  //     const res = await client.query('SELECT * FROM users WHERE id = $1', [1])
  //     console.log(res.rows[0])
  //   } finally {
  //     // Make sure to release the client before any error handling,
  //     // just in case the error handling itself throws an error.
  //     client.release()
  //   }
  // })().catch(err => console.log(err.stack))

  // for single queries run just 
  // pool.query('SELECT * FROM users WHERE id = $1', [1], (err, res) => {
  //   if (err) {
  //     throw err
  //   }
  //   console.log('user:', res.rows[0])
  // })

  // json example
//   const createTableText = `
// CREATE EXTENSION IF NOT EXISTS "pgcrypto";
// CREATE TEMP TABLE IF NOT EXISTS users (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   data JSONB
// );
// `
// // create our temp table
// await client.query(createTableText)
// const newUser = { email: 'brian.m.carlson@gmail.com' }
// // create a new user
// await client.query('INSERT INTO users(data) VALUES($1)', [newUser])
// const { rows } = await client.query('SELECT * FROM users')
// console.log(rows)
// /*
// output:
// [{
//   id: 'd70195fd-608e-42dc-b0f5-eee975a621e9',
//   data: { email: 'brian.m.carlson@gmail.com' }
// }]
// */

  await pool.end()
}
poolSimpleSpiritCheck();

export {};