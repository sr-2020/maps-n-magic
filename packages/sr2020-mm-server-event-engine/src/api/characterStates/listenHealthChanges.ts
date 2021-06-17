import { PubSub, Message } from '@google-cloud/pubsub';
import Ajv, { JSONSchemaType } from "ajv";
import { rescueServiceSubscriptionName } from "../constants";
import { BodyConditionValues } from "sr2020-mm-event-engine";

const timeout = 60;

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

export type HealthChangeMessage = {
  characterId: number,
  stateFrom: BodyConditionValues, 
  stateTo: BodyConditionValues, 
  timestamp: number,
}

const ajv = new Ajv({
  allErrors: true,
  // removeAdditional: true,
  // useDefaults: true
});

const healthChangeMessageSchema: JSONSchemaType<HealthChangeMessage> = {
  type: "object",
  properties: {
    characterId: {type: "integer"},
    stateFrom: {type: "string", enum: [
      "healthy", "wounded", "clinically_dead", "biologically_dead"
    ]},
    stateTo: {type: "string", enum: [
      "healthy", "wounded", "clinically_dead", "biologically_dead"
    ]},
    timestamp: {type: "integer"}
  },
  required: ["characterId", "stateFrom", "stateTo", "timestamp"],
  // additionalProperties: false,
};

export const validateHealthChangeMessage = ajv.compile(healthChangeMessageSchema);


export function listenHealthChanges(callback: (msg: HealthChangeMessage) => void, simulateMessages = false) {
  // References an existing subscription
  const subscription = pubSubClient.subscription(rescueServiceSubscriptionName);

  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = (message: Message) => {
    // console.log(`Received message ${message.id}:`);
    // console.log(`\tData: ${message.data}`);
    const parsedData: HealthChangeMessage = JSON.parse(message.data.toString());
    // console.log(`Data: ${JSON.stringify(parsedData, null, '  ')}`);
    // console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;
    // console.log(`listenHealthChanges data: ${JSON.stringify(parsedData, null, '  ')}`);

    if (!validateHealthChangeMessage(parsedData)) {
      console.error(`Received invalid listenHealthChanges. ${JSON.stringify(parsedData)} ${JSON.stringify(validateHealthChangeMessage.errors)}`);
    } else {
      console.log('listenHealthChanges validation OK');
    }
    // console.log(`listenHealthChanges validation OK ${JSON.stringify(parsedData)}`);

    // listenHealthChanges data: {
    //   "characterId": 51935,
    //   "characterName": "Новый персонаж в группе Мастера и приложение",
    //   "stateFrom": "clinically_dead",
    //   "stateTo": "healthy",
    //   "timestamp": 1606017590767
    // }

    // "Ack" (acknowledge receipt of) the message
    message.ack();
    callback(parsedData);
  };

  // Listen for new messages until timeout is hit
  subscription.on('message', messageHandler);

  subscription.on('error', error => {
    console.error('listenHealthChanges received error:', error);
    process.exit(1);
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
  //       stateTo: bodyConditions[randomInteger(0, bodyConditions.length - 1)],
  //       // stateTo: 'clinically_dead',
  //       // stateFrom: flag ? 'clinically_dead' : 'healthy',
  //       // stateTo: !flag ? 'clinically_dead' : 'healthy',
  //       timestamp: moment.utc().valueOf(),
  //     });
  //     flag = !flag;
  //   // }, 3000);
  //   }, 30000);
  //   // }, 3000);

  //   // const characterId = charList[randomInteger(0, charList.length - 1)];
  //   // callback({
  //   //   characterId,
  //   //   stateFrom: 'healthy',
  //   //   // stateTo: bodyConditions[randomInteger(0, bodyConditions.length - 1)],
  //   //   stateTo: 'clinically_dead',
  //   //   // stateFrom: flag ? 'clinically_dead' : 'healthy',
  //   //   // stateTo: !flag ? 'clinically_dead' : 'healthy',
  //   //   timestamp: moment.utc().valueOf(),
  //   // });
  //   // flag = !flag;

  //   // }, 500);
  //   // }, 100);
  // }

  // setTimeout(() => {
  //   subscription.removeListener('message', messageHandler);
  //   console.log(`${messageCount} message(s) received.`);
  // }, timeout * 1000);
}

// exports.listenHealthChanges = listenHealthChanges;
// console.log('process.env.NODE_ENV', process.env.NODE_ENV);
// throw new Error('boom');
