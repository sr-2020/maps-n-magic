import Ajv, { JSONSchemaType } from "ajv";

export interface RawSpellCast {
  // timestamp: moment.utc().valueOf(), // Unix time в миллисекундах
  timestamp: number;
  // // id: 'stone-skin', // id спелла из сводной таблички
  // // name: 'Skin stoner', // человекочитаемое название спелла
  // // id: 'input-stream', // id спелла из сводной таблички
  // id: spellSwitch ? 'input-stream' : 'output-stream', // id спелла из сводной таблички
  id: string;
  // name: 'Input Stream', // человекочитаемое название спелла
  name: string;
  // // characterId: '10198', // персонаж применивший спелл
  // characterId: '51935', // персонаж применивший спелл
  characterId: string;
  // location: {
  //   // id: 3065, // район силовиков
  //   // id: 3048,
  //   id: sample(locArr),
  //   manaLevel: 10,
  // },
  location: {
    id: number;
  };
  // power: 7, // мощь спелла
  power: number;
  // // power: 4, // мощь спелла
  // reagentIds: ['123', '321'], // идентификаторы QR-ов реагентов
  // // ritualMembersIds: [], // идентификаторы участников ритуала
  // // ritualVictimIds: [], // идентификаторы жертв ритуала
  // // reagentIds: ['123', '321'], // идентификаторы QR-ов реагентов
  // ritualMembersIds: ['555', '666'], // идентификаторы участников ритуала
  // ritualVictimIds: ['111', '222'], // идентификаторы жертв ритуала
  ritualMembersIds: string[],
  ritualVictimIds: string[],
  // // целевой персонаж (если данная способность имеет целевого персонажа),
  // // иначе пусто
  // targetCharacterId: '10246',
}

export interface SpellCast extends RawSpellCast {
  uid: string;
}

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

// export interface SpellCast {
//   // timestamp: moment.utc().valueOf(), // Unix time в миллисекундах
//   timestamp: number;
//   // // id: 'stone-skin', // id спелла из сводной таблички
//   // // name: 'Skin stoner', // человекочитаемое название спелла
//   // // id: 'input-stream', // id спелла из сводной таблички
//   // id: spellSwitch ? 'input-stream' : 'output-stream', // id спелла из сводной таблички
//   id: string;
//   // name: 'Input Stream', // человекочитаемое название спелла
//   name: string;
//   // // characterId: '10198', // персонаж применивший спелл
//   // characterId: '51935', // персонаж применивший спелл
//   characterId: string;
//   // location: {
//   //   // id: 3065, // район силовиков
//   //   // id: 3048,
//   //   id: sample(locArr),
//   //   manaLevel: 10,
//   // },
//   location: {
//     id: number;
//   };
//   // power: 7, // мощь спелла
//   power: number;
//   // // power: 4, // мощь спелла
//   // reagentIds: ['123', '321'], // идентификаторы QR-ов реагентов
//   // // ritualMembersIds: [], // идентификаторы участников ритуала
//   // // ritualVictimIds: [], // идентификаторы жертв ритуала
//   // // reagentIds: ['123', '321'], // идентификаторы QR-ов реагентов
//   // ritualMembersIds: ['555', '666'], // идентификаторы участников ритуала
//   // ritualVictimIds: ['111', '222'], // идентификаторы жертв ритуала
//   ritualMembersIds: string[],
//   ritualVictimIds: string[],
//   // // целевой персонаж (если данная способность имеет целевого персонажа),
//   // // иначе пусто
//   // targetCharacterId: '10246',
// }

const rawSpellCastSchema: JSONSchemaType<RawSpellCast> = {
  type: "object",
  properties: {
    timestamp: {type: "integer"},
    id: {type: "string"},
    name: {type: "string"},
    characterId: {type: "string"},
    location: {type: "object", 
      properties: {
        id: {type: 'integer'}
      },
      required: ['id']
    },
    power: {type: "integer"},
    ritualMembersIds: {type: "array", items: {type: 'string'}},
    ritualVictimIds: {type: "array", items: {type: 'string'}},
  },
  required: [
    "timestamp", 
    "id", 
    "name",
    "characterId",
    "location",
    "power",
    "ritualMembersIds",
    "ritualVictimIds",
  ],
  // additionalProperties: false,
};

export const validateRawSpellCast = ajv.compile(rawSpellCastSchema);
