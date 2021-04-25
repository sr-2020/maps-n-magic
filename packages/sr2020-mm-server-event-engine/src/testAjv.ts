
import Ajv, { JSONSchemaType } from "ajv";

import { 
  Spirit
} from 'sr2020-mm-event-engine';

// const spirit = {
//   "name": "Ангара",
//   // "aura": "",
//   "fraction": "Медведь",
//   "story": "История медведя",
//   "abilities": [
//     "123",
//     "345",
//     "Фаербол"
//   ],
//   // "latLng": {
//   //   "lat": 0,
//   //   "lng": 0
//   // },
//   // "plane": "subastral",
//   // "hitPoints": 10,
//   "maxHitPoints": 10,
//   "id": 3
// };
const spirit: Spirit = {
  "name": "Ангара",
  // "aura": "",
  "fraction": "Медведь",
  "story": "История медведя",
  "abilities": [
    "123",
    "345",
    "Фаербол"
  ],
  // "latLng": {
  //   "lat": 0,
  //   "lng": 0
  // },
  // "plane": "subastral",
  // "hitPoints": 10,
  "maxHitPoints": 10,
  "id": 3
};



// const Ajv = require("ajv")
// const ajv = new Ajv()
const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true
})

const schema: JSONSchemaType<Spirit> = {
  type: "object",
  properties: {
    name: {type: "string", default: ""},
    id: {type: "integer"},
    // aura: {type: "string"},
    fraction: {type: "string", default: ""},
    story: {type: "string", default: ""},
    abilities: {type: "array", items: {type: "string"}, default: []},
    maxHitPoints: {type: "integer", minimum: 1, default: 10},
    // latLng: {
    //   type: "object",
    //   properties: {
    //   }
    // }
  },
  required: ["name", "id", "fraction", "story", "abilities", "maxHitPoints"],
  additionalProperties: false,
}

const validate = ajv.compile(schema)

const data = {foo: 1, bar: "abc", sdf: 12}
const valid = validate(spirit)
// if (!valid) 
console.log(validate.errors)
console.log(spirit)

const spirit2 = {id: 12};
const valid2 = validate(spirit2)
// if (!valid) 
console.log(validate.errors)
console.log(spirit2)

if (validate(spirit2)) {
  const t1 = spirit2;
  // data is MyData here
  // console.log(data.foo)
} else {
  console.log(validate.errors)
}


// const ajv = new Ajv()

// const schema = {
//   type: "object",
//   properties: {
//     foo: {type: "integer"},
//     bar: {type: "string"}
//   },
//   required: ["foo"],
//   additionalProperties: false
// }

// const validate = ajv.compile(schema)

// const data = {foo: 1, bar: "abc", sdf: 12}
// const valid = validate(data)
// if (!valid) console.log(ajv.errors)