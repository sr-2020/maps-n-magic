
// import { Client, Pool } from "pg";
// import { union } from "sr2020-mm-event-engine/src/utils/set";
// import { GettableResourceProvider } from "./api/position";
// import { getSpirits, postSpirit, putSpirit, deleteSpirit } from "./api/spirits/spirits";

// async function simpleClientExample() {
//     // clients will also use environment variables
//   // for connection information
//   const client = new Client();
//   await client.connect()
//   const res = await client.query('SELECT $1::text as message', ['Hello world!'])
//   console.log(res.rows[0].message) // Hello world!
//   await client.end()
// }
// async function poolSimpleSpiritCheck() {
//   const pool = new Pool();

//   const newSpirit = { name: 'spiritName', health: 10 };
//   // create a new spirit
//   // const { rows: rows4 } = await pool.query('INSERT INTO spirit(data) VALUES($1) RETURNING *', [newSpirit])
//   // console.log('insert rows', rows4);
//   console.log('insert rows', await postSpirit(newSpirit));

//   const rows = await getSpirits();
//   console.log("after post", rows);

//   // update spirit
//   // UPDATE films SET kind = 'Dramatic' WHERE kind = 'Drama';
//   // await pool.query('UPDATE spirit SET data = $1 WHERE id = $2', [{ name: 'spiritName2', health: 20 }, rows[0].id]);

//   await putSpirit({ ...rows[0], name: 'spiritName2' });
//   const rows3 = await getSpirits();
//   console.log("after put", rows3);

//   // const rows = await getSpirits();
//   await deleteSpirit(rows[0].id);
//   // await pool.query('DELETE FROM spirit WHERE id = $1', [rows[0].id+25]);
//   const rows2 = await getSpirits();
//   console.log("after delete", rows2);
//   await pool.end();

// }
// async function poolExample() {
//   // pools will use environment variables
//   // for connection information
//   // const pool = new Pool()
//   const pool = new Pool()
//   // pool.query('SELECT NOW()', (err, res) => {
//   //   console.log(err, res)
//   //   pool.end()
//   // })
//   // you can also use async/await
//   const res = await pool.query('SELECT NOW()')
//   console.log(res);

//   // client
//   // .query('SELECT NOW() as now')
//   // .then(res => console.log(res.rows[0]))
//   // .catch(e => console.error(e.stack))

//   // query params
//   // const text = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
//   // const values = ['brianc', 'brian.m.carlson@gmail.com']
//   // client
//   // .query(text, values)

//   // async/await
//   // try {
//   //   const res = await client.query(text, values)
//   //   console.log(res.rows[0])
//   //   // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
//   // } catch (err) {
//   //   console.log(err.stack)
//   // }


//   // prepared statement needs name
//   // const query = {
//   //   // give the query a unique name
//   //   name: 'fetch-user',
//   //   text: 'SELECT * FROM user WHERE id = $1',
//   //   values: [1],
//   // }
//   // // callback
//   // client.query(query,

//   // pool usage
//   //   const pool = new Pool()
//   //   // async/await - check out a client
//   // ;(async () => {
//   //   const client = await pool.connect()
//   //   try {
//   //     const res = await client.query('SELECT * FROM users WHERE id = $1', [1])
//   //     console.log(res.rows[0])
//   //   } finally {
//   //     // Make sure to release the client before any error handling,
//   //     // just in case the error handling itself throws an error.
//   //     client.release()
//   //   }
//   // })().catch(err => console.log(err.stack))

//   // for single queries run just 
//   // pool.query('SELECT * FROM users WHERE id = $1', [1], (err, res) => {
//   //   if (err) {
//   //     throw err
//   //   }
//   //   console.log('user:', res.rows[0])
//   // })

//   // json example
// //   const createTableText = `
// // CREATE EXTENSION IF NOT EXISTS "pgcrypto";
// // CREATE TEMP TABLE IF NOT EXISTS users (
// //   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
// //   data JSONB
// // );
// // `
// // // create our temp table
// // await client.query(createTableText)
// // const newUser = { email: 'brian.m.carlson@gmail.com' }
// // // create a new user
// // await client.query('INSERT INTO users(data) VALUES($1)', [newUser])
// // const { rows } = await client.query('SELECT * FROM users')
// // console.log(rows)
// // /*
// // output:
// // [{
// //   id: 'd70195fd-608e-42dc-b0f5-eee975a621e9',
// //   data: { email: 'brian.m.carlson@gmail.com' }
// // }]
// // */

//   await pool.end()
// }
// poolSimpleSpiritCheck();

export {};


// type fun1 = (opts: {type: 'a', value: string}) => string;
// type fun2 = (opts: {type: 'b', value: number}) => number;

// type anyFun = fun1 | fun2;

// class Clazz {
//   innerMethod<T extends anyFun>(opts: Parameters<T>[0]): ReturnType<T> {
//     return 123 as ReturnType<T>;
//   }

//   otherMethod() {
//     // Case 1
//     // expected result type: string
//     // actual result type: string | number
//     const result1 = this.innerMethod({type: 'a', value: 'str'});
//     // Case 2
//     // expected result type = actual type = string
//     const result2 = this.innerMethod<fun1>({type: 'a', value: 'str'});
//     // Case 3
//     // TS error that fun2 is incompatible with type: 'a'
//     const result3 = this.innerMethod<fun2>({type: 'a', value: 'str'});
//   }
// }

// A bit more information what problem I want to solve.

// I have a facade which wraps set of services.

// Each service has API and part of this API are syncronous getters.

// Service may request information from other service via getter.

// Getter may be described as function signature.

// I want to use this signature in two places:
// 1. Service which implements getter and it works good.
// 2. Service which calls getter and here I got problem with discriminating union.

// type Fork = number;
// type Spoon = string;

// type GetFork = (arg: {type: 'fork', id: number}) => Fork;
// type GetSpoon = (arg: {type: 'spoon', id: number}) => Spoon;

// interface Facade {

//   constructor(services: AbstractService[]);

//   // routes request to service which can execute getter
//   get(request): any;
// }

// class AbstractService<NeedGetters extends (arg: any) => any = never> {
//   facade!: Facade;

//   init(facade: Facade) {
//     this.facade = facade;
//   }

//   getFromFacade<T extends NeedGetters>(opts: Parameters<T>[0]): ReturnType<T> {
//     return this.facade.get(opts);
//   }
// }
// interface ForksService extends AbstractService {
//   getFork({type}: Parameters<GetFork>[0]): ReturnType<GetFork>;
// }

// interface SpoonsService extends AbstractService {
//   getSpoon({type}: Parameters<GetSpoon>[0]): ReturnType<GetSpoon>;
// }

// class StuffService extends AbstractService<GetFork | GetSpoon> {
//   someMethod() {
//     // TS infered type string | number
//     const fork = this.getFromFacade({type: 'fork', id: 25});

//     // TS infered type string | number
//     const spoon = this.getFromFacade({type: 'spoon', id: 36});
//   }
// }