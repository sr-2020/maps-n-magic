// character_location_change
import { PubSub, Message } from '@google-cloud/pubsub';
import Ajv, { JSONSchemaType } from "ajv";
import { createLogger } from '../../utils';
import { charLocChangeSubscriptionName } from "../constants";

const logger = createLogger('listenCharacterLocations.ts');

const timeout = 60;

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

type CharLocationMessage = {
  id: number,
  locationId: number,
  prevLocationId: number
}

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

const charLocationMessageSchema: JSONSchemaType<CharLocationMessage> = {
  type: "object",
  properties: {
    id: {type: "integer"},
    locationId: {type: "integer"},
    prevLocationId: {type: "integer"},
  },
  required: ["id", "locationId", "prevLocationId"],
  // additionalProperties: false,
};

export const validateCharLocationMessage = ajv.compile(charLocationMessageSchema);


export function listenCharacterLocations(
  callback: (data: CharLocationMessage) => void, 
  simulateMessages = false
) {
  logger.info('Starting character locations pubsub subscription');
  // References an existing subscription
  const subscription = pubSubClient.subscription(charLocChangeSubscriptionName);

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = (message: Message) => {
    // logger.info(`Received message ${message.id}:`);
    // logger.info(`\tData: ${message.data}`);
    const parsedData: CharLocationMessage = JSON.parse(message.data.toString());
    // logger.info(`Data: ${JSON.stringify(parsedData, null, '  ')}`);
    // logger.info(`\tAttributes: ${message.attributes}`);
    messageCount += 1;
    // logger.info(`listenCharacterLocations data: ${JSON.stringify(parsedData, null, '  ')}`);

    // "Ack" (acknowledge receipt of) the message
    message.ack();

    if (!validateCharLocationMessage(parsedData)) {
      logger.error(`Received invalid listenCharacterLocations. ${JSON.stringify(parsedData)} ${JSON.stringify(validateCharLocationMessage.errors)}`);
    } else {
      // logger.info('listenCharacterLocations validation OK');
    }

    callback(parsedData);
  };

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler);

  subscription.on('error', error => {
    logger.error('listenCharacterLocations received error:', error);
    // process.exit(1);
  });

  // if (simulateMessages) {
  //   let flag = true;
  //   // const charList = [10198, 9504, 9542, 10199, 10200, 10201, 51935];
  //   const charList = [51935];
  //   // charList.forEach((characterId) => {
  //   // });
  //   setInterval(() => {
  //     const characterId = charList[randomInteger(0, charList.length - 1)];
  //     callback({
  //       characterId,
  //       stateFrom: 'healthy',
  //       // stateTo: bodyConditions[randomInteger(0, bodyConditions.length - 1)],
  //       stateTo: 'clinically_dead',
  //       // stateFrom: flag ? 'clinically_dead' : 'healthy',
  //       // stateTo: !flag ? 'clinically_dead' : 'healthy',
  //       timestamp: moment.utc().valueOf(),
  //     });
  //     flag = !flag;
  //   // }, 3000);
  //   // }, 30000);
  //   }, 3000);
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
