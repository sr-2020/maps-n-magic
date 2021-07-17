import { PubSub, Message } from '@google-cloud/pubsub';
import { SpellCast } from "sr2020-mm-event-engine";
import Ajv, { JSONSchemaType } from "ajv";
import { manaOceanSpellCastSubscriptionName } from "../constants";
import { createLogger } from '../../logger';

const logger = createLogger('listenSpellCasts.ts');

const timeout = 60;

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

const spellCastSchema: JSONSchemaType<SpellCast> = {
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

export const validateSpellCast = ajv.compile(spellCastSchema);


// Creates a client; cache this for further use
const pubSubClient = new PubSub();

export function listenSpellCasts(
  callback: (spellCast: SpellCast) => Promise<void>, 
  simulateMessages: boolean = false
) {

  logger.info('Starting spell cast pubsub subscription');
  // References an existing subscription
  const subscription = pubSubClient.subscription(manaOceanSpellCastSubscriptionName);

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = (message: Message) => {
    // logger.info(`Received message ${message.id}:`);
    // logger.info(`\tData: ${message.data}`);
    const parsedData: SpellCast = JSON.parse(message.data.toString());
    // logger.info(`listenSpellCasts data: ${JSON.stringify(parsedData, null, '  ')}`);
    // logger.info(`\tAttributes: ${message.attributes}`);
    messageCount += 1;

    // "Ack" (acknowledge receipt of) the message
    message.ack();

    if (!validateSpellCast(parsedData)) {
      logger.error(`Received invalid listenSpellCasts. ${JSON.stringify(parsedData)} ${JSON.stringify(validateSpellCast.errors)}`);
    } else {
      // logger.info('listenSpellCasts validation OK');
    }

    callback(parsedData);
  };

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler);

  subscription.on('error', error => {
    logger.error('listenSpellCasts received error:', error);
    // process.exit(1);
  });

  // if (simulateMessages) {
  //   const flag = true;
  //   const charList = [10198, 9504, 9542, 10199, 10200, 10201];
  //   // charList.forEach((characterId) => {
  //   // });

  //   const locArr = [3080, 3177, 3175, 3183, 3054, 3050, 3166, 3060, 3051, 3066,
  //     3174, 3062, 3188, 3187, 3065, 3047, 3178, 3132, 3186, 3185, 3179, 3061,
  //     3184, 3064, 3063, 3180, 3053, 3176, 3052, 3055, 3173, 3181, 3049, 3182, 3048, 3067];
  //   // const locArr = [3047, 3049];
  //   let spellSwitch = true;
  //   const emitEvent = () => {
  //     callback({
  //       timestamp: moment.utc().valueOf(), // Unix time в миллисекундах
  //       // id: 'stone-skin', // id спелла из сводной таблички
  //       // name: 'Skin stoner', // человекочитаемое название спелла
  //       // id: 'input-stream', // id спелла из сводной таблички
  //       id: spellSwitch ? 'input-stream' : 'output-stream', // id спелла из сводной таблички
  //       name: 'Input Stream', // человекочитаемое название спелла
  //       // characterId: '10198', // персонаж применивший спелл
  //       characterId: '51935', // персонаж применивший спелл
  //       location: {
  //         // id: 3065, // район силовиков
  //         // id: 3048,
  //         id: sample(locArr),
  //         manaLevel: 10,
  //       },
  //       power: 7, // мощь спелла
  //       // power: 4, // мощь спелла
  //       reagentIds: ['123', '321'], // идентификаторы QR-ов реагентов
  //       // ritualMembersIds: [], // идентификаторы участников ритуала
  //       // ritualVictimIds: [], // идентификаторы жертв ритуала
  //       // reagentIds: ['123', '321'], // идентификаторы QR-ов реагентов
  //       ritualMembersIds: ['555', '666'], // идентификаторы участников ритуала
  //       ritualVictimIds: ['111', '222'], // идентификаторы жертв ритуала
  //       // целевой персонаж (если данная способность имеет целевого персонажа),
  //       // иначе пусто
  //       targetCharacterId: '10246',
  //     });
  //     spellSwitch = !spellSwitch;
  //     // const characterId = charList[randomInteger(0, charList.length - 1)];
  //     // callback({
  //     //   characterId,
  //     //   stateFrom: 'healthy',
  //     //   stateTo: bodyConditions[randomInteger(0, bodyConditions.length - 1)],
  //     //   // stateTo: 'clinically_dead',
  //     //   // stateFrom: flag ? 'clinically_dead' : 'healthy',
  //     //   // stateTo: !flag ? 'clinically_dead' : 'healthy',
  //     //   timestamp: moment.utc().valueOf(),
  //     // });
  //     // flag = !flag;
  //   // }, 3000);
  //   };
  //   // setTimeout(() => emitEvent(), 5000);
  //   // emitEvent();
  //   setInterval(emitEvent, 60000 * 20);
  //   // setInterval(emitEvent, 30000);
  //   // setInterval(emitEvent, 10000);
  //   // }, 30000);
  //   // }, 500);
  //   // }, 100);
  // }

  // setTimeout(() => {
  //   subscription.removeListener('message', messageHandler);
  //   logger.info(`${messageCount} message(s) received.`);
  // }, timeout * 1000);
}

// exports.listenHealthChanges = listenHealthChanges;
// logger.info('process.env.NODE_ENV', process.env.NODE_ENV);
// throw new Error('boom');
