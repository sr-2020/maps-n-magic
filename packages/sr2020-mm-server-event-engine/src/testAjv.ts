
// // import Ajv, { JSONSchemaType } from "ajv";
// import { validateSpirit } from "./api/spirits/validation";
// import { 
//   Spirit, SpiritStatus
// } from 'sr2020-mm-event-engine';

// // const spirit = {
// //   "name": "Ангара",
// //   // "aura": "",
// //   "fraction": "Медведь",
// //   "story": "История медведя",
// //   "abilities": [
// //     "123",
// //     "345",
// //     "Фаербол"
// //   ],
// //   // "latLng": {
// //   //   "lat": 0,
// //   //   "lng": 0
// //   // },
// //   // "plane": "subastral",
// //   // "hitPoints": 10,
// //   "maxHitPoints": 10,
// //   "id": 3
// // };
// const spirit: Spirit = {
//   "name": "Ангара",
//   // "aura": "",
//   // "fraction": "Медведь",
//   "fraction": 1,
//   "story": "История медведя",
//   timetable: [],
//   "abilities": [
//     "123",
//     "345",
//     "Фаербол"
//   ],
//   state: { status: SpiritStatus.NotInGame },
//   // "latLng": {
//   //   "lat": 0,
//   //   "lng": 0
//   // },
//   // "plane": "subastral",
//   // "hitPoints": 10,
//   "maxHitPoints": 10,
//   "id": 3
// };

// const defaultSpirit: Spirit = {
//   "id": 3,
//   name: '',
//   // aura: '',
//   fraction: 1,
//   story: '',
//   abilities: [],
//   timetable: [],
//   state: { status: SpiritStatus.NotInGame },

//   // latLng: {
//   //   lat: 0,
//   //   lng: 0,
//   // },
//   // plane: 'subastral',
//   // hitPoints: 10,
//   maxHitPoints: 10,
// };


// // const Ajv = require("ajv")
// // const ajv = new Ajv()
// // const ajv = new Ajv({
// //   allErrors: true,
// //   removeAdditional: true,
// //   useDefaults: true
// // })

// // const schema: JSONSchemaType<Spirit> = {
// //   type: "object",
// //   properties: {
// //     id: {type: "integer"},
// //     name: {type: "string", default: ""},
// //     // aura: {type: "string"},
// //     fraction: {type: "string", default: ""},
// //     story: {type: "string", default: ""},
// //     abilities: {type: "array", items: {type: "string"}, default: []},
// //     maxHitPoints: {type: "integer", minimum: 1, default: 10},
// //     // latLng: {
// //     //   type: "object",
// //     //   properties: {
// //     //   }
// //     // }
// //   },
// //   required: ["name", "id", "fraction", "story", "abilities", "maxHitPoints"],
// //   additionalProperties: false,
// // }

// // const validate = ajv.compile(schema)

// const data = {foo: 1, bar: "abc", sdf: 12}
// const valid = validateSpirit(spirit)
// // if (!valid) 
// console.log(validateSpirit.errors)
// console.log(spirit)

// const spirit2 = {id: 12};
// const valid2 = validateSpirit(spirit2)
// // if (!valid) 
// console.log(validateSpirit.errors)
// console.log(spirit2)

// if (validateSpirit(spirit2)) {
//   const t1 = spirit2;
//   // data is MyData here
//   // console.log(data.foo)
// } else {
//   console.log(validateSpirit.errors)
// }


// // const ajv = new Ajv()

// // const schema = {
// //   type: "object",
// //   properties: {
// //     foo: {type: "integer"},
// //     bar: {type: "string"}
// //   },
// //   required: ["foo"],
// //   additionalProperties: false
// // }

// // const validate = ajv.compile(schema)

// // const data = {foo: 1, bar: "abc", sdf: 12}
// // const valid = validate(data)
// // if (!valid) console.log(ajv.errors)

export {};